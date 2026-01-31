import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Scan, AlertTriangle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: 'Scan Suspicious Content',
    description: 'Connect your Gmail or Outlook, paste text, enter a URL, or upload a screenshot of a suspicious message.',
    icon: Scan,
    action: '/',
    actionLabel: 'Try Quick Scan',
  },
  {
    id: 2,
    title: 'AI-Powered Analysis',
    description: 'ClickSafe analyzes the content using rule-based detection and AI to identify phishing patterns, urgency tactics, and red flags.',
    icon: AlertTriangle,
    action: '/',
    actionLabel: 'See How It Works',
  },
  {
    id: 3,
    title: 'Get Your Risk Score',
    description: 'Receive a clear 0-100 risk score with color-coded results, detailed explanations, and actionable safety advice.',
    icon: Shield,
    action: '/top-scams',
    actionLabel: 'View Common Scams',
  },
];

export function TutorialModal({ open, onOpenChange }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const step = tutorialSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tutorialSteps.length - 1;

  const handleTryIt = () => {
    onOpenChange(false);
    navigate(step.action);
  };

  const handleNext = () => {
    if (!isLast) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep(currentStep - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            How ClickSafe Works
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 py-2">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="py-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Step {step.id} of {tutorialSteps.length}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">{step.description}</p>
              <Button onClick={handleTryIt} className="cyber-button">
                {step.actionLabel}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirst}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={isLast}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 pt-4 border-t border-border bg-muted/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <Lock className="h-4 w-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Privacy First:</strong> ClickSafe never stores or sends your emails. All scanning happens securely with metadata-only logging.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
