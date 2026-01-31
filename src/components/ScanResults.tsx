import { type ScanResponse } from '@/lib/scanApi';
import { Shield, AlertTriangle, XCircle, Copy, Mail, CheckCircle, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { RiskScoreMeter } from './RiskScoreMeter';

interface ScanResultsProps {
  result: ScanResponse;
  originalContent: string;
}

function formatReportForCopy(result: ScanResponse, originalContent: string): string {
  return `ClickSafe Scan Report
====================
Risk Level: ${result.riskLevel} (${result.riskScore}/100)
Category: ${result.category} (${Math.round(result.categoryConfidence * 100)}% confidence)
Safe to Open: ${result.safeToOpen ? 'Yes' : 'No'}

Red Flags:
${result.redFlags.map(f => `• ${f}`).join('\n')}

Explanation:
${result.explanation}

Safety Advice:
${result.safetyAdvice.map(a => `• ${a}`).join('\n')}

Original Content:
${originalContent.substring(0, 500)}${originalContent.length > 500 ? '...' : ''}
`;
}

function formatReportForEmail(result: ScanResponse, originalContent: string): string {
  return `Hello IT Security Team,

I'm reporting a suspicious message that was flagged by ClickSafe.

RISK LEVEL: ${result.riskLevel} (${result.riskScore}/100)
CATEGORY: ${result.category}

RED FLAGS DETECTED:
${result.redFlags.map(f => `- ${f}`).join('\n')}

EXPLANATION:
${result.explanation}

ORIGINAL CONTENT:
${originalContent.substring(0, 500)}${originalContent.length > 500 ? '...' : ''}

Please investigate. Thank you.
`;
}

export function ScanResults({ result, originalContent }: ScanResultsProps) {
  const handleCopyReport = () => {
    const report = formatReportForCopy(result, originalContent);
    navigator.clipboard.writeText(report);
    toast.success('Report copied to clipboard!');
  };

  const handleReportToIT = () => {
    const subject = encodeURIComponent(`[ClickSafe Alert] Suspicious ${result.riskLevel.toUpperCase()} Risk Content Detected`);
    const body = encodeURIComponent(formatReportForEmail(result, originalContent));
    window.location.href = `mailto:it-security@uwi.edu?subject=${subject}&body=${body}`;
  };

  const getRiskConfig = () => {
    switch (result.riskLevel) {
      case 'Low':
        return {
          icon: Shield,
          label: 'Low Risk',
          bgClass: 'bg-risk-low-bg',
          textClass: 'text-risk-low',
          borderClass: 'border-risk-low/30',
          gradientClass: 'from-risk-low/20 to-risk-low/5',
        };
      case 'Medium':
        return {
          icon: AlertTriangle,
          label: 'Medium Risk',
          bgClass: 'bg-risk-medium-bg',
          textClass: 'text-risk-medium',
          borderClass: 'border-risk-medium/30',
          gradientClass: 'from-risk-medium/20 to-risk-medium/5',
        };
      case 'High':
        return {
          icon: XCircle,
          label: 'High Risk',
          bgClass: 'bg-risk-high-bg',
          textClass: 'text-risk-high',
          borderClass: 'border-risk-high/30',
          gradientClass: 'from-risk-high/20 to-risk-high/5',
        };
      case 'Critical':
        return {
          icon: Skull,
          label: 'Critical Risk',
          bgClass: 'bg-risk-high-bg',
          textClass: 'text-risk-high',
          borderClass: 'border-risk-high/50',
          gradientClass: 'from-risk-high/30 to-risk-high/10',
        };
    }
  };

  const config = getRiskConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cyber-card border-2 ${config.borderClass} overflow-hidden`}
    >
      {/* Risk Score Meter */}
      <div className={`-mx-6 -mt-6 mb-6 px-6 py-8 bg-gradient-to-r ${config.gradientClass}`}>
        <RiskScoreMeter
          score={result.riskScore}
          riskLevel={result.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'}
          category={result.category}
          categoryConfidence={result.categoryConfidence}
        />
      </div>

      {/* Safety Status */}
      <div className={`mb-6 p-4 rounded-lg ${result.safeToOpen ? 'bg-risk-low/10 border border-risk-low/30' : 'bg-risk-high/10 border border-risk-high/30'}`}>
        <div className="flex items-center gap-2">
          {result.safeToOpen ? (
            <>
              <CheckCircle className="h-5 w-5 text-risk-low" />
              <span className="font-medium text-risk-low">Appears Safe to Open</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-risk-high" />
              <span className="font-medium text-risk-high">Exercise Caution - Do Not Engage</span>
            </>
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

      {/* What This Means */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-2">What This Means</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {/* What To Do Next */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-risk-low" />
          What To Do Next
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
          Copy Scan Report
        </Button>
        <Button variant="outline" onClick={handleReportToIT} className="flex items-center gap-2 border-risk-high/30 text-risk-high hover:bg-risk-high/10">
          <Mail className="h-4 w-4" />
          Report to UWI IT
        </Button>
      </div>
    </motion.div>
  );
}
