import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ArrowDown, Clock, AlertTriangle, DollarSign, RefreshCw, Shield } from "lucide-react";

const EscrowAgreement = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Escrow Agreement</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              How your payments are protected from booking to trip completion.
            </p>
          </div>

          {/* Visual Flow */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="font-display text-2xl text-foreground mb-8 text-center">How Escrow Works</h2>
              <div className="space-y-2">
                {/* Step 1 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent font-bold shrink-0">1</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Customer Pays Deposit</h3>
                    <p className="text-sm text-muted-foreground">20–25% of the total trip cost is collected at booking. Funds are held securely in escrow via Stripe.</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-accent shrink-0" />
                </div>

                <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-muted-foreground" /></div>

                {/* Step 2 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent font-bold shrink-0">2</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Remaining Balance Due</h3>
                    <p className="text-sm text-muted-foreground">The remaining balance is automatically charged 7 days before the scheduled trip date.</p>
                  </div>
                  <Clock className="h-5 w-5 text-accent shrink-0" />
                </div>

                <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-muted-foreground" /></div>

                {/* Step 3 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent font-bold shrink-0">3</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Funds Held During Trip</h3>
                    <p className="text-sm text-muted-foreground">All funds remain in escrow throughout the duration of the trip for maximum protection.</p>
                  </div>
                  <Shield className="h-5 w-5 text-accent shrink-0" />
                </div>

                <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-muted-foreground" /></div>

                {/* Step 4 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 font-bold shrink-0">4</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Funds Released to Guide</h3>
                    <p className="text-sm text-muted-foreground">48 hours after successful trip completion, funds are released to the Guide (minus the platform fee).</p>
                  </div>
                  <RefreshCw className="h-5 w-5 text-green-400 shrink-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Dispute Process */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-accent" />
                  Dispute Process
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If a dispute is filed by either the customer or the Guide, the escrow release process is halted immediately. Funds remain securely held until the dispute is resolved.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="text-muted-foreground">Either party may file a dispute within 48 hours of trip completion.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="text-muted-foreground">AK Guide Search will investigate and collect evidence from both parties.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="text-muted-foreground">A resolution will be reached within 14 business days in most cases.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="text-muted-foreground">Funds are distributed according to the dispute resolution outcome.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Fee */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-accent" />
                  Platform Fee
                </h2>
                <div className="p-6 rounded-lg bg-muted/50 border border-border/50 text-center mb-4">
                  <div className="font-display text-4xl text-accent mb-2">12%</div>
                  <p className="text-muted-foreground">of total booking amount</p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The platform fee covers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Secure payment processing via Stripe</li>
                  <li>Escrow management and fund protection</li>
                  <li>Guide verification and background checks</li>
                  <li>Customer support and dispute resolution</li>
                  <li>Platform maintenance and development</li>
                  <li>Marketing and customer acquisition</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-4">
                  The platform fee is deducted from the Guide's payout. Customers pay only the listed trip price.
                </p>
              </CardContent>
            </Card>

            {/* Refund Processing */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-accent" />
                  Refund Processing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When a refund is issued (due to cancellation, dispute resolution, or Guide cancellation), the following timeline applies:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Refund Initiated</span>
                    <span className="text-muted-foreground text-sm">Within 1–2 business days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Funds Returned to Customer</span>
                    <span className="text-muted-foreground text-sm">5–10 business days</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  Refund timing depends on your payment provider. Refunds are returned to the original payment method used for the booking.
                </p>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-accent/30">
              <CardContent className="p-8 text-center">
                <Shield className="h-8 w-8 text-accent mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-2">Your Money is Safe</h2>
                <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                  All escrow funds are held in regulated accounts via Stripe, a PCI DSS Level 1 certified payment processor. Your financial information is never stored on our servers.
                </p>
                <p className="text-sm text-muted-foreground">
                  Questions? Contact <a href="mailto:support@akguidesearch.com" className="text-accent hover:underline">support@akguidesearch.com</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EscrowAgreement;
