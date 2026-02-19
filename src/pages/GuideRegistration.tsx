import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, FileText, User, Briefcase, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";


const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Business Details", icon: Briefcase },
  { id: 3, title: "Service Areas", icon: MapPin },
  { id: 4, title: "Go Live", icon: Sparkles },
];

const serviceTypes: { id: "adventure" | "eco" | "hunting" | "fishing" | "pilot"; label: string }[] = [
  { id: "adventure", label: "Adventure Guide" },
  { id: "eco", label: "Eco-Guide" },
  { id: "hunting", label: "Hunting Guide" },
  { id: "fishing", label: "Fishing Guide" },
  { id: "pilot", label: "Bush Pilot" },
];

const alaskaRegions = [
  "Anchorage", "Fairbanks", "Juneau", "Kenai Peninsula", "Kodiak Island",
  "Denali", "Bristol Bay", "Prince William Sound", "Southeast Alaska", "Arctic",
];

const GuideRegistration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullLegalName: "", dateOfBirth: "", phoneNumber: "",
    addressLine1: "", addressLine2: "", city: "", state: "Alaska", zipCode: "",
    businessName: "", businessLicenseNumber: "", yearsOfExperience: "",
    serviceTypes: [] as ("adventure" | "eco" | "hunting" | "fishing" | "pilot")[], serviceAreas: [] as string[],
    bio: "", websiteUrl: "", tagline: "",
    agreeTerms: false, agreeVerification: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
  }, [navigate]);

  const updateField = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  type ServiceType = "adventure" | "eco" | "hunting" | "fishing" | "pilot";
  
  const toggleService = (id: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(id)
        ? prev.serviceTypes.filter(s => s !== id)
        : [...prev.serviceTypes, id]
    }));
  };

  const toggleArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.agreeTerms || !formData.agreeVerification) {
      toast({ title: "Please agree to terms", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Create the application
      const { data: applicationData, error: appError } = await supabase.from("guide_applications").insert([{
        user_id: user.id,
        full_legal_name: formData.fullLegalName,
        date_of_birth: formData.dateOfBirth,
        phone_number: formData.phoneNumber,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2 || null,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        business_name: formData.businessName || null,
        business_license_number: formData.businessLicenseNumber || null,
        years_of_experience: parseInt(formData.yearsOfExperience),
        service_types: formData.serviceTypes,
        service_areas: formData.serviceAreas,
        bio: formData.bio || null,
        website_url: formData.websiteUrl || null,
        status: 'approved',
      }]).select().single();

      if (appError) throw appError;

      const displayName = formData.businessName || formData.fullLegalName.split(' ')[0];
      
      const { error: profileError } = await supabase.from("guide_profiles").insert([{
        user_id: user.id,
        application_id: applicationData.id,
        display_name: displayName,
        business_name: formData.businessName || null,
        bio: formData.bio || null,
        tagline: formData.tagline || null,
        website_url: formData.websiteUrl || null,
        years_of_experience: parseInt(formData.yearsOfExperience),
        service_types: formData.serviceTypes,
        service_areas: formData.serviceAreas,
        is_verified: true,
        is_active: true,
        subscription_status: 'free',
      }]);

      if (profileError) throw profileError;

      toast({ 
        title: "🎉 Welcome!", 
        description: "Your guide profile is now live. You have full access to all features!" 
      });
      navigate("/guide-dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your <span className="text-gradient-gold">Guide Profile</span>
            </h1>
            <p className="text-muted-foreground">Go live instantly. Start receiving bookings today!</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <motion.div
                  animate={{ scale: step >= s.id ? 1.1 : 1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= s.id ? "bg-gradient-cta text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > s.id ? <CheckCircle2 className="h-6 w-6" /> : <s.icon className="h-5 w-5" />}
                </motion.div>
                <span className={`text-xs font-medium ${step >= s.id ? "text-accent" : "text-muted-foreground"}`}>{s.title}</span>
              </div>
            ))}
          </div>

          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Personal Information</h2>
                <div><Label>Full Legal Name *</Label><Input value={formData.fullLegalName} onChange={(e) => updateField("fullLegalName", e.target.value)} placeholder="As shown on government ID" className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Date of Birth *</Label><Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className="mt-1" /></div>
                  <div><Label>Phone Number *</Label><Input value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} placeholder="(907) 555-0123" className="mt-1" /></div>
                </div>
                <div><Label>Address Line 1 *</Label><Input value={formData.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="Street address" className="mt-1" /></div>
                <div><Label>Address Line 2</Label><Input value={formData.addressLine2} onChange={(e) => updateField("addressLine2", e.target.value)} placeholder="Apt, suite, etc." className="mt-1" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>City *</Label><Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1" /></div>
                  <div><Label>State *</Label><Input value={formData.state} disabled className="mt-1" /></div>
                  <div><Label>ZIP *</Label><Input value={formData.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} className="mt-1" /></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Business Details</h2>
                <div><Label>Business Name</Label><Input value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} placeholder="Optional - if operating as a business" className="mt-1" /></div>
                <div><Label>Guide License Number</Label><Input value={formData.businessLicenseNumber} onChange={(e) => updateField("businessLicenseNumber", e.target.value)} placeholder="Alaska guide license #" className="mt-1" /></div>
                <div><Label>Years of Experience *</Label><Input type="number" min="0" value={formData.yearsOfExperience} onChange={(e) => updateField("yearsOfExperience", e.target.value)} className="mt-1" /></div>
                <div><Label>Service Types *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {serviceTypes.map((type) => (
                      <motion.button key={type.id} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => toggleService(type.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${formData.serviceTypes.includes(type.id) ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Service Areas & Profile</h2>
                <div><Label>Select regions you operate in *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {alaskaRegions.map((area) => (
                      <motion.button key={area} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => toggleArea(area)}
                        className={`p-3 rounded-lg border text-left transition-all ${formData.serviceAreas.includes(area) ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                        {area}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div><Label>Tagline</Label><Input value={formData.tagline} onChange={(e) => updateField("tagline", e.target.value)} placeholder="e.g., 'Master Salmon Guide - 20 Years on the Kenai'" className="mt-1" /></div>
                <div><Label>Bio / About You</Label><Textarea value={formData.bio} onChange={(e) => updateField("bio", e.target.value)} placeholder="Tell potential clients about your experience, specialties, and what makes your trips unique..." className="mt-1 min-h-[120px]" /></div>
                <div><Label>Website URL</Label><Input value={formData.websiteUrl} onChange={(e) => updateField("websiteUrl", e.target.value)} placeholder="https://yourwebsite.com" className="mt-1" /></div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Go Live Now!</h2>
                
                <div className="glass-dark rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">What's Included</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Unlimited listings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Unlimited photos & videos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Real-time availability</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Your own profile page</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Featured in category pages</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Zero platform fees</span>
                    </div>
                  </div>
                </div>

                <div className="glass-dark rounded-xl p-4 space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-accent" /> Optional Documents (For Verified Badge)</h3>
                  <p className="text-sm text-muted-foreground">Upload these later in your dashboard to earn a verified badge:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Government-issued photo ID</li>
                    <li>Alaska Guide License (if applicable)</li>
                    <li>Proof of insurance</li>
                    <li>CPR/First Aid certification</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(v) => updateField("agreeTerms", v)} />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">I agree to the Terms of Service and Platform Agreement for guides.</Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="verify" checked={formData.agreeVerification} onCheckedChange={(v) => updateField("agreeVerification", v)} />
                    <Label htmlFor="verify" className="text-sm text-muted-foreground leading-relaxed">I confirm all information provided is accurate and I have the legal right to offer guide services in Alaska.</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
              {step < 4 ? (
                <Button variant="hero" onClick={() => setStep(s => s + 1)}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
              ) : (
                <Button variant="hero" onClick={handleSubmit} disabled={loading} className="min-w-[200px]">
                  {loading ? "Creating Profile..." : "🚀 Launch My Profile"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuideRegistration;