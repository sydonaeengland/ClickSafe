import { Header } from '@/components/Header';
import { Shield, Brain, Lock, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
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
            About PhishGuard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An AI-powered phishing and scam detection platform built specifically for university students.
          </p>
        </motion.div>

        {/* What We Do */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            What PhishGuard Does
          </h2>
          <p className="text-muted-foreground mb-4">
            PhishGuard helps you identify phishing emails, scam messages, and malicious links before you fall victim to them. 
            Our platform analyzes suspicious content and provides clear, actionable explanations of potential risks.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Gmail-style inbox scanning',
              'Manual text and URL analysis',
              'Screenshot OCR extraction',
              'Clear risk scoring (0-100)',
              'Detailed explanations of red flags',
              'One-click IT department reporting',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-risk-low shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Why Students */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-risk-medium" />
            Why Students Are Targeted
          </h2>
          <p className="text-muted-foreground mb-4">
            University students are prime targets for scammers for several reasons:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-xl">💰</span>
              <span><strong className="text-foreground">Financial pressure</strong> – Students actively seek scholarships, jobs, and financial aid, making them susceptible to fake offers.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">📱</span>
              <span><strong className="text-foreground">Digital natives</strong> – While tech-savvy, many students haven't developed the skepticism needed to spot sophisticated scams.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🏫</span>
              <span><strong className="text-foreground">Trust in institutions</strong> – Scammers exploit trust by impersonating universities, professors, and official departments.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">⏰</span>
              <span><strong className="text-foreground">Time pressure</strong> – Busy schedules mean less time to verify suspicious messages, especially those with artificial urgency.</span>
            </li>
          </ul>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            How AI + Rules Work Together
          </h2>
          <p className="text-muted-foreground mb-4">
            PhishGuard uses a hybrid approach that combines the best of rule-based detection and AI explanation:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Rule-Based Detection</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Deterministic pattern matching that scans for:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Urgency language ("act now", "expires today")</li>
                <li>• Credential requests (passwords, SSN)</li>
                <li>• Threat language ("account suspended")</li>
                <li>• Suspicious/shortened URLs</li>
                <li>• Brand impersonation attempts</li>
              </ul>
            </div>
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">AI Explanation Layer</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Natural language processing that provides:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Scam category classification</li>
                <li>• Plain-language explanations</li>
                <li>• Student-friendly safety advice</li>
                <li>• Context-aware risk assessment</li>
                <li>• Actionable recommendations</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-risk-low" />
            Privacy-First Design
          </h2>
          <p className="text-muted-foreground mb-4">
            Your privacy is paramount. PhishGuard is designed with the following principles:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-risk-low shrink-0 mt-0.5" />
              <span><strong className="text-foreground">No permanent storage</strong> – Your emails and messages are never stored on our servers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-risk-low shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Local processing</strong> – OCR and initial scanning happen in your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-risk-low shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Encrypted communications</strong> – All data transmission is secured with TLS</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-risk-low shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Minimal collection</strong> – We only collect anonymous usage statistics</span>
            </li>
          </ul>
        </motion.section>

        {/* Limitations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card border-2 border-risk-medium/30"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-risk-medium" />
            Limitations
          </h2>
          <p className="text-muted-foreground mb-4">
            While PhishGuard is a powerful tool, please be aware of its limitations:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Cannot directly scan WhatsApp/SMS inboxes</strong> – Use screenshot upload or paste text instead</span>
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span><strong className="text-foreground">OCR may not be 100% accurate</strong> – Always review extracted text before scanning</span>
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Not a replacement for judgment</strong> – Use our analysis as guidance, not absolute truth</span>
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Demo inbox only</strong> – Full Gmail integration requires additional setup</span>
            </li>
          </ul>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>Built with ❤️ for student safety</p>
          <p className="mt-1">Hackathon Project 2024</p>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
