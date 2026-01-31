import { useState } from 'react';
import { Header } from '@/components/Header';
import { EmailList } from '@/components/EmailList';
import { EmailDetail } from '@/components/EmailDetail';
import { type Email, mockEmails } from '@/lib/mockData';
import { Inbox as InboxIcon, Mail, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { scanText } from '@/lib/scanEngine';

const Inbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Calculate inbox stats
  const stats = mockEmails.reduce(
    (acc, email) => {
      const result = scanText(email.body);
      if (result.riskLevel === 'high') acc.high++;
      else if (result.riskLevel === 'medium') acc.medium++;
      else acc.low++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const handleConnectGmail = () => {
    // In a real app, this would initiate OAuth flow
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Connect Gmail Banner */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Connect Your Gmail</h3>
                <p className="text-sm text-muted-foreground">
                  Scan your inbox automatically for phishing emails
                </p>
              </div>
            </div>
            <Button onClick={handleConnectGmail} className="cyber-button shrink-0">
              Connect Gmail
            </Button>
          </motion.div>
        )}

        {/* Demo Inbox Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent/50 border border-border rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <InboxIcon className="h-5 w-5 text-primary shrink-0" />
          <div>
            <span className="font-medium text-foreground">Demo Inbox</span>
            <span className="text-muted-foreground"> – These are sample emails to demonstrate ClickSafe's detection capabilities.</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="cyber-card text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-risk-high" />
              <span className="text-2xl font-bold text-risk-high">{stats.high}</span>
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </div>
          <div className="cyber-card text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-risk-medium" />
              <span className="text-2xl font-bold text-risk-medium">{stats.medium}</span>
            </div>
            <div className="text-sm text-muted-foreground">Medium Risk</div>
          </div>
          <div className="cyber-card text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-risk-low" />
              <span className="text-2xl font-bold text-risk-low">{stats.low}</span>
            </div>
            <div className="text-sm text-muted-foreground">Low Risk</div>
          </div>
        </motion.div>

        {/* Email List or Detail View */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card overflow-hidden"
        >
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <InboxIcon className="h-5 w-5 text-primary" />
                  Inbox ({mockEmails.length})
                </h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <EmailList
                onSelectEmail={setSelectedEmail}
                selectedEmailId={selectedEmail?.id}
              />
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Inbox;
