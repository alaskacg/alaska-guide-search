import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Clock, MapPin, AlertTriangle, Users } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    alert("Thank you for your message! We'll respond within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're here to help. Reach out with questions, feedback, or partnership inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <a href="tel:+15103455439" className="text-accent hover:underline">(510) 345-5439</a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <a href="mailto:support@akguidesearch.com" className="text-accent hover:underline">support@akguidesearch.com</a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Office</h3>
                <p className="text-muted-foreground">Alaska</p>
              </CardContent>
            </Card>
          </div>

          {/* Business Hours */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-accent" />
                <h2 className="font-semibold text-foreground text-lg">Business Hours (AKST)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-foreground">Monday – Friday</span>
                  <span className="text-muted-foreground">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-foreground">Saturday – Sunday</span>
                  <span className="text-muted-foreground">10:00 AM – 4:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Question</SelectItem>
                        <SelectItem value="cancellation">Cancellation / Refund</SelectItem>
                        <SelectItem value="guide-inquiry">Guide Inquiry</SelectItem>
                        <SelectItem value="partnership">Partnership / Business</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                    <Textarea
                      id="message"
                      placeholder="How can we help?"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {/* Emergency */}
              <Card className="border-red-500/30">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Emergency — Active Bookings
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    If you have an active booking and need urgent assistance (safety concern, Guide no-show, or emergency), call us directly:
                  </p>
                  <a href="tel:+15103455439" className="inline-flex items-center gap-2 text-red-400 font-bold text-lg hover:underline">
                    <Phone className="h-5 w-5" />
                    (510) 345-5439
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    For life-threatening emergencies, always call 911 first.
                  </p>
                </CardContent>
              </Card>

              {/* For Guides */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    For Guides
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Interested in listing your services on AK Guide Search? We'd love to have you on the platform.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Registration:</strong>{" "}
                      <a href="/guide-registration" className="text-accent hover:underline">Apply here</a>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Guide Support:</strong>{" "}
                      <a href="mailto:support@akguidesearch.com" className="text-accent hover:underline">support@akguidesearch.com</a>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Partnerships:</strong>{" "}
                      <a href="mailto:support@akguidesearch.com" className="text-accent hover:underline">support@akguidesearch.com</a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    Response Times
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone (business hours)</span>
                      <span className="text-foreground">Immediate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emergency (active bookings)</span>
                      <span className="text-foreground">Within 1 hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
