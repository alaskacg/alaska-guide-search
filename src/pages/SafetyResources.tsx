import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckSquare, Backpack, PawPrint, CloudSun, Phone, Map, Heart, Plane } from "lucide-react";

const SafetyResources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <ShieldAlert className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Safety Resources</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Alaska is extraordinary — and demands respect. Prepare properly to make the most of your adventure.
            </p>
          </div>

          <div className="space-y-8">
            {/* Pre-Trip Checklist */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <CheckSquare className="h-6 w-6 text-accent" />
                  Pre-Trip Preparation Checklist
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Confirm trip details and meeting point with your Guide",
                    "Review the physical fitness requirements for your activity",
                    "Pack appropriate clothing for layering (Alaska weather changes fast)",
                    "Bring sun protection — long daylight hours in summer",
                    "Ensure your travel insurance covers adventure activities",
                    "Share your trip itinerary with someone not on the trip",
                    "Charge all devices; bring a portable battery pack",
                    "Pack any required medications with extra supply",
                    "Review wildlife safety basics (see below)",
                    "Bring a waterproof bag for valuables and electronics",
                    "Have cash for gratuities (many remote areas have no card readers)",
                    "Download offline maps for your trip area",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      <div className="w-5 h-5 rounded border border-accent/50 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What to Bring */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Backpack className="h-6 w-6 text-accent" />
                  What to Bring by Activity Type
                </h2>
                <div className="space-y-6">
                  <div>
                    <Badge variant="outline" className="mb-3">Fishing</Badge>
                    <p className="text-sm text-muted-foreground">Layered clothing, rain gear, rubber-soled boots, polarized sunglasses, sunscreen, hat, personal medications. Guides typically provide rods, tackle, and waders — confirm with your Guide.</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-3">Hunting</Badge>
                    <p className="text-sm text-muted-foreground">Appropriate camouflage, waterproof boots, warm layers, rain gear, personal firearm (if applicable — confirm regulations), binoculars, personal medications. Guides provide camp equipment and logistics.</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-3">Eco-Tours</Badge>
                    <p className="text-sm text-muted-foreground">Comfortable walking shoes, layered clothing, camera, binoculars, rain jacket, water bottle, snacks, sunscreen, insect repellent. Dress warmly even in summer — glaciers and water create cold conditions.</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-3">Bush Flights</Badge>
                    <p className="text-sm text-muted-foreground">Light luggage (weight limits apply), warm layers, rain gear, camera, motion sickness medication if needed. Follow your pilot's weight and baggage instructions carefully.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wildlife Safety */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <PawPrint className="h-6 w-6 text-accent" />
                  Alaska Wildlife Safety
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">🐻 Bears (Brown &amp; Black)</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Make noise on trails to avoid surprising bears</li>
                      <li>Carry bear spray and know how to use it (practice before your trip)</li>
                      <li>Never approach, feed, or run from a bear</li>
                      <li>Store food in bear-proof containers; cook away from sleeping areas</li>
                      <li>If a brown bear charges, stand your ground — most charges are bluffs</li>
                      <li>Your Guide will brief you on bear protocols specific to your area</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">🫎 Moose</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Moose can be more dangerous than bears — give them space (at least 25 yards)</li>
                      <li>Cow moose with calves are especially aggressive in spring/summer</li>
                      <li>If a moose charges, get behind a large object (tree, vehicle, building)</li>
                      <li>Never get between a cow and her calf</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">🌊 Marine Life</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Maintain safe distance from whales, sea lions, and seals (100+ yards)</li>
                      <li>Follow your captain's instructions around marine mammals</li>
                      <li>Be cautious of sea urchins, jellyfish, and strong currents near shore</li>
                      <li>Wear a life jacket at all times on water (required by most Guides)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <CloudSun className="h-6 w-6 text-accent" />
                  Weather Preparedness
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Alaska weather is unpredictable and can change rapidly. Even in summer, temperatures can drop significantly. Always be prepared for rain, wind, and cold.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Summer (Jun–Aug)</h3>
                    <p className="text-sm text-muted-foreground">45–75°F. Long daylight (up to 22 hours). Rain common. Bring layers, rain gear, and sun protection.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Fall (Sep–Oct)</h3>
                    <p className="text-sm text-muted-foreground">25–55°F. Shorter days, autumn colors. Snow at elevation. Warm layers essential.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Winter (Nov–Mar)</h3>
                    <p className="text-sm text-muted-foreground">-20–25°F. Limited daylight. Extreme cold gear required. Northern Lights season.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Spring (Apr–May)</h3>
                    <p className="text-sm text-muted-foreground">20–50°F. Breakup season. Muddy conditions, bears emerging. Waterproof everything.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="border-accent/30">
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Phone className="h-6 w-6 text-accent" />
                  Emergency Contacts
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <span className="text-foreground font-medium">Emergency (All Types)</span>
                    <span className="text-foreground font-bold">911</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Alaska State Troopers</span>
                    <span className="text-muted-foreground">(907) 269-5511</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">US Coast Guard (Juneau)</span>
                    <span className="text-muted-foreground">(907) 463-2000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Alaska Search &amp; Rescue</span>
                    <span className="text-muted-foreground">(907) 269-5511</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">Poison Control</span>
                    <span className="text-muted-foreground">1-800-222-1222</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="text-foreground font-medium">AK Guide Search Support</span>
                    <span className="text-muted-foreground">(510) 345-5439</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Float Plans */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Map className="h-6 w-6 text-accent" />
                  Float Plans &amp; Trip Notifications
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For any trip in remote areas, we strongly recommend filing a float plan or trip notification:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Share your complete itinerary with a trusted contact not on the trip</li>
                  <li>Include meeting location, planned route, expected return time, and emergency contacts</li>
                  <li>For water-based activities, file a float plan with the US Coast Guard or local harbor</li>
                  <li>Set a check-in schedule — if you miss a check-in, your contact should alert authorities</li>
                  <li>Your Guide will have their own trip plan filed; ask them to share details with you</li>
                </ul>
              </CardContent>
            </Card>

            {/* Physical Fitness */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-accent" />
                  Physical Fitness Requirements
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each activity and Guide will specify physical fitness requirements. Be honest about your fitness level when booking — it's for your safety.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <Badge variant="outline" className="mb-2 border-green-500/50 text-green-400">Easy</Badge>
                    <p className="text-sm text-muted-foreground">Minimal physical effort. Suitable for most fitness levels. Examples: scenic flights, boat-based fishing, whale watching.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <Badge variant="outline" className="mb-2 border-blue-500/50 text-blue-400">Moderate</Badge>
                    <p className="text-sm text-muted-foreground">Some walking/hiking involved. Average fitness needed. Examples: river fishing, guided hikes, kayaking.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <Badge variant="outline" className="mb-2 border-yellow-500/50 text-yellow-400">Challenging</Badge>
                    <p className="text-sm text-muted-foreground">Extended physical effort required. Good fitness needed. Examples: backcountry hunting, multi-day hikes, remote fishing.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <Badge variant="outline" className="mb-2 border-red-500/50 text-red-400">Strenuous</Badge>
                    <p className="text-sm text-muted-foreground">High fitness level required. Extended backcountry travel. Examples: mountain hunts, glacier trekking, multi-day wilderness expeditions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Insurance */}
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <Plane className="h-6 w-6 text-accent" />
                  Travel Insurance Recommendations
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We strongly recommend purchasing travel insurance that covers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Trip cancellation and interruption</li>
                  <li>Emergency medical evacuation (critical for remote Alaska areas)</li>
                  <li>Medical expenses abroad (for non-US residents)</li>
                  <li>Adventure and outdoor activity coverage</li>
                  <li>Lost or delayed baggage</li>
                  <li>Search and rescue coverage</li>
                </ul>
                <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> Standard travel insurance often excludes adventure activities. Ensure your policy specifically covers the type of activity you're booking.
                  </p>
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

export default SafetyResources;
