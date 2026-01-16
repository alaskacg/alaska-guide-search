import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import BetaBanner from "./BetaBanner";
import { Menu, X, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Explore Guides", href: "#categories" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "For Guides", href: "/guide-registration" },
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl border-b border-border/20" />
      
      <div className="relative container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <Logo size="md" showText={true} />
            <BetaBanner variant="compact" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                  >
                    {link.label}
                  </a>
                )}
              </motion.div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="hero" size="sm" className="group">
                Find a Guide
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 py-4 border-t border-border/20">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: -15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg block transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg block transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    )}
                  </motion.div>
                ))}
                <motion.div 
                  className="flex gap-2 mt-3 pt-3 border-t border-border/20"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link to="/auth" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Button variant="hero" size="sm" className="flex-1">
                    Find Guide
                  </Button>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
