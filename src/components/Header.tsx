import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Inbox, AlertTriangle, Info, BookOpen, Lock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TutorialModal } from './TutorialModal';
import { PrivacyModal } from './PrivacyModal';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Scan', icon: Shield },
  { path: '/inbox', label: 'Inbox', icon: Inbox },
  { path: '/top-scams', label: 'Top Scams', icon: AlertTriangle },
  { path: '/about', label: 'About', icon: Info },
];

export function Header() {
  const location = useLocation();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow transition-all group-hover:shadow-glow-lg">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Phish<span className="text-primary">Guard</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTutorialOpen(true)}
                className="hidden sm:flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Tutorial
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPrivacyOpen(true)}
                className="hidden sm:flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Privacy
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-card"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`nav-link w-full ${isActive ? 'nav-link-active' : ''}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTutorialOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tutorial
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPrivacyOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Privacy
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <TutorialModal open={tutorialOpen} onOpenChange={setTutorialOpen} />
      <PrivacyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </>
  );
}
