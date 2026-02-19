import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Eye, Share2, Cookie, Lock, UserCheck, Baby, MapPin, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <ShieldCheck className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your privacy matters to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 2026</p>
          </div>

          <div className="space-y-8">
            {/* Information Collected */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Eye className="h-6 w-6 text-accent" />
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                    <p className="text-muted-foreground text-sm">Name, email address, phone number, mailing address, and profile photo when you create an account.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Booking Information</h3>
                    <p className="text-muted-foreground text-sm">Trip preferences, dates, group size, special requirements, physical fitness disclosures, and communication with Guides.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Payment Information</h3>
                    <p className="text-muted-foreground text-sm">Payment card details (processed securely by Stripe — we do not store full card numbers), billing address, and transaction history.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Location Information</h3>
                    <p className="text-muted-foreground text-sm">General location based on IP address, and precise location only if you grant permission for finding nearby guides or trip meeting points.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Device &amp; Usage Information</h3>
                    <p className="text-muted-foreground text-sm">Browser type, operating system, device identifiers, pages visited, time spent on pages, and referring URLs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-accent" />
                  How We Use Your Information
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span><strong className="text-foreground">Booking Facilitation:</strong> To process reservations, connect you with Guides, manage payments, and provide booking confirmations and reminders.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span><strong className="text-foreground">Communication:</strong> To send trip updates, safety information, booking confirmations, and respond to your inquiries.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span><strong className="text-foreground">Safety:</strong> To verify Guide credentials, facilitate emergency contact information sharing, and maintain safety records.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span><strong className="text-foreground">Analytics:</strong> To improve our Platform, understand user behavior, optimize search results, and enhance the overall experience.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span><strong className="text-foreground">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sharing */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Share2 className="h-6 w-6 text-accent" />
                  How We Share Your Information
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-1">With Guides</h3>
                    <p className="text-sm text-muted-foreground">When you make a booking, we share your name, contact information, group size, and relevant trip details with your selected Guide to facilitate the trip.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-1">With Stripe (Payment Processor)</h3>
                    <p className="text-sm text-muted-foreground">Payment information is shared with Stripe for secure payment processing. Stripe's privacy policy governs their handling of your data.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-1">Legal Requirements</h3>
                    <p className="text-sm text-muted-foreground">We may disclose information when required by law, subpoena, court order, or when necessary to protect the safety of our users or the public.</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  We do not sell your personal information to third parties. We do not share your information with advertisers.
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Cookie className="h-6 w-6 text-accent" />
                  Cookies &amp; Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and search history</li>
                  <li>Understand how you use the Platform to improve our services</li>
                  <li>Provide relevant content and recommendations</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can manage cookie preferences through your browser settings. Disabling cookies may limit some Platform functionality.
                </p>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Lock className="h-6 w-6 text-accent" />
                  Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>TLS/SSL encryption for all data in transit</li>
                  <li>Encrypted storage for sensitive data at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Role-based access controls for employee access to user data</li>
                  <li>PCI DSS compliance through Stripe for payment processing</li>
                  <li>Supabase row-level security for database access</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-accent" />
                  Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Access</h3>
                    <p className="text-sm text-muted-foreground">Request a copy of all personal data we hold about you.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Correction</h3>
                    <p className="text-sm text-muted-foreground">Request corrections to inaccurate or incomplete personal data.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Deletion</h3>
                    <p className="text-sm text-muted-foreground">Request deletion of your personal data, subject to legal retention requirements.</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  To exercise any of these rights, contact us at <a href="mailto:privacy@akguidesearch.com" className="text-accent hover:underline">privacy@akguidesearch.com</a>. We will respond within 30 days.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Baby className="h-6 w-6 text-accent" />
                  Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  AK Guide Search is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly. If you believe a child has provided us with personal information, please contact us at <a href="mailto:privacy@akguidesearch.com" className="text-accent hover:underline">privacy@akguidesearch.com</a>.
                </p>
              </CardContent>
            </Card>

            {/* Alaska-Specific */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-accent" />
                  Alaska State Privacy Compliance
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AK Guide Search complies with all applicable State of Alaska privacy laws and regulations. Alaska residents may have additional rights under state law regarding the collection and use of personal information. We are committed to transparency and will work with Alaska residents to address any privacy concerns.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you are an Alaska resident and have questions about your privacy rights under state law, please contact us.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-accent/30">
              <CardContent className="p-8 text-center">
                <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-2">Privacy Questions?</h2>
                <p className="text-muted-foreground mb-4">
                  Contact our privacy team for any questions, concerns, or data requests.
                </p>
                <a href="mailto:privacy@akguidesearch.com" className="text-accent hover:underline font-medium">
                  privacy@akguidesearch.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
