import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Inbox, MessageSquare, Image, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: 'Scan Your Inbox',
    description: 'Connect your Gmail account or use our demo inbox to automatically scan your emails for phishing attempts and suspicious messages.',
    icon: Inbox,
    action: '/inbox',
    actionLabel: 'Try Inbox Scan',
  },
  {
    id: 2,
    title: 'Paste Message or Link',
    description: 'Copy and paste any suspicious email, text message, or URL directly into our scanner for instant analysis.',
    icon: MessageSquare,
    action: '/',
    actionLabel: 'Try Text Scan',
  },
  {
    id: 3,
    title: 'Upload Screenshot (OCR)',
    description: 'Have a suspicious message on your phone? Take a screenshot and upload it - our OCR technology will extract and analyze the text.',
    icon: Image,
    action: '/',
    actionLabel: 'Try Screenshot Scan',
  },
  {
    id: 4,
    title: 'Read Results & Take Action',
    description: 'Get a clear risk score, detailed explanation of red flags, and actionable safety advice. Copy reports or forward to your IT department.',
    icon: CheckCircle,
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
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-primary">How to Use</span> PhishGuard
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
      </DialogContent>
    </Dialog>
  );
}
