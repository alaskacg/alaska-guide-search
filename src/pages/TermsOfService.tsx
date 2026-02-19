import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { FileText, Scale, Shield, AlertTriangle, Mountain, Mail } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using AK Guide Search.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 2026</p>
          </div>

          <div className="space-y-8">
            {/* 1. Platform Overview */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">1</span>
                  Platform Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AK Guide Search ("Platform," "we," "us") operates as an online marketplace that connects customers seeking outdoor adventure experiences in Alaska with independent, verified wilderness guides ("Guides"). We facilitate the discovery, communication, booking, and payment process between customers and Guides.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AK Guide Search does not itself provide guide services, outdoor adventures, transportation, or any other services listed on the Platform. Guides are independent contractors and are not employees, agents, or representatives of AK Guide Search.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using the Platform, you agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.
                </p>
              </CardContent>
            </Card>

            {/* 2. User Accounts and Eligibility */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">2</span>
                  User Accounts &amp; Eligibility
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use certain features of the Platform, you must create an account. You must be at least 18 years of age to create an account or make a booking. By creating an account, you represent that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>You are at least 18 years old</li>
                  <li>All information you provide is accurate and complete</li>
                  <li>You will maintain the security of your account credentials</li>
                  <li>You will promptly update any changes to your information</li>
                  <li>You accept responsibility for all activity under your account</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The Platform is focused on Alaska-based outdoor adventure services. Services listed must operate within the State of Alaska or adjacent waters.
                </p>
              </CardContent>
            </Card>

            {/* 3. Booking Process and Payment Terms */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">3</span>
                  Booking Process &amp; Payment Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bookings on AK Guide Search follow a structured process designed to protect both customers and Guides:
                </p>
                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Deposit</h3>
                    <p className="text-muted-foreground text-sm">A deposit of 20–25% of the total trip cost is required at the time of booking to secure your reservation. The exact deposit percentage is set by each Guide.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Escrow</h3>
                    <p className="text-muted-foreground text-sm">All payments are held in escrow via Stripe until the trip is completed. This protects customers from loss and ensures Guides are paid for services rendered.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Remaining Balance</h3>
                    <p className="text-muted-foreground text-sm">The remaining balance is due no later than 7 days before the scheduled trip date. Failure to pay the remaining balance may result in cancellation of the booking.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Platform Fee</h3>
                    <p className="text-muted-foreground text-sm">AK Guide Search charges a 12% platform fee on the total booking amount. This fee covers payment processing, escrow management, customer support, and platform maintenance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Cancellation Policies */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">4</span>
                  Cancellation Policies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each Guide selects one of the following cancellation policy tiers for their listings. The applicable policy is displayed on the listing page before booking.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Flexible</h3>
                    <p className="text-sm text-muted-foreground">Full refund if cancelled 7+ days before the trip. 50% refund if cancelled 3–7 days before. No refund for cancellations less than 3 days before.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Moderate</h3>
                    <p className="text-sm text-muted-foreground">Full refund if cancelled 14+ days before the trip. 50% refund if cancelled 7–14 days before. No refund for cancellations less than 7 days before.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Strict</h3>
                    <p className="text-sm text-muted-foreground">Full refund if cancelled 30+ days before the trip. 50% refund if cancelled 14–30 days before. No refund for cancellations less than 14 days before.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Non-Refundable</h3>
                    <p className="text-sm text-muted-foreground">No refund after a 24-hour grace period following booking confirmation. This policy is typically used for high-demand, limited-availability trips.</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                  For full details, see our <Link to="/cancellation-policy" className="text-accent hover:underline">Cancellation Policy</Link> page.
                </p>
              </CardContent>
            </Card>

            {/* 5. Guide Obligations */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">5</span>
                  Guide Obligations
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All Guides on the Platform must comply with the following requirements:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Maintain all required Alaska state and federal licenses for their activity type (e.g., ADFG guide license, USCG captain's license, FAA Part 135 certificate)</li>
                  <li>Carry adequate commercial liability insurance with a minimum of $1,000,000 per occurrence</li>
                  <li>Provide and maintain all required safety equipment in good working condition</li>
                  <li>Have a documented emergency action plan for each trip type offered</li>
                  <li>Provide accurate descriptions of services, including physical requirements and risks</li>
                  <li>Respond to booking inquiries within 48 hours</li>
                  <li>Comply with all applicable local, state, and federal regulations</li>
                  <li>Report any safety incidents to the Platform within 24 hours</li>
                </ul>
              </CardContent>
            </Card>

            {/* 6. Customer Obligations */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">6</span>
                  Customer Obligations
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By booking a trip through the Platform, customers agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Truthfully disclose any physical limitations, medical conditions, or disabilities that may affect participation</li>
                  <li>Follow all instructions given by the Guide during the trip, including safety protocols</li>
                  <li>Sign all required liability waivers before the trip commences</li>
                  <li>Arrive at the designated meeting point at the agreed-upon time with appropriate gear</li>
                  <li>Refrain from the use of alcohol or controlled substances during the activity</li>
                  <li>Treat Guides, staff, and other participants with respect</li>
                  <li>Comply with all applicable Alaska fish and game regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* 7. Escrow and Payment Protection */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent" />
                  Escrow &amp; Payment Protection
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All payments are processed through Stripe and held in escrow for the protection of both parties. Funds are released to the Guide 48 hours after the successful completion of the trip. In the event of a dispute, funds are held until the dispute is resolved. See our <Link to="/escrow" className="text-accent hover:underline">Escrow Agreement</Link> for full details.
                </p>
              </CardContent>
            </Card>

            {/* 8. Dispute Resolution */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Scale className="h-6 w-6 text-accent" />
                  Dispute Resolution
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We strive to resolve all disputes fairly and efficiently:
                </p>
                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Step 1: Initial Response</h3>
                    <p className="text-muted-foreground text-sm">AK Guide Search will acknowledge your dispute within 48 hours and begin an investigation.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Step 2: Mediation</h3>
                    <p className="text-muted-foreground text-sm">We will facilitate communication between the customer and Guide to reach an amicable resolution.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Step 3: Platform Arbitration</h3>
                    <p className="text-muted-foreground text-sm">If mediation fails, AK Guide Search will review all evidence and make a binding determination regarding fund distribution.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 9. Liability Limitations */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-accent" />
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AK Guide Search operates solely as a marketplace platform. We are not a guide service, outfitter, or transportation provider. Guides listed on the Platform are independent contractors, not employees or agents of AK Guide Search.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To the maximum extent permitted by law, AK Guide Search shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from: the use of the Platform or any services booked through it; any actions, omissions, or negligence of Guides; injuries, property damage, or loss occurring during trips; or the accuracy of information provided by Guides.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our total liability for any claim shall not exceed the amount of the Platform fee collected for the specific booking in question.
                </p>
              </CardContent>
            </Card>

            {/* 10. Alaska-Specific Disclaimers */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Mountain className="h-6 w-6 text-accent" />
                  Alaska-Specific Disclaimers
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Alaska's wilderness presents unique and inherent risks that all users must understand:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong className="text-foreground">Weather:</strong> Alaska weather is extremely unpredictable and can change rapidly. Trips may be delayed, modified, or cancelled due to weather conditions at the sole discretion of the Guide.</li>
                  <li><strong className="text-foreground">Wildlife:</strong> Alaska is home to bears, moose, wolves, and other potentially dangerous wildlife. Encounters are possible on any outdoor activity.</li>
                  <li><strong className="text-foreground">Remote Areas:</strong> Many activities take place in remote areas with no cell service, limited infrastructure, and no nearby medical facilities.</li>
                  <li><strong className="text-foreground">Emergency Evacuation:</strong> In the event of a medical emergency, evacuation may take hours or even days depending on location and weather. Customers are strongly encouraged to carry personal travel and evacuation insurance.</li>
                  <li><strong className="text-foreground">Natural Hazards:</strong> Rivers, glaciers, tides, avalanches, and other natural features present inherent dangers that cannot be fully mitigated.</li>
                </ul>
              </CardContent>
            </Card>

            {/* 11. Intellectual Property */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">11</span>
                  Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content, trademarks, logos, and intellectual property displayed on the Platform are the property of AK Guide Search or its licensors. You may not reproduce, distribute, modify, or create derivative works without express written permission.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Guides retain ownership of their photos, descriptions, and other content uploaded to the Platform, but grant AK Guide Search a non-exclusive, worldwide license to display and promote such content in connection with the Platform.
                </p>
              </CardContent>
            </Card>

            {/* 12. Governing Law */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-bold">12</span>
                  Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Alaska, without regard to its conflict of law provisions. Any legal proceedings arising from these Terms shall be brought exclusively in the state or federal courts located in the State of Alaska.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-accent/30">
              <CardContent className="p-8 text-center">
                <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-2">Questions About These Terms?</h2>
                <p className="text-muted-foreground mb-4">
                  Contact our legal team for any questions or concerns.
                </p>
                <a href="mailto:legal@akguidesearch.com" className="text-accent hover:underline font-medium">
                  legal@akguidesearch.com
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

export default TermsOfService;
