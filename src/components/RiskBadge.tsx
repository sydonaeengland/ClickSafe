import { type RiskLevel } from '@/lib/scanEngine';
import { Shield, AlertTriangle, XCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, showIcon = true, size = 'md' }: RiskBadgeProps) {
  const getConfig = () => {
    switch (level) {
      case 'low':
        return {
          icon: Shield,
          label: 'Low',
          className: 'risk-badge-low',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          label: 'Medium',
          className: 'risk-badge-medium',
        };
      case 'high':
        return {
          icon: XCircle,
          label: 'High',
          className: 'risk-badge-high',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span className={`${config.className} ${sizeClasses[size]} inline-flex items-center gap-1`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
