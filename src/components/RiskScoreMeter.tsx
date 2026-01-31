import { motion } from 'framer-motion';
import { Shield, AlertTriangle, XCircle, Skull } from 'lucide-react';

type MeterRiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface RiskScoreMeterProps {
  score: number;
  riskLevel: MeterRiskLevel;
  category?: string;
  categoryConfidence?: number;
}

export function RiskScoreMeter({ score, riskLevel, category, categoryConfidence }: RiskScoreMeterProps) {
  // Calculate the rotation angle for the needle (0-100 maps to -90 to 90 degrees)
  const needleRotation = -90 + (score / 100) * 180;
  
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'low':
        return {
          icon: Shield,
          label: 'Low Risk',
          color: 'hsl(var(--risk-low))',
          bgColor: 'hsl(var(--risk-low-bg))',
          glowColor: 'hsl(142 70% 50% / 0.4)',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          label: 'Medium Risk',
          color: 'hsl(var(--risk-medium))',
          bgColor: 'hsl(var(--risk-medium-bg))',
          glowColor: 'hsl(38 92% 50% / 0.4)',
        };
      case 'high':
        return {
          icon: XCircle,
          label: 'High Risk',
          color: 'hsl(var(--risk-high))',
          bgColor: 'hsl(var(--risk-high-bg))',
          glowColor: 'hsl(0 72% 50% / 0.4)',
        };
      case 'critical':
        return {
          icon: Skull,
          label: 'Critical Risk',
          color: 'hsl(var(--risk-high))',
          bgColor: 'hsl(var(--risk-high-bg))',
          glowColor: 'hsl(0 72% 50% / 0.55)',
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Risk',
          color: 'hsl(var(--risk-medium))',
          bgColor: 'hsl(var(--risk-medium-bg))',
          glowColor: 'hsl(38 92% 50% / 0.35)',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      {/* Gauge Container */}
      <div className="relative w-64 h-36 mb-4">
        {/* Background Arc */}
        <svg
          viewBox="0 0 200 110"
          className="w-full h-full"
          style={{ filter: `drop-shadow(0 0 20px ${config.glowColor})` }}
        >
          {/* Background arc segments */}
          <defs>
            <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(142 70% 50%)" />
              <stop offset="100%" stopColor="hsl(142 70% 45%)" />
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(38 92% 50%)" />
              <stop offset="100%" stopColor="hsl(38 92% 45%)" />
            </linearGradient>
            <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0 72% 55%)" />
              <stop offset="100%" stopColor="hsl(0 72% 50%)" />
            </linearGradient>
          </defs>
          
          {/* Gauge background */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="16"
            strokeLinecap="round"
          />
          
          {/* Low risk segment (0-33%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 35"
            fill="none"
            stroke="url(#lowGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Medium risk segment (33-66%) */}
          <path
            d="M 60 35 A 80 80 0 0 1 140 35"
            fill="none"
            stroke="url(#mediumGradient)"
            strokeWidth="16"
            opacity="0.8"
          />
          
          {/* High risk segment (66-100%) */}
          <path
            d="M 140 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#highGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.3 }}
            style={{ transformOrigin: '100px 100px' }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke={config.color}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${config.glowColor})` }}
            />
            <circle
              cx="100"
              cy="100"
              r="8"
              fill={config.color}
              style={{ filter: `drop-shadow(0 0 8px ${config.glowColor})` }}
            />
          </motion.g>
        </svg>
        
        {/* Score Display */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-baseline justify-center gap-1"
          >
            <span
              className="text-5xl font-bold"
              style={{ color: config.color, textShadow: `0 0 20px ${config.glowColor}` }}
            >
              {score}
            </span>
            <span className="text-xl text-muted-foreground">/100</span>
          </motion.div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          backgroundColor: config.bgColor,
          boxShadow: `0 0 20px ${config.glowColor}`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: config.color }} />
        <span className="font-semibold" style={{ color: config.color }}>
          {config.label}
        </span>
      </motion.div>

      {/* Category */}
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-3 text-center"
        >
          <div className="text-sm text-muted-foreground">Detected Scam Type</div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-foreground font-medium capitalize">
              {category.replace(/_/g, ' ')}
            </span>
            {categoryConfidence && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {categoryConfidence}% confidence
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
