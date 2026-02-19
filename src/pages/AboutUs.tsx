import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Search, ShieldCheck, Mountain, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Mountain className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">About AK Guide Search</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Making Alaska's wilderness accessible through verified, trusted guides.
            </p>
          </div>

          <div className="space-y-8">
            {/* Mission */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-accent" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  AK Guide Search exists to connect adventurers with Alaska's best wilderness professionals. We believe everyone deserves access to safe, authentic Alaskan experiences — guided by verified experts who know the land, the wildlife, and the waterways like the back of their hand.
                </p>
              </CardContent>
            </Card>

            {/* Why We Exist */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Search className="h-6 w-6 text-accent" />
                  Why AK Guide Search Exists
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Finding a reliable guide in Alaska has always been a challenge. The market is fragmented — guides advertise through word of mouth, scattered websites, and social media pages. There's no central place to compare, verify, and book with confidence. This creates problems:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Fragmented Market</h3>
                    <p className="text-sm text-muted-foreground">Hundreds of guides with no central directory. Customers waste hours researching and comparing options.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">No Central Booking</h3>
                    <p className="text-sm text-muted-foreground">Payment processes vary wildly. Some require cash, wire transfers, or have no payment protection at all.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Safety Concerns</h3>
                    <p className="text-sm text-muted-foreground">No easy way to verify licenses, insurance, or safety records. Customers are left to trust a website alone.</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-6">
                  AK Guide Search solves all of these problems with a single, trusted platform.
                </p>
              </CardContent>
            </Card>

            {/* Verification Process */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  Our Verification Process
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Every Guide on our platform goes through a rigorous verification process before being listed:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">License Verification</h3>
                      <p className="text-sm text-muted-foreground">We verify all required Alaska state and federal licenses — ADFG guide licenses, USCG captain's licenses, FAA certificates, and more.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Insurance Verification</h3>
                      <p className="text-sm text-muted-foreground">We confirm that every Guide carries adequate commercial liability insurance — minimum $1M per occurrence.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Background Check</h3>
                      <p className="text-sm text-muted-foreground">All Guides undergo background screening to ensure the safety and trust of our community.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">Client Reviews</h3>
                      <p className="text-sm text-muted-foreground">Only verified customers who completed a trip can leave reviews, ensuring authentic feedback you can trust.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alaska Expertise */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Mountain className="h-6 w-6 text-accent" />
                  Alaska Expertise
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AK Guide Search is locally operated by people who understand Alaska. We know the seasons, the regions, the regulations, and the challenges of operating in the Last Frontier.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="font-display text-2xl text-foreground">5</div>
                    <div className="text-xs text-muted-foreground">Regions Covered</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="font-display text-2xl text-foreground">4</div>
                    <div className="text-xs text-muted-foreground">Activity Categories</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="font-display text-2xl text-foreground">12</div>
                    <div className="text-xs text-muted-foreground">Months of Availability</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="font-display text-2xl text-foreground">100+</div>
                    <div className="text-xs text-muted-foreground">Verified Guides</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Users className="h-6 w-6 text-accent" />
                  Our Team
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  AK Guide Search is built by a team of Alaskans, adventurers, and technologists passionate about connecting people with the wild beauty of the Last Frontier.
                </p>
                <div className="p-6 rounded-lg bg-muted/50 border border-border/50 text-center">
                  <p className="text-muted-foreground italic">Team profiles coming soon. We're growing fast — interested in joining us?</p>
                  <Link to="/contact" className="text-accent hover:underline text-sm mt-2 inline-block">Get in touch →</Link>
                </div>
              </CardContent>
            </Card>

            {/* Growth */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Our Growth
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Since launching, we've been steadily growing our network of verified guides across all regions of Alaska. Our platform now covers fishing, hunting, eco-tours, and bush flights — with more activity types coming soon. We're committed to becoming the definitive platform for Alaska adventure bookings.
                </p>
              </CardContent>
            </Card>

            {/* Partner CTA */}
            <Card className="border-accent/30">
              <CardContent className="p-8 text-center">
                <h2 className="font-display text-2xl text-foreground mb-4">Partner With Us</h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Are you a licensed Alaska guide? Join our growing network and reach thousands of adventure seekers. Verified Guides enjoy secure payments, easy scheduling, and a professional profile.
                </p>
                <Button variant="hero" size="lg" className="group" asChild>
                  <Link to="/guide-registration">
                    Become a Guide
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
