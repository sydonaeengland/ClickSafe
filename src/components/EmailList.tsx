import { mockEmails, type Email } from '@/lib/mockData';
import { RiskBadge } from './RiskBadge';
import { scanText, type RiskLevel } from '@/lib/scanEngine';
import { Star, Mail, MailOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailListProps {
  onSelectEmail: (email: Email) => void;
  selectedEmailId?: string;
  emails?: Email[];
}

export function EmailList({ onSelectEmail, selectedEmailId, emails }: EmailListProps) {
  const displayEmails = emails || mockEmails;
  
  return (
    <div className="divide-y divide-border">
      {displayEmails.map((email, index) => {
        const scanResult = scanText(email.body);
        const isSelected = email.id === selectedEmailId;

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
                <RiskBadge level={scanResult.riskLevel} size="sm" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function getEmailRiskLevel(email: Email): RiskLevel {
  const scanResult = scanText(email.body);
  return scanResult.riskLevel;
}
