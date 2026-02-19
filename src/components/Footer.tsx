import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { motion } from "framer-motion";

const Footer = () => {
  const links = {
    explore: [
      { label: "Adventure Guides", href: "/fishing" },
      { label: "Eco-Tours", href: "/eco-tours" },
      { label: "Hunting Guides", href: "/hunting" },
      { label: "Fishing Charters", href: "/fishing" },
      { label: "Bush Flights", href: "/flights" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Become a Guide", href: "/guide-registration" },
      { label: "Help Center", href: "/help" },
      { label: "Safety Resources", href: "/safety" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Safety Resources", href: "/safety" },
      { label: "Travel Insurance", href: "/safety" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "Contact Us", href: "/contact" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Escrow Agreement", href: "/escrow" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border/30">
      {/* Newsletter Section */}
      <div className="border-b border-border/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl text-foreground mb-2">
                Get Adventure Updates
              </h3>
              <p className="text-muted-foreground text-sm">
                Exclusive deals, new guides, and Alaska travel tips.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Logo size="md" showText={true} />
            </a>
            
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Alaska's premier guide search. Verified professionals, 
              secure bookings, lower deposits.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
                support@akguidesearch.com
              </p>
              <p className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer">
                <Phone className="h-4 w-4" />
                1-800-AK-GUIDE
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Anchorage, Alaska
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2">
              {links.explore.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 AK Guide Search. All rights reserved. Part of Alaska Consulting Group.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
