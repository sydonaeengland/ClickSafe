import { type Email } from '@/lib/mockData';
import { scanText } from '@/lib/scanEngine';
import { ScanResults } from './ScanResults';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
}

export function EmailDetail({ email, onBack }: EmailDetailProps) {
  const scanResult = scanText(email.body);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">
            {email.subject}
          </h2>
        </div>
      </div>

      {/* Email Info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{email.from}</span>
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {email.fromEmail}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {email.time}
          </div>
        </div>
      </div>

      {/* Scan Results */}
      <div className="mb-6">
        <ScanResults result={scanResult} originalContent={email.body} />
      </div>

      {/* Original Email Body */}
      <div className="cyber-card">
        <h3 className="font-semibold text-foreground mb-3">Original Message</h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-mono">
          {email.body}
        </div>
      </div>
    </motion.div>
  );
}
