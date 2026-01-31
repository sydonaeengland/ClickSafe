import { useState } from 'react';
import { Header } from '@/components/Header';
import { TextScanner } from '@/components/TextScanner';
import { UrlScanner } from '@/components/UrlScanner';
import { ScreenshotScanner } from '@/components/ScreenshotScanner';
import { ScanResults } from '@/components/ScanResults';
import { Shield, MessageSquare, Link2, Image, Sparkles, Mail, AlertTriangle, ChevronRight, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { type ScanResult, scanText } from '@/lib/scanEngine';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TutorialModal } from '@/components/TutorialModal';

// Microsoft/Outlook icon component
const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.229c.101.077.218.115.35.115.133 0 .249-.038.35-.115l6.827-5.262c.107-.077.165-.188.165-.33 0-.226-.137-.345-.412-.357h-17.03c-.275.012-.412.131-.412.357 0 .142.058.253.165.33l6.827 5.262c.101.077.217.115.35.115.133 0 .249-.038.35-.115l1.6-1.229v6.959H.818c-.228 0-.422-.076-.58-.23C.08 18.289 0 18.095 0 17.865V7.387c0-.107.018-.207.055-.3.035-.094.082-.174.14-.24l.234-.207h22.15c.108 0 .208.06.302.18l.065.087c.035.071.054.165.054.28zM14.625 5.155c0-.226-.076-.418-.227-.576-.152-.158-.343-.236-.573-.236H.8c-.23 0-.421.078-.573.236-.152.158-.227.35-.227.576V5.9h14.625v-.745z"/>
  </svg>
);

// Google icon component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Index = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scannedContent, setScannedContent] = useState('');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const navigate = useNavigate();

  const handleTextScanComplete = (result: ScanResult, originalText: string) => {
    setScanResult(result);
    setScannedContent(originalText);
  };

  const handleUrlScanComplete = (result: ScanResult, originalUrl: string) => {
    setScanResult(result);
    setScannedContent(originalUrl);
  };

  const handleScreenshotText = (text: string) => {
    const result = scanText(text);
    setScanResult(result);
    setScannedContent(text);
  };

  const handleClearResults = () => {
    setScanResult(null);
    setScannedContent('');
  };

  const handleConnectGmail = () => {
    // Will be implemented with Google OAuth
    navigate('/inbox');
  };

  const handleConnectOutlook = () => {
    // Will be implemented with Microsoft OAuth
    navigate('/inbox');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow animate-neon-pulse">
              <Shield className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Think Before You <span className="text-gradient-cyber">Click</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            AI-powered phishing detection for students. Scan suspicious emails, links, 
            and screenshots instantly to protect yourself from scams.
          </p>
          
          {/* Tutorial Card */}
          <motion.button
            onClick={() => setTutorialOpen(true)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <BookOpen className="h-4 w-4" />
            How ClickSafe Works
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

        {/* Email Connection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Gmail Connection */}
            <div 
              onClick={handleConnectGmail}
              className="connection-card group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-md">
                  <GoogleIcon />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Connect Gmail
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Scan your inbox automatically
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Outlook Connection */}
            <div 
              onClick={handleConnectOutlook}
              className="connection-card group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0078D4] text-white shadow-md">
                  <OutlookIcon />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Connect Outlook
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Scan Microsoft emails
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground font-medium">or use Quick Scan</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Scan Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="cyber-card-glow mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Quick Scan</h2>
            </div>
            
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Paste Text</span>
                  <span className="sm:hidden">Text</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Paste URL</span>
                  <span className="sm:hidden">URL</span>
                </TabsTrigger>
                <TabsTrigger value="screenshot" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Screenshot</span>
                  <span className="sm:hidden">Image</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Paste any suspicious email or message content</span>
                  </div>
                  <TextScanner onScanComplete={handleTextScanComplete} />
                </div>
              </TabsContent>

              <TabsContent value="url">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    <span>Enter a suspicious link to analyze</span>
                  </div>
                  <UrlScanner onScanComplete={handleUrlScanComplete} />
                </div>
              </TabsContent>

              <TabsContent value="screenshot">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Image className="h-4 w-4" />
                    <span>Upload a screenshot for OCR text extraction</span>
                  </div>
                  <ScreenshotScanner onTextExtracted={handleScreenshotText} />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Results */}
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Scan Results
                </h2>
                <button
                  onClick={handleClearResults}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear results
                </button>
              </div>
              <ScanResults result={scanResult} originalContent={scannedContent} />
            </motion.div>
          )}

          {/* Feature Cards - Show only when no results */}
          {!scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Shield,
                  title: 'Rule-Based Detection',
                  description: 'Identifies urgency language, credential requests, and suspicious patterns',
                },
                {
                  icon: Sparkles,
                  title: 'AI Explanations',
                  description: 'Get clear, student-friendly explanations of why something is risky',
                },
                {
                  icon: AlertTriangle,
                  title: 'Risk Score Meter',
                  description: 'Visual 0-100 score with color-coded results and safety advice',
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="cyber-card text-center py-6"
                >
                  <tip.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <TutorialModal open={tutorialOpen} onOpenChange={setTutorialOpen} />
    </div>
  );
};

export default Index;
