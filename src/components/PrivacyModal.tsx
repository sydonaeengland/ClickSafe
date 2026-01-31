import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Eye, Trash2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const privacyPoints = [
  {
    icon: Eye,
    title: 'Read-Only Access',
    description: 'We only read email content for scanning. ClickSafe cannot send, delete, or modify your emails.',
  },
  {
    icon: Trash2,
    title: 'No Content Storage',
    description: 'Email content, screenshots, and pasted text are never permanently stored. Only scan metadata is logged.',
  },
  {
    icon: Lock,
    title: 'Secure Processing',
    description: 'All scans are processed securely. Your data is encrypted in transit and never shared with third parties.',
  },
  {
    icon: Shield,
    title: 'Your Control',
    description: 'Disconnect your email account anytime. Use "Save Scan" only if you explicitly want to keep a report.',
  },
];

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Lock className="h-4 w-4" />
            </div>
            Privacy & Security
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {privacyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <point.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm font-medium text-primary">
            "ClickSafe never sends or deletes your emails."
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
