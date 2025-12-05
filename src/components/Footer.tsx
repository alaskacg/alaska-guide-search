import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const links = {
    explore: [
      { label: "Eco-Tours", href: "#" },
      { label: "Hunting Guides", href: "#" },
      { label: "Fishing Charters", href: "#" },
      { label: "Bush Flights", href: "#" },
      { label: "All Adventures", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Become a Guide", href: "#" },
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

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-bold mb-2">
                Get Adventure Updates
              </h3>
              <p className="text-primary-foreground/70">
                Exclusive deals, new guides, and Alaska travel tips in your inbox.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
                <Mountain className="h-5 w-5 text-accent" />
              </div>
              <span className="font-display text-xl font-bold">
                Alaska<span className="text-accent">Quest</span>
              </span>
            </a>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Alaska's premier adventure marketplace. Connecting adventurers with 
              AI-verified guides through secure, low-deposit bookings.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@alaskaquest.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1-800-ALASKA-Q
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Anchorage, Alaska
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {links.explore.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2024 AlaskaQuest. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
