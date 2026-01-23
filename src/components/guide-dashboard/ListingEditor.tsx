import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Image, Video, X, Plus } from "lucide-react";
import { GuideListing, ListingInsert } from "@/hooks/useGuideListings";

interface ListingEditorProps {
  listing?: GuideListing | null;
  onSave: (data: Partial<ListingInsert>) => Promise<GuideListing | null>;
  onCancel: () => void;
}

const categories = [
  { value: "fishing", label: "Fishing" },
  { value: "hunting", label: "Hunting" },
  { value: "eco", label: "Eco-Tours" },
  { value: "flights", label: "Scenic Flights" },
  { value: "adventure", label: "Adventure" },
];

const difficultyLevels = [
  { value: "easy", label: "Easy - Suitable for all fitness levels" },
  { value: "moderate", label: "Moderate - Some physical activity required" },
  { value: "challenging", label: "Challenging - Good fitness required" },
  { value: "expert", label: "Expert - Advanced skills and fitness needed" },
];

export default function ListingEditor({ listing, onSave, onCancel }: ListingEditorProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: listing?.title || "",
    short_description: listing?.short_description || "",
    description: listing?.description || "",
    category: listing?.category || "adventure",
    duration_hours: listing?.duration_hours || null,
    duration_days: listing?.duration_days || null,
    max_group_size: listing?.max_group_size || 4,
    min_group_size: listing?.min_group_size || 1,
    price_per_person: listing?.price_per_person || null,
    price_per_group: listing?.price_per_group || null,
    deposit_percentage: listing?.deposit_percentage || 25,
    difficulty_level: listing?.difficulty_level || "moderate",
    included_items: listing?.included_items || [],
    not_included_items: listing?.not_included_items || [],
    what_to_bring: listing?.what_to_bring || [],
    meeting_point: listing?.meeting_point || "",
    meeting_instructions: listing?.meeting_instructions || "",
    cancellation_policy: listing?.cancellation_policy || "Full refund if cancelled 48+ hours before trip. 50% refund within 48 hours.",
    min_age: listing?.min_age || null,
    physical_requirements: listing?.physical_requirements || "",
    license_required: listing?.license_required || false,
    license_info: listing?.license_info || "",
    seasonal_availability: listing?.seasonal_availability || [],
    is_active: listing?.is_active ?? true,
  });

  const [newIncluded, setNewIncluded] = useState("");
  const [newNotIncluded, setNewNotIncluded] = useState("");
  const [newBring, setNewBring] = useState("");

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: 'included_items' | 'not_included_items' | 'what_to_bring', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setter("");
  };

  const removeListItem = (field: 'included_items' | 'not_included_items' | 'what_to_bring', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category) {
      return;
    }
    setSaving(true);
    await onSave(formData as Partial<ListingInsert>);
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="active-toggle" className="text-sm">Active</Label>
            <Switch
              id="active-toggle"
              checked={formData.is_active}
              onCheckedChange={(v) => updateField("is_active", v)}
            />
          </div>
          <Button variant="hero" onClick={handleSubmit} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : (listing ? "Update Listing" : "Create Listing")}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg text-foreground">Basic Information</h2>
            
            <div>
              <Label>Adventure Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., Full-Day Salmon Fishing on the Kenai"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Short Description</Label>
              <Textarea
                value={formData.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
                placeholder="A brief 1-2 sentence hook that appears in search results..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>Full Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the full experience, what makes it special, what guests can expect..."
                className="mt-1"
                rows={6}
              />
            </div>

            <div>
              <Label>Difficulty Level</Label>
              <Select value={formData.difficulty_level || "moderate"} onValueChange={(v) => updateField("difficulty_level", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Duration & Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg text-foreground">Duration & Pricing</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (Hours)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.duration_hours || ""}
                  onChange={(e) => updateField("duration_hours", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g., 8"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duration (Days)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.duration_days || ""}
                  onChange={(e) => updateField("duration_days", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="For multi-day trips"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Group Size</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.min_group_size || ""}
                  onChange={(e) => updateField("min_group_size", parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Max Group Size</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.max_group_size || ""}
                  onChange={(e) => updateField("max_group_size", parseInt(e.target.value) || 4)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price Per Person ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_person || ""}
                  onChange={(e) => updateField("price_per_person", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="e.g., 450"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Price Per Group ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_group || ""}
                  onChange={(e) => updateField("price_per_group", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Alternative to per-person"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Deposit Percentage (%)</Label>
              <Input
                type="number"
                min="10"
                max="100"
                value={formData.deposit_percentage || 25}
                onChange={(e) => updateField("deposit_percentage", parseInt(e.target.value) || 25)}
                className="mt-1 max-w-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">We recommend 20-25% to attract more bookings</p>
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg text-foreground">What's Included</h2>
            
            <div>
              <Label>Included Items</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newIncluded}
                  onChange={(e) => setNewIncluded(e.target.value)}
                  placeholder="e.g., All fishing gear"
                  onKeyDown={(e) => e.key === 'Enter' && addListItem('included_items', newIncluded, setNewIncluded)}
                />
                <Button type="button" variant="outline" onClick={() => addListItem('included_items', newIncluded, setNewIncluded)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.included_items.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    {item}
                    <button onClick={() => removeListItem('included_items', i)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>Not Included</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newNotIncluded}
                  onChange={(e) => setNewNotIncluded(e.target.value)}
                  placeholder="e.g., Fishing license"
                  onKeyDown={(e) => e.key === 'Enter' && addListItem('not_included_items', newNotIncluded, setNewNotIncluded)}
                />
                <Button type="button" variant="outline" onClick={() => addListItem('not_included_items', newNotIncluded, setNewNotIncluded)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.not_included_items.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                    {item}
                    <button onClick={() => removeListItem('not_included_items', i)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>What to Bring</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newBring}
                  onChange={(e) => setNewBring(e.target.value)}
                  placeholder="e.g., Warm layers"
                  onKeyDown={(e) => e.key === 'Enter' && addListItem('what_to_bring', newBring, setNewBring)}
                />
                <Button type="button" variant="outline" onClick={() => addListItem('what_to_bring', newBring, setNewBring)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.what_to_bring.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                    {item}
                    <button onClick={() => removeListItem('what_to_bring', i)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Media Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="font-display text-lg text-foreground mb-4">Media</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Image className="h-4 w-4" /> Add Photos
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Video className="h-4 w-4" /> Add Video
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Tip: High-quality photos increase bookings by 40%
              </p>
            </div>
          </motion.div>

          {/* Meeting Point */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg text-foreground">Meeting Details</h2>
            <div>
              <Label>Meeting Point</Label>
              <Input
                value={formData.meeting_point}
                onChange={(e) => updateField("meeting_point", e.target.value)}
                placeholder="e.g., Kenai River Boat Launch"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Instructions</Label>
              <Textarea
                value={formData.meeting_instructions}
                onChange={(e) => updateField("meeting_instructions", e.target.value)}
                placeholder="Directions, what to look for, parking info..."
                className="mt-1"
                rows={3}
              />
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg text-foreground">Requirements</h2>
            <div>
              <Label>Minimum Age</Label>
              <Input
                type="number"
                min="0"
                value={formData.min_age || ""}
                onChange={(e) => updateField("min_age", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Leave blank if none"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Physical Requirements</Label>
              <Textarea
                value={formData.physical_requirements}
                onChange={(e) => updateField("physical_requirements", e.target.value)}
                placeholder="Any physical fitness requirements..."
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>License Required</Label>
              <Switch
                checked={formData.license_required}
                onCheckedChange={(v) => updateField("license_required", v)}
              />
            </div>
            {formData.license_required && (
              <div>
                <Label>License Info</Label>
                <Textarea
                  value={formData.license_info}
                  onChange={(e) => updateField("license_info", e.target.value)}
                  placeholder="What license is needed and how to get it..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            )}
          </motion.div>

          {/* Cancellation Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg text-foreground">Policies</h2>
            <div>
              <Label>Cancellation Policy</Label>
              <Textarea
                value={formData.cancellation_policy}
                onChange={(e) => updateField("cancellation_policy", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}