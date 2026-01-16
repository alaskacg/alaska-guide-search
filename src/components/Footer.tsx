import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { motion } from "framer-motion";

const Footer = () => {
  const links = {
    explore: [
      { label: "Adventure Guides", href: "#" },
      { label: "Eco-Tours", href: "#" },
      { label: "Hunting Guides", href: "#" },
      { label: "Fishing Charters", href: "#" },
      { label: "Bush Flights", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Become a Guide", href: "/guide-registration" },
      { label: "Partner With Us", href: "#" },
      { label: "Careers", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Safety Resources", href: "#" },
      { label: "Travel Insurance", href: "#" },
      { label: "Cancellation Policy", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
    legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Escrow Agreement", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-forest-deep border-t border-border/30">
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
              <h3 className="font-display text-2xl font-bold mb-2 text-foreground">
                Get Adventure Updates
              </h3>
              <p className="text-muted-foreground">
                Exclusive deals, new guides, and Alaska travel tips in your inbox.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero">Subscribe</Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-6 gap-8"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Logo size="md" showText={true} />
            </a>
            
            {/* Beta Notice */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-accent font-medium">BETA</span>
              <span className="text-muted-foreground">— Free listings for guides!</span>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              Alaska's premier guide search platform. Connecting adventurers with 
              verified guides through secure, low-deposit bookings.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <motion.p 
                whileHover={{ x: 5, color: "hsl(42 85% 50%)" }}
                className="flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@akguidesearch.com
              </motion.p>
              <motion.p 
                whileHover={{ x: 5, color: "hsl(42 85% 50%)" }}
                className="flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Phone className="h-4 w-4" />
                1-800-AK-GUIDE
              </motion.p>
              <motion.p 
                whileHover={{ x: 5, color: "hsl(42 85% 50%)" }}
                className="flex items-center gap-2 cursor-pointer transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Anchorage, Alaska
              </motion.p>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2">
              {links.explore.map((link) => (
                <li key={link.label}>
                  <motion.a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <motion.a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.label}>
                  <motion.a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <motion.a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Alaska Guide Search. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="text-muted-foreground hover:text-accent transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;