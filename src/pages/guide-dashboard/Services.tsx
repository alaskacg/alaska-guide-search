import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  GripVertical,
  Upload,
  X,
  Image as ImageIcon,
  Save,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { GuideProfile } from "@/hooks/useGuideProfile";
import { ServiceType } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardContext {
  profile: GuideProfile | null;
}

interface Service {
  id: string;
  title: string;
  description: string;
  short_description: string;
  service_type: ServiceType;
  duration_hours: number;
  price_per_person: number;
  max_participants: number;
  min_participants: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  images: string[];
  active: boolean;
  featured: boolean;
  total_bookings: number;
  total_revenue: number;
  avg_rating?: number;
  included: string[];
  what_to_bring: string[];
  order_index: number;
}

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  advanced: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  expert: "bg-red-500/20 text-red-300 border-red-500/30",
};

const serviceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.FISHING]: "Fishing",
  [ServiceType.HUNTING]: "Hunting",
  [ServiceType.WILDLIFE_VIEWING]: "Wildlife Viewing",
  [ServiceType.HIKING]: "Hiking",
  [ServiceType.PHOTOGRAPHY]: "Photography",
  [ServiceType.CAMPING]: "Camping",
  [ServiceType.KAYAKING]: "Kayaking",
  [ServiceType.RAFTING]: "Rafting",
  [ServiceType.GLACIER_TOURS]: "Glacier Tours",
  [ServiceType.CUSTOM]: "Custom",
};

const emptyService: Omit<Service, 'id' | 'total_bookings' | 'total_revenue' | 'order_index'> = {
  title: "",
  description: "",
  short_description: "",
  service_type: ServiceType.FISHING,
  duration_hours: 8,
  price_per_person: 0,
  max_participants: 6,
  min_participants: 1,
  difficulty_level: 'beginner',
  images: [],
  active: true,
  featured: false,
  included: [],
  what_to_bring: [],
};

