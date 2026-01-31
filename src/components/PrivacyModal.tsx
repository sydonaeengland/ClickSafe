import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Eye, Trash2, Server } from 'lucide-react';

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const privacyPoints = [
  {
    icon: Eye,
    title: 'No Permanent Storage',
    description: 'Your emails and messages are analyzed in real-time and never stored on our servers. All data is processed locally when possible.',
  },
  {
    icon: Trash2,
    title: 'Automatic Deletion',
    description: 'Any temporarily processed data is immediately deleted after analysis. We don\'t keep logs of what you scan.',
  },
  {
    icon: Shield,
    title: 'End-to-End Security',
    description: 'All communications are encrypted. Your data never leaves your browser for local scans.',
  },
  {
    icon: Server,
    title: 'Minimal Data Collection',
    description: 'We only collect anonymous usage statistics to improve our detection algorithms. No personal information is ever collected.',
  },
];

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy & Security
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <p className="text-muted-foreground">
            PhishGuard is designed with privacy as a core principle. Here's how we protect your data:
          </p>

          <div className="space-y-4">
            {privacyPoints.map((point, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <point.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{point.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{point.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-accent/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This is a hackathon demonstration project. 
              For production use, additional security measures would be implemented including SOC 2 compliance, 
              GDPR adherence, and regular security audits.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
