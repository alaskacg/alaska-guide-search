import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Users, CreditCard, ShieldCheck, Monitor } from "lucide-react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <HelpCircle className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Help Center</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about booking, payments, safety, and more.
            </p>
          </div>

          <div className="space-y-8">
            {/* For Customers */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
                  <Users className="h-6 w-6 text-accent" />
                  For Customers
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="booking-1">
                    <AccordionTrigger className="text-left">How does booking work on AK Guide Search?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Browse guides by activity type (fishing, hunting, eco-tours, or flights), view their profiles and reviews, select your preferred dates and group size, and pay a 20–25% deposit to secure your booking. The remaining balance is due 7 days before your trip. All payments are held in escrow via Stripe for your protection.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="booking-2">
                    <AccordionTrigger className="text-left">How much is the deposit?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Deposits range from 20–25% of the total trip cost, as set by each Guide. This is significantly lower than the industry standard of 50%, thanks to our escrow protection system. The exact deposit amount is displayed before you confirm your booking.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="booking-3">
                    <AccordionTrigger className="text-left">How do cancellations work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Each Guide selects a cancellation policy tier (Flexible, Moderate, Strict, or Non-Refundable) displayed on their listing. Refund amounts depend on how far in advance you cancel. Weather-related cancellations by the Guide always receive a full refund. See our <a href="/cancellation-policy" className="text-accent hover:underline">Cancellation Policy</a> for full details.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="booking-4">
                    <AccordionTrigger className="text-left">What should I expect on trip day?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Your Guide will provide meeting details (location, time, what to bring) before the trip. Arrive on time with appropriate gear. You'll sign a liability waiver, receive a safety briefing, and then enjoy your adventure! Your Guide handles all logistics, equipment, and safety.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="booking-5">
                    <AccordionTrigger className="text-left">Can I communicate with my Guide before the trip?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes! After booking, you can communicate directly with your Guide through the platform's messaging system. Use it to ask questions about what to bring, discuss any physical limitations, or coordinate meeting logistics. Guides typically respond within 24 hours.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* For Guides */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
                  <Users className="h-6 w-6 text-accent" />
                  For Guides
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="guide-1">
                    <AccordionTrigger className="text-left">How do I register as a Guide?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Visit our <a href="/guide-registration" className="text-accent hover:underline">Guide Registration</a> page and complete the application form. You'll need to provide your license information, proof of insurance, and basic business details. Our team will review your application and verify your credentials.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="guide-2">
                    <AccordionTrigger className="text-left">What's the verification process?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      We verify your Alaska guide license, commercial liability insurance ($1M minimum), and conduct a background check. The process typically takes 3–5 business days. Once verified, your profile goes live and you can start receiving bookings.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="guide-3">
                    <AccordionTrigger className="text-left">How do I set my availability?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Use the Guide Dashboard to manage your calendar. You can set available dates, block off days, set seasonal hours, and manage multiple trip types. Your calendar updates in real-time so customers always see accurate availability.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="guide-4">
                    <AccordionTrigger className="text-left">How do I manage bookings?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      All bookings are managed through your Guide Dashboard. You'll receive notifications for new bookings, can accept or decline requests, message customers, and track upcoming trips. The dashboard also shows your earnings, reviews, and analytics.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="guide-5">
                    <AccordionTrigger className="text-left">When do I get paid?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Funds are released to your Stripe account 48 hours after the trip is completed. The 12% platform fee is deducted automatically. Payouts typically arrive in your bank account within 2–3 business days after release. See our <a href="/escrow" className="text-accent hover:underline">Escrow Agreement</a> for details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-accent" />
                  Payments
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="pay-1">
                    <AccordionTrigger className="text-left">When am I charged?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      You're charged the deposit (20–25%) immediately when you confirm your booking. The remaining balance is automatically charged 7 days before your trip date. Both charges appear on your statement as "AK Guide Search."
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="pay-2">
                    <AccordionTrigger className="text-left">How does escrow work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      All payments are held securely in escrow via Stripe. Your money is protected from the moment you pay until the trip is complete. Funds are only released to the Guide 48 hours after a successful trip. If there's a dispute, funds are held until it's resolved. See our <a href="/escrow" className="text-accent hover:underline">Escrow Agreement</a> for full details.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="pay-3">
                    <AccordionTrigger className="text-left">How long do refunds take?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Refunds are initiated within 1–3 business days of approval and typically appear on your statement within 5–10 business days, depending on your payment provider. You'll receive an email confirmation when the refund is processed.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="pay-4">
                    <AccordionTrigger className="text-left">What payment methods are accepted?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through Stripe. Apple Pay and Google Pay are also supported. We do not accept cash, checks, or direct bank transfers.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Safety */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  Safety
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="safety-1">
                    <AccordionTrigger className="text-left">How are Guides verified?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Every Guide undergoes license verification, insurance verification ($1M minimum liability), and a background check. We verify Alaska state and federal credentials specific to their activity type. Only Guides who pass all checks are listed on the platform.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="safety-2">
                    <AccordionTrigger className="text-left">What happens in an emergency?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      All Guides are required to have documented emergency action plans and carry appropriate safety equipment including first aid kits and communication devices. In an emergency, your Guide will initiate rescue protocols. For life-threatening emergencies, call 911. See our <a href="/safety" className="text-accent hover:underline">Safety Resources</a> page for emergency contact numbers.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="safety-3">
                    <AccordionTrigger className="text-left">Are Guides required to have insurance?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes. All Guides must carry commercial liability insurance with a minimum of $1,000,000 per occurrence. We verify insurance documentation during the registration process and require annual renewal proof.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Technical */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
                  <Monitor className="h-6 w-6 text-accent" />
                  Technical
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tech-1">
                    <AccordionTrigger className="text-left">I'm having trouble with my account</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      If you're experiencing login issues, try resetting your password using the "Forgot Password" link on the sign-in page. If you continue to have problems, contact our support team at <a href="mailto:support@akguidesearch.com" className="text-accent hover:underline">support@akguidesearch.com</a> or call <a href="tel:+15103455439" className="text-accent hover:underline">(510) 345-5439</a>.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tech-2">
                    <AccordionTrigger className="text-left">How do I reset my password?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Click "Sign In" in the header, then click "Forgot Password." Enter your email address and we'll send a password reset link. The link expires after 1 hour. Check your spam folder if you don't see the email.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tech-3">
                    <AccordionTrigger className="text-left">What browsers are supported?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      AK Guide Search works on all modern browsers including Chrome, Firefox, Safari, and Edge (latest two versions). We also support mobile browsers on iOS and Android. For the best experience, we recommend using Chrome or Firefox with JavaScript enabled.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card className="border-accent/30">
              <CardContent className="p-8 text-center">
                <h2 className="font-display text-2xl text-foreground mb-4">Still Need Help?</h2>
                <p className="text-muted-foreground mb-6">
                  Our support team is available Monday–Friday 8AM–6PM, Saturday–Sunday 10AM–4PM AKST.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:support@akguidesearch.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors">
                    Email Support
                  </a>
                  <a href="tel:+15103455439" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors">
                    Call (510) 345-5439
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
