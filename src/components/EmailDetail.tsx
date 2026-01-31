import { useState, useEffect } from 'react';
import { type Email } from '@/lib/mockData';
import { scanEmail, type ScanResponse } from '@/lib/scanApi';
import { ScanResults } from './ScanResults';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useGmail } from '@/contexts/GmailContext';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
}

export function EmailDetail({ email, onBack }: EmailDetailProps) {
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [fullBody, setFullBody] = useState<string>(email.body);
  const [isLoadingBody, setIsLoadingBody] = useState(false);
  const { getEmailDetail, isConnected } = useGmail();

  // Fetch full email body from Gmail API if connected
  useEffect(() => {
    const fetchFullBody = async () => {
      // Only fetch if connected and the body looks like a snippet (short)
      if (isConnected && email.body.length < 200) {
        setIsLoadingBody(true);
        try {
          const detail = await getEmailDetail(email.id);
          if (detail?.body) {
            setFullBody(detail.body);
          }
        } catch (error) {
          console.error('Failed to fetch full email body:', error);
        } finally {
          setIsLoadingBody(false);
        }
      }
    };

    fetchFullBody();
  }, [email.id, email.body, isConnected, getEmailDetail]);

  // Scan email after body is loaded
  useEffect(() => {
    if (isLoadingBody) return;
    
    const performScan = async () => {
      setIsScanning(true);
      try {
        const result = await scanEmail(fullBody);
        setScanResult(result);
      } catch (error) {
        console.error('Failed to scan email:', error);
      } finally {
        setIsScanning(false);
      }
    };

    performScan();
  }, [fullBody, isLoadingBody]);

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
        {isScanning || isLoadingBody ? (
          <div className="cyber-card flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isLoadingBody ? 'Loading email content...' : 'Analyzing email with AI...'}
              </p>
            </div>
          </div>
        ) : scanResult ? (
          <ScanResults result={scanResult} originalContent={fullBody} />
        ) : (
          <div className="cyber-card text-center py-8 text-muted-foreground">
            Failed to scan email. Please try again.
          </div>
        )}
      </div>

      {/* Original Email Body */}
      <div className="cyber-card">
        <h3 className="font-semibold text-foreground mb-3">Original Message</h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-mono">
          {fullBody}
        </div>
      </div>
    </motion.div>
  );
}
