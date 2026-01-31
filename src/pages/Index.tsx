import { useState } from 'react';
import { Header } from '@/components/Header';
import { TextScanner } from '@/components/TextScanner';
import { UrlScanner } from '@/components/UrlScanner';
import { ScreenshotScanner } from '@/components/ScreenshotScanner';
import { ScanResults } from '@/components/ScanResults';
import { Shield, MessageSquare, Link2, Image, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type ScanResult, scanText } from '@/lib/scanEngine';
import { motion } from 'framer-motion';

const Index = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scannedContent, setScannedContent] = useState('');

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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Detect Phishing & Scams
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste suspicious emails, links, or upload screenshots. Get instant AI-powered analysis
            with clear explanations and safety advice.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Scanning Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyber-card mb-8"
          >
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span className="hidden sm:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="screenshot" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Screenshot</span>
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

          {/* Quick Tips */}
          {!scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Shield,
                  title: 'Rule-Based Detection',
                  description: 'Scans for urgency language, credential requests, and suspicious patterns',
                },
                {
                  icon: Sparkles,
                  title: 'AI Explanations',
                  description: 'Get clear, student-friendly explanations of why something is risky',
                },
                {
                  icon: Image,
                  title: 'OCR Scanning',
                  description: 'Upload screenshots from your phone for instant text extraction',
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
    </div>
  );
};

export default Index;