export default function Services() {
  const { profile } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "Full Day Salmon Fishing",
      short_description: "Experience world-class salmon fishing in pristine Alaskan waters",
      description: "Join us for an unforgettable full-day salmon fishing adventure. We'll target all five species of Pacific salmon using proven techniques and top-quality equipment. Perfect for both beginners and experienced anglers.",
      service_type: ServiceType.FISHING,
      duration_hours: 12,
      price_per_person: 300,
      max_participants: 6,
      min_participants: 1,
      difficulty_level: 'intermediate',
      images: [],
      active: true,
      featured: true,
      total_bookings: 45,
      total_revenue: 13500,
      avg_rating: 4.8,
      included: ["All fishing gear", "Bait and tackle", "Lunch", "Fish cleaning"],
      what_to_bring: ["Warm layers", "Rain gear", "Sunglasses", "Camera"],
      order_index: 0,
    },
    {
      id: "2",
      title: "Grizzly Bear Viewing Experience",
      short_description: "Safe, guided bear viewing in their natural habitat",
      description: "Witness majestic grizzly bears in the wild with our expert guides. This incredible experience offers unparalleled wildlife photography opportunities while maintaining safe distances and respecting wildlife.",
      service_type: ServiceType.WILDLIFE_VIEWING,
      duration_hours: 8,
      price_per_person: 400,
      max_participants: 4,
      min_participants: 2,
      difficulty_level: 'beginner',
      images: [],
      active: true,
      featured: true,
      total_bookings: 28,
      total_revenue: 11200,
      avg_rating: 4.9,
      included: ["Transportation", "Binoculars", "Snacks", "Expert guide"],
      what_to_bring: ["Camera", "Comfortable shoes", "Water bottle", "Hat"],
      order_index: 1,
    },
    {
      id: "3",
      title: "Glacier Hiking Adventure",
      short_description: "Trek across ancient ice with certified guides",
      description: "Explore the stunning blue ice of Alaska's glaciers on this moderate hike. Learn about glaciology and climate while experiencing one of nature's most spectacular formations.",
      service_type: ServiceType.GLACIER_TOURS,
      duration_hours: 6,
      price_per_person: 250,
      max_participants: 8,
      min_participants: 2,
      difficulty_level: 'intermediate',
      images: [],
      active: false,
      featured: false,
      total_bookings: 12,
      total_revenue: 3000,
      avg_rating: 4.7,
      included: ["Crampons", "Ice axe", "Helmet", "Guide"],
      what_to_bring: ["Hiking boots", "Warm layers", "Gloves", "Sunscreen"],
      order_index: 2,
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState(emptyService);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [newBringItem, setNewBringItem] = useState("");

  const handleCreate = () => {
    setEditingService(null);
    setFormData(emptyService);
    setShowEditor(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price_per_person) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingService) {
        setServices(prev => prev.map(s => 
          s.id === editingService.id 
            ? { ...s, ...formData }
            : s
        ));
        toast({
          title: "Service Updated",
          description: "Your service has been updated successfully",
        });
      } else {
        const newService: Service = {
          ...formData,
          id: Date.now().toString(),
          total_bookings: 0,
          total_revenue: 0,
          order_index: services.length,
        };
        setServices(prev => [...prev, newService]);
        toast({
          title: "Service Created",
          description: "Your new service has been created successfully",
        });
      }
      setShowEditor(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setServices(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Service Deleted",
        description: "The service has been deleted successfully",
      });
      setDeleteDialog(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const toggleFeatured = (id: string) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, featured: !s.featured } : s
    ));
  };

  const handleReorder = (newOrder: Service[]) => {
    setServices(newOrder.map((service, index) => ({
      ...service,
      order_index: index,
    })));
  };

  const handleAddIncludedItem = () => {
    if (newIncludedItem.trim()) {
      setFormData(prev => ({
        ...prev,
        included: [...prev.included, newIncludedItem.trim()],
      }));
      setNewIncludedItem("");
    }
  };

  const handleRemoveIncludedItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== index),
    }));
  };

  const handleAddBringItem = () => {
    if (newBringItem.trim()) {
      setFormData(prev => ({
        ...prev,
        what_to_bring: [...prev.what_to_bring, newBringItem.trim()],
      }));
      setNewBringItem("");
    }
  };

  const handleRemoveBringItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      what_to_bring: prev.what_to_bring.filter((_, i) => i !== index),
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg truncate">{service.title}</CardTitle>
                {service.featured && (
                  <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {service.short_description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={difficultyColors[service.difficulty_level]}>
                {service.difficulty_level}
              </Badge>
              <Badge variant="outline" className="border-slate-700">
                {serviceTypeLabels[service.service_type]}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Price</div>
              <div className="text-lg font-bold text-glacier-400">
                {formatCurrency(service.price_per_person)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Bookings</div>
              <div className="text-lg font-bold text-white">
                {service.total_bookings}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Revenue</div>
              <div className="text-lg font-bold text-green-400">
                {formatCurrency(service.total_revenue)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Rating</div>
              <div className="text-lg font-bold text-yellow-400">
                {service.avg_rating ? `${service.avg_rating} ⭐` : 'N/A'}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {service.min_participants}-{service.max_participants}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {service.duration_hours}h
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={service.active}
                onCheckedChange={() => toggleActive(service.id)}
              />
              <span className={service.active ? "text-green-400" : "text-slate-500"}>
                {service.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleFeatured(service.id)}
            className="flex-1 border-slate-700"
          >
            <Sparkles className={`w-4 h-4 mr-1 ${service.featured ? 'text-yellow-400' : ''}`} />
            {service.featured ? 'Featured' : 'Feature'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(service)}
            className="flex-1 border-slate-700"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteDialog(service.id)}
            className="border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
          <p className="text-slate-400">Manage your tour offerings and pricing</p>
        </div>
        <Button onClick={handleCreate} className="bg-glacier-600 hover:bg-glacier-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-glacier-900/50 to-slate-900/50 border-glacier-800">
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl text-glacier-400">{services.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/50 to-slate-900/50 border-green-800">
          <CardHeader className="pb-2">
            <CardDescription>Active Services</CardDescription>
            <CardTitle className="text-3xl text-green-400">
              {services.filter(s => s.active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900/50 to-slate-900/50 border-yellow-800">
          <CardHeader className="pb-2">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl text-yellow-400">
              {services.reduce((sum, s) => sum + s.total_bookings, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900/50 border-emerald-800">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl text-emerald-400">
              {formatCurrency(services.reduce((sum, s) => sum + s.total_revenue, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Services List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <AnimatePresence mode="popLayout">
            <Reorder.Group
              axis="y"
              values={services}
              onReorder={handleReorder}
              className="space-y-4"
            >
              {services.map(service => (
                <Reorder.Item key={service.id} value={service}>
                  <div className="flex items-center gap-2">
                    <div className="cursor-move text-slate-600 hover:text-slate-400">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <ServiceCard service={service} />
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <AnimatePresence mode="popLayout">
            {services.filter(s => s.active).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <AnimatePresence mode="popLayout">
            {services.filter(s => s.featured).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Service Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-800 max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingService ? 'update' : 'create'} your service
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Full Day Salmon Fishing"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description *</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief one-liner description"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed service description..."
                    rows={4}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service_type">Service Type *</Label>
                    <Select 
                      value={formData.service_type} 
                      onValueChange={(value) => setFormData({ ...formData, service_type: value as ServiceType })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serviceTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select 
                      value={formData.difficulty_level} 
                      onValueChange={(value: any) => setFormData({ ...formData, difficulty_level: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Pricing & Capacity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing & Capacity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price per Person *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price_per_person}
                      onChange={(e) => setFormData({ ...formData, price_per_person: parseFloat(e.target.value) || 0 })}
                      placeholder="300"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (hours) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) || 0 })}
                      placeholder="8"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_participants">Min Participants *</Label>
                    <Input
                      id="min_participants"
                      type="number"
                      value={formData.min_participants}
                      onChange={(e) => setFormData({ ...formData, min_participants: parseInt(e.target.value) || 1 })}
                      placeholder="1"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_participants">Max Participants *</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 1 })}
                      placeholder="6"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* What's Included */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What's Included</h3>
                <div className="flex gap-2">
                  <Input
                    value={newIncludedItem}
                    onChange={(e) => setNewIncludedItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIncludedItem()}
                    placeholder="e.g., All fishing gear"
                    className="bg-slate-800 border-slate-700"
                  />
                  <Button onClick={handleAddIncludedItem} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.included.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded">
                      <span className="flex-1 text-sm">{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveIncludedItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* What to Bring */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">What to Bring</h3>
                <div className="flex gap-2">
                  <Input
                    value={newBringItem}
                    onChange={(e) => setNewBringItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddBringItem()}
                    placeholder="e.g., Warm layers"
                    className="bg-slate-800 border-slate-700"
                  />
                  <Button onClick={handleAddBringItem} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.what_to_bring.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded">
                      <span className="flex-1 text-sm">{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveBringItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Service Images</h3>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <p className="text-slate-400 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-video bg-slate-800 rounded-lg">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index)
                          })}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-glacier-600 hover:bg-glacier-700">
              <Save className="w-4 h-4 mr-2" />
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
              All associated bookings will remain but won't be linked to this service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
