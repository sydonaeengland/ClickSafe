import { useState, useEffect } from 'react';
import { mockEmails, type Email } from '@/lib/mockData';
import { RiskBadge } from './RiskBadge';
import { scanEmail, type ScanResponse } from '@/lib/scanApi';
import { type RiskLevel } from '@/lib/scanEngine';
import { Star, Mail, MailOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ScanStats {
  high: number;
  medium: number;
  low: number;
  scanning: number;
}

interface EmailListProps {
  onSelectEmail: (email: Email) => void;
  selectedEmailId?: string;
  emails?: Email[];
  onStatsChange?: (stats: ScanStats) => void;
}

// Cache for scan results
const scanCache = new Map<string, ScanResponse>();

// Convert API risk level to local risk level
function normalizeRiskLevel(apiLevel: ScanResponse['riskLevel']): RiskLevel {
  const levelMap: Record<ScanResponse['riskLevel'], RiskLevel> = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
    'Critical': 'high', // Map Critical to high for badge display
  };
  return levelMap[apiLevel] || 'low';
}

export function EmailList({ onSelectEmail, selectedEmailId, emails, onStatsChange }: EmailListProps) {
  const displayEmails = emails || mockEmails;
  const [scanResults, setScanResults] = useState<Map<string, ScanResponse>>(new Map());
  const [scanningIds, setScanningIds] = useState<Set<string>>(new Set());

  // Calculate and report stats whenever scan results change
  useEffect(() => {
    if (!onStatsChange) return;
    
    const stats: ScanStats = { high: 0, medium: 0, low: 0, scanning: scanningIds.size };
    
    for (const email of displayEmails) {
      const result = scanResults.get(email.id);
      if (result) {
        const level = normalizeRiskLevel(result.riskLevel);
        if (level === 'high') stats.high++;
        else if (level === 'medium') stats.medium++;
        else stats.low++;
      }
    }
    
    onStatsChange(stats);
  }, [scanResults, scanningIds, displayEmails, onStatsChange]);

  // Scan emails via API on mount
  useEffect(() => {
    const scanEmails = async () => {
      for (const email of displayEmails) {
        // Skip if already cached
        if (scanCache.has(email.id)) {
          setScanResults(prev => new Map(prev).set(email.id, scanCache.get(email.id)!));
          continue;
        }

        // Skip if already scanning
        if (scanningIds.has(email.id)) continue;

        setScanningIds(prev => new Set(prev).add(email.id));

        try {
          const result = await scanEmail(email.body || email.snippet);
          scanCache.set(email.id, result);
          setScanResults(prev => new Map(prev).set(email.id, result));
        } catch (error) {
          console.error(`Failed to scan email ${email.id}:`, error);
        } finally {
          setScanningIds(prev => {
            const next = new Set(prev);
            next.delete(email.id);
            return next;
          });
        }
      }
    };

    scanEmails();
  }, [displayEmails]);
  
  return (
    <div className="divide-y divide-border">
      {displayEmails.map((email, index) => {
        const scanResult = scanResults.get(email.id);
        const isScanning = scanningIds.has(email.id);
        const isSelected = email.id === selectedEmailId;
        const riskLevel = scanResult ? normalizeRiskLevel(scanResult.riskLevel) : 'low';

        return (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectEmail(email)}
            className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
              isSelected ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Star & Read status */}
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <Star
                  className={`h-4 w-4 ${
                    email.starred
                      ? 'fill-risk-medium text-risk-medium'
                      : 'text-muted-foreground'
                  }`}
                />
                {email.read ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
              </div>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`font-medium truncate ${
                      email.read ? 'text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {email.from}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {email.time}
                  </span>
                </div>
                <div
                  className={`text-sm truncate mb-1 ${
                    email.read ? 'text-muted-foreground' : 'text-foreground font-medium'
                  }`}
                >
                  {email.subject}
                </div>
                <div className="text-xs text-muted-foreground truncate mb-2">
                  {email.snippet}
                </div>
                {isScanning ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Scanning...</span>
                  </div>
                ) : (
                  <RiskBadge level={riskLevel} size="sm" />
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function getEmailRiskLevel(email: Email): RiskLevel {
  const cached = scanCache.get(email.id);
  return cached ? normalizeRiskLevel(cached.riskLevel) : 'low';
}
