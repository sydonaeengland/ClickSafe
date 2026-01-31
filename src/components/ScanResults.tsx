import { type ScanResult } from '@/lib/scanEngine';
import { Shield, AlertTriangle, XCircle, Copy, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatReportForCopy, formatReportForEmail } from '@/lib/scanEngine';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ScanResultsProps {
  result: ScanResult;
  originalContent: string;
}

export function ScanResults({ result, originalContent }: ScanResultsProps) {
  const handleCopyReport = () => {
    const report = formatReportForCopy(result, originalContent);
    navigator.clipboard.writeText(report);
    toast.success('Report copied to clipboard!');
  };

  const handleReportToIT = () => {
    const subject = encodeURIComponent(`[PhishGuard Alert] Suspicious ${result.riskLevel.toUpperCase()} Risk Content Detected`);
    const body = encodeURIComponent(formatReportForEmail(result, originalContent));
    window.location.href = `mailto:it-security@university.edu?subject=${subject}&body=${body}`;
  };

  const getRiskConfig = () => {
    switch (result.riskLevel) {
      case 'low':
        return {
          icon: Shield,
          label: 'Low Risk',
          bgClass: 'bg-risk-low-bg',
          textClass: 'text-risk-low',
          borderClass: 'border-risk-low/30',
          gradientClass: 'from-risk-low/20 to-risk-low/5',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          label: 'Medium Risk',
          bgClass: 'bg-risk-medium-bg',
          textClass: 'text-risk-medium',
          borderClass: 'border-risk-medium/30',
          gradientClass: 'from-risk-medium/20 to-risk-medium/5',
        };
      case 'high':
        return {
          icon: XCircle,
          label: 'High Risk',
          bgClass: 'bg-risk-high-bg',
          textClass: 'text-risk-high',
          borderClass: 'border-risk-high/30',
          gradientClass: 'from-risk-high/20 to-risk-high/5',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cyber-card border-2 ${config.borderClass} overflow-hidden`}
    >
      {/* Risk Header */}
      <div className={`-mx-6 -mt-6 mb-6 px-6 py-4 bg-gradient-to-r ${config.gradientClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bgClass} ${config.textClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className={`text-sm font-medium ${config.textClass}`}>{config.label}</div>
              <div className="text-2xl font-bold text-foreground">
                Score: {result.riskScore}/100
              </div>
            </div>
          </div>
          {result.scamCategory && (
            <div className="hidden sm:block">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${config.bgClass} ${config.textClass}`}>
                {result.scamCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Red Flags */}
      {result.redFlags.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-risk-high" />
            Red Flags Detected
          </h4>
          <ul className="space-y-2">
            {result.redFlags.map((flag, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <XCircle className="h-4 w-4 text-risk-high shrink-0 mt-0.5" />
                <span className="text-foreground">{flag}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-2">Explanation</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {/* Safety Advice */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-risk-low" />
          Safety Advice
        </h4>
        <ul className="space-y-2">
          {result.safetyAdvice.map((advice, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-2 text-sm"
            >
              <CheckCircle className="h-4 w-4 text-risk-low shrink-0 mt-0.5" />
              <span className="text-foreground">{advice}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={handleCopyReport} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy Report
        </Button>
        <Button variant="outline" onClick={handleReportToIT} className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Report to IT
        </Button>
      </div>
    </motion.div>
  );
}
