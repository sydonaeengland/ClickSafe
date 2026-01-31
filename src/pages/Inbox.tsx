import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { EmailList, type ScanStats } from '@/components/EmailList';
import { EmailDetail } from '@/components/EmailDetail';
import { type Email, mockEmails } from '@/lib/mockData';
import { Inbox as InboxIcon, Mail, AlertTriangle, Shield, RefreshCw, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useGmail } from '@/contexts/GmailContext';
import { toast } from 'sonner';

// Google icon component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Microsoft/Outlook icon component
const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.229c.101.077.218.115.35.115.133 0 .249-.038.35-.115l6.827-5.262c.107-.077.165-.188.165-.33 0-.226-.137-.345-.412-.357h-17.03c-.275.012-.412.131-.412.357 0 .142.058.253.165.33l6.827 5.262c.101.077.217.115.35.115.133 0 .249-.038.35-.115l1.6-1.229v6.959H.818c-.228 0-.422-.076-.58-.23C.08 18.289 0 18.095 0 17.865V7.387c0-.107.018-.207.055-.3.035-.094.082-.174.14-.24l.234-.207h22.15c.108 0 .208.06.302.18l.065.087c.035.071.054.165.054.28z"/>
  </svg>
);

const Inbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showDemo, setShowDemo] = useState(true);
  const { isConnected, isLoading, user, emails, error, connectGmail, disconnectGmail, fetchEmails } = useGmail();

  // Fetch emails when connected
  useEffect(() => {
    if (isConnected && emails.length === 0) {
      fetchEmails();
      setShowDemo(false);
    }
  }, [isConnected, emails.length, fetchEmails]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Calculate inbox stats from demo or real emails
  const currentEmails: Email[] = showDemo ? mockEmails : emails.map((e, i) => ({
    id: e.id,
    from: e.from.split('<')[0].trim() || e.from,
    fromEmail: e.from.match(/<(.+)>/)?.[1] || e.from,
    subject: e.subject,
    snippet: e.snippet,
    body: e.snippet, // Will be fetched on detail view
    time: new Date(e.date).toLocaleDateString(),
    date: new Date(e.date),
    read: i >= 3,
    starred: false,
  }));

  const [stats, setStats] = useState<ScanStats>({ high: 0, medium: 0, low: 0, scanning: 0 });
  
  const handleStatsChange = useCallback((newStats: ScanStats) => {
    setStats(newStats);
  }, []);

  const handleConnectGmail = async () => {
    try {
      await connectGmail();
    } catch (e) {
      console.error('Failed to connect Gmail:', e);
    }
  };

  const handleConnectOutlook = () => {
    toast.info('Outlook integration may require admin approval. Use Gmail or Quick Scan for now.');
  };

  const handleRefresh = async () => {
    if (isConnected) {
      await fetchEmails();
      toast.success('Inbox refreshed');
    }
  };

  const handleDisconnect = () => {
    disconnectGmail();
    setShowDemo(true);
    toast.success('Disconnected from Gmail');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Connect Email Banner */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card mb-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Connect Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan your inbox automatically for phishing emails
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleConnectGmail} 
                  disabled={isLoading}
                  className="cyber-button"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="ml-2">Connect Gmail</span>
                </Button>
                
                <Button 
                  onClick={handleConnectOutlook}
                  variant="outline"
                  className="border-[#0078D4]/30 hover:bg-[#0078D4]/10"
                >
                  <div className="text-[#0078D4]">
                    <OutlookIcon />
                  </div>
                  <span className="ml-2">Connect Outlook</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connected User Banner */}
        {isConnected && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-risk-low-bg border border-risk-low/30 rounded-lg p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="font-medium text-foreground">{user.name || user.email}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </motion.div>
        )}

        {/* Demo Inbox Notice */}
        {showDemo && (
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
        )}

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
                  Inbox ({currentEmails.length})
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
              <EmailList
                onSelectEmail={setSelectedEmail}
                selectedEmailId={selectedEmail?.id}
                emails={currentEmails}
                onStatsChange={handleStatsChange}
              />
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Inbox;
