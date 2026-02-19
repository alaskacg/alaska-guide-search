import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarX, CloudRain, UserX, Clock, HelpCircle, CheckCircle } from "lucide-react";

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <CalendarX className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Cancellation Policy</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transparent cancellation policies so you can book with confidence. Each Guide selects a policy tier displayed on their listing.
            </p>
          </div>

          <div className="space-y-8">
            {/* Cancellation Tiers Table */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-6">Cancellation Tiers</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px]">Policy Tier</TableHead>
                        <TableHead className="text-center">Full Refund</TableHead>
                        <TableHead className="text-center">50% Refund</TableHead>
                        <TableHead className="text-center">No Refund</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500/50 text-green-400">Flexible</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">7+ days before trip</TableCell>
                        <TableCell className="text-center text-muted-foreground">3–7 days before</TableCell>
                        <TableCell className="text-center text-muted-foreground">&lt; 3 days before</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">Moderate</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">14+ days before trip</TableCell>
                        <TableCell className="text-center text-muted-foreground">7–14 days before</TableCell>
                        <TableCell className="text-center text-muted-foreground">&lt; 7 days before</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Strict</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">30+ days before trip</TableCell>
                        <TableCell className="text-center text-muted-foreground">14–30 days before</TableCell>
                        <TableCell className="text-center text-muted-foreground">&lt; 14 days before</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="border-red-500/50 text-red-400">Non-Refundable</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground" colSpan={3}>
                          No refund after 24-hour grace period following booking confirmation
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  The applicable cancellation policy is clearly displayed on each Guide's listing page before you book.
                </p>
              </CardContent>
            </Card>

            {/* Weather Cancellations */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <CloudRain className="h-6 w-6 text-accent" />
                  Weather Cancellations
                </h2>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                    <p className="text-foreground font-medium">Full refund if the Guide cancels due to unsafe weather conditions.</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Alaska weather is unpredictable, and safety is our top priority. If a Guide determines that conditions are unsafe for the planned activity, the trip will be cancelled and you will receive a full refund, regardless of the cancellation policy tier.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Guides may also offer to reschedule the trip at no additional cost, subject to availability. The decision to cancel due to weather rests solely with the Guide.
                </p>
              </CardContent>
            </Card>

            {/* Guide Cancellations */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <UserX className="h-6 w-6 text-accent" />
                  Guide Cancellations
                </h2>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                    <p className="text-foreground font-medium">Full refund always — plus rebooking assistance from our team.</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If a Guide cancels for any reason (illness, equipment failure, personal emergency, or otherwise), you will always receive a full refund of all payments made.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our support team will also assist you in finding an alternative Guide for your desired dates and activity. If a suitable replacement is found, we'll expedite the new booking process.
                </p>
              </CardContent>
            </Card>

            {/* How to Request Cancellation */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-accent" />
                  How to Request a Cancellation
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-foreground">Log in to Your Account</h3>
                      <p className="text-sm text-muted-foreground">Navigate to your bookings dashboard at akguidesearch.com.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-foreground">Select the Booking</h3>
                      <p className="text-sm text-muted-foreground">Find the trip you wish to cancel and click "Request Cancellation."</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-foreground">Provide a Reason</h3>
                      <p className="text-sm text-muted-foreground">Select a cancellation reason and add any additional details. This helps us improve our service.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">4</div>
                    <div>
                      <h3 className="font-semibold text-foreground">Confirmation</h3>
                      <p className="text-sm text-muted-foreground">You'll receive a cancellation confirmation email with refund details within minutes.</p>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-6">
                  Need help? Contact our support team at <a href="mailto:support@akguidesearch.com" className="text-accent hover:underline">support@akguidesearch.com</a> or call <a href="tel:+15103455439" className="text-accent hover:underline">(510) 345-5439</a>.
                </p>
              </CardContent>
            </Card>

            {/* Processing Timeframes */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-accent" />
                  Refund Processing Timeframes
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Cancellation Confirmation</span>
                    <span className="text-muted-foreground text-sm">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Refund Initiated</span>
                    <span className="text-muted-foreground text-sm">1–3 business days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Refund Appears on Statement</span>
                    <span className="text-muted-foreground text-sm">5–10 business days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Weather/Guide Cancellation Refund</span>
                    <span className="text-muted-foreground text-sm">3–5 business days</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Refund timing depends on your payment provider. Contact your bank or card issuer if a refund has not appeared after 10 business days.
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

export default CancellationPolicy;
