import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Plus, Eye, EyeOff, Edit2, Trash2, MoreVertical, DollarSign, Users, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GuideProfile } from "@/hooks/useGuideProfile";
import { useGuideListings, GuideListing } from "@/hooks/useGuideListings";
import ListingEditor from "@/components/guide-dashboard/ListingEditor";

interface DashboardContext {
  profile: GuideProfile | null;
}

const categoryColors: Record<string, string> = {
  fishing: "bg-blue-500/20 text-blue-300",
  hunting: "bg-orange-500/20 text-orange-300",
  eco: "bg-green-500/20 text-green-300",
  flights: "bg-purple-500/20 text-purple-300",
  adventure: "bg-accent/20 text-accent",
};

export default function Listings() {
  const { profile } = useOutletContext<DashboardContext>();
  const { listings, loading, createListing, updateListing, deleteListing, toggleActive } = useGuideListings(profile?.id);
  const [showEditor, setShowEditor] = useState(false);
  const [editingListing, setEditingListing] = useState<GuideListing | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingListing(null);
    setShowEditor(true);
  };

  const handleEdit = (listing: GuideListing) => {
    setEditingListing(listing);
    setShowEditor(true);
  };

  const handleSave = async (data: any) => {
    if (editingListing) {
      const result = await updateListing(editingListing.id, data);
      if (result) setShowEditor(false);
      return result;
    } else {
      const result = await createListing(data);
      if (result) setShowEditor(false);
      return result;
    }
  };

  const handleDelete = async (id: string) => {
    await deleteListing(id);
    setDeleteDialog(null);
  };

  // Beta benefits - all unlimited during beta
  const betaDaysRemaining = profile?.beta_started_at 
    ? Math.max(0, 60 - Math.floor((Date.now() - new Date(profile.beta_started_at).getTime()) / (1000 * 60 * 60 * 24)))
    : 60;

  if (showEditor) {
    return (
      <div className="max-w-6xl mx-auto">
        <ListingEditor
          listing={editingListing}
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="font-display text-2xl text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-accent" />
            Adventure Listings
          </h1>
          <p className="text-muted-foreground">
            Create and manage your guided trip offerings. Each listing becomes its own bookable experience.
          </p>
        </div>
        <Button variant="hero" onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create Listing
        </Button>
      </motion.div>

      {/* Beta Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-4 rounded-xl bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border border-accent/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-foreground">Beta Access: Unlimited Listings</p>
              <p className="text-sm text-muted-foreground">Create as many listings as you want during the beta period.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
            {betaDaysRemaining} days remaining
          </Badge>
        </div>
      </motion.div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl text-foreground mb-3">No Listings Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Create your first adventure listing to start attracting guests. Each listing can have its own pricing, 
            duration, and availability settings.
          </p>
          <Button variant="hero" onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Create Your First Listing
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl overflow-hidden group ${!listing.is_active ? 'opacity-60' : ''}`}
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-muted to-muted/50 relative">
                {listing.featured_image_url ? (
                  <img src={listing.featured_image_url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={categoryColors[listing.category] || categoryColors.adventure}>
                    {listing.category}
                  </Badge>
                </div>
                
                {/* Actions */}
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(listing)}>
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(listing.id, !listing.is_active)}>
                        {listing.is_active ? (
                          <><EyeOff className="h-4 w-4 mr-2" /> Hide</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-2" /> Show</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteDialog(listing.id)}
                        className="text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {!listing.is_active && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Badge variant="outline" className="bg-background">Hidden</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-display text-lg text-foreground line-clamp-1">{listing.title}</h3>
                
                {listing.short_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{listing.short_description}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {listing.price_per_person && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {listing.price_per_person}/person
                    </span>
                  )}
                  {listing.duration_hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {listing.duration_hours}h
                    </span>
                  )}
                  {listing.max_group_size && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Max {listing.max_group_size}
                    </span>
                  )}
                </div>

                {/* Booking stats */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {listing.view_count || 0} views · {listing.booking_count || 0} bookings
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(listing)}>
                    Edit
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The listing and all its associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}