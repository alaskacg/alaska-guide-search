import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";

export interface AvailabilitySlot {
  id: string;
  guide_profile_id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes: string | null;
}

export interface RecurringAvailability {
  id: string;
  guide_profile_id: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  effective_from: string | null;
  effective_until: string | null;
}

export interface BlockedDate {
  id: string;
  guide_profile_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
}

export function useGuideAvailability(guideProfileId: string | undefined) {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [recurringPatterns, setRecurringPatterns] = useState<RecurringAvailability[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAvailability = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!guideProfileId) {
      setLoading(false);
      return;
    }

    const start = startDate || startOfMonth(new Date());
    const end = endDate || endOfMonth(addDays(new Date(), 90));

    try {
      const [availabilityRes, recurringRes, blockedRes] = await Promise.all([
        supabase
          .from("guide_availability")
          .select("*")
          .eq("guide_profile_id", guideProfileId)
          .gte("date", format(start, "yyyy-MM-dd"))
          .lte("date", format(end, "yyyy-MM-dd")),
        supabase
          .from("guide_recurring_availability")
          .select("*")
          .eq("guide_profile_id", guideProfileId)
          .eq("is_active", true),
        supabase
          .from("guide_blocked_dates")
          .select("*")
          .eq("guide_profile_id", guideProfileId),
      ]);

      if (availabilityRes.error) throw availabilityRes.error;
      if (recurringRes.error) throw recurringRes.error;
      if (blockedRes.error) throw blockedRes.error;

      setAvailability((availabilityRes.data || []) as AvailabilitySlot[]);
      setRecurringPatterns((recurringRes.data || []) as RecurringAvailability[]);
      setBlockedDates((blockedRes.data || []) as BlockedDate[]);
    } catch (err: any) {
      toast({ title: "Error loading availability", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [guideProfileId, toast]);

  const addAvailabilitySlot = async (slot: Omit<AvailabilitySlot, "id" | "guide_profile_id" | "user_id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !guideProfileId) return { error: "Not authenticated" };

    try {
      const { data, error } = await supabase
        .from("guide_availability")
        .insert({
          ...slot,
          guide_profile_id: guideProfileId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setAvailability([...availability, data as AvailabilitySlot]);
      toast({ title: "Availability added" });
      return { error: null, data };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const removeAvailabilitySlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from("guide_availability")
        .delete()
        .eq("id", slotId);

      if (error) throw error;
      setAvailability(availability.filter(a => a.id !== slotId));
      toast({ title: "Availability removed" });
      return { error: null };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const setRecurringPattern = async (pattern: Omit<RecurringAvailability, "id" | "guide_profile_id" | "user_id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !guideProfileId) return { error: "Not authenticated" };

    try {
      // Remove existing pattern for same day
      await supabase
        .from("guide_recurring_availability")
        .delete()
        .eq("guide_profile_id", guideProfileId)
        .eq("day_of_week", pattern.day_of_week);

      const { data, error } = await supabase
        .from("guide_recurring_availability")
        .insert({
          ...pattern,
          guide_profile_id: guideProfileId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setRecurringPatterns([
        ...recurringPatterns.filter(p => p.day_of_week !== pattern.day_of_week),
        data as RecurringAvailability,
      ]);
      toast({ title: "Recurring schedule updated" });
      return { error: null, data };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const removeRecurringPattern = async (patternId: string) => {
    try {
      const { error } = await supabase
        .from("guide_recurring_availability")
        .delete()
        .eq("id", patternId);

      if (error) throw error;
      setRecurringPatterns(recurringPatterns.filter(p => p.id !== patternId));
      toast({ title: "Pattern removed" });
      return { error: null };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const blockDateRange = async (startDate: Date, endDate: Date, reason?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !guideProfileId) return { error: "Not authenticated" };

    try {
      const { data, error } = await supabase
        .from("guide_blocked_dates")
        .insert({
          guide_profile_id: guideProfileId,
          user_id: user.id,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          reason: reason || null,
        })
        .select()
        .single();

      if (error) throw error;
      setBlockedDates([...blockedDates, data as BlockedDate]);
      toast({ title: "Dates blocked" });
      return { error: null, data };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const unblockDateRange = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from("guide_blocked_dates")
        .delete()
        .eq("id", blockId);

      if (error) throw error;
      setBlockedDates(blockedDates.filter(b => b.id !== blockId));
      toast({ title: "Dates unblocked" });
      return { error: null };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  // Generate availability for a date range based on recurring patterns
  const getComputedAvailability = useCallback((startDate: Date, endDate: Date) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const computed: { date: Date; slots: { start: string; end: string }[]; isBlocked: boolean }[] = [];

    for (const day of days) {
      const dayOfWeek = getDay(day);
      const dateStr = format(day, "yyyy-MM-dd");

      // Check if date is blocked
      const isBlocked = blockedDates.some(b => 
        dateStr >= b.start_date && dateStr <= b.end_date
      );

      // Get explicit availability for this date
      const explicitSlots = availability
        .filter(a => a.date === dateStr && a.is_available)
        .map(a => ({ start: a.start_time, end: a.end_time }));

      // Get recurring pattern for this day
      const recurringSlots = recurringPatterns
        .filter(p => p.day_of_week === dayOfWeek && p.is_active)
        .filter(p => {
          if (p.effective_from && dateStr < p.effective_from) return false;
          if (p.effective_until && dateStr > p.effective_until) return false;
          return true;
        })
        .map(p => ({ start: p.start_time, end: p.end_time }));

      // Prefer explicit slots, fall back to recurring
      const slots = explicitSlots.length > 0 ? explicitSlots : recurringSlots;

      computed.push({ date: day, slots, isBlocked });
    }

    return computed;
  }, [availability, recurringPatterns, blockedDates]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return {
    availability,
    recurringPatterns,
    blockedDates,
    loading,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    setRecurringPattern,
    removeRecurringPattern,
    blockDateRange,
    unblockDateRange,
    getComputedAvailability,
    refetch: fetchAvailability,
  };
}
