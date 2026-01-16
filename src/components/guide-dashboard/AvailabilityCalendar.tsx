import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  getDay,
  startOfWeek,
  endOfWeek,
  addDays
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Ban, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecurringAvailability, BlockedDate } from "@/hooks/useGuideAvailability";

interface AvailabilityCalendarProps {
  recurringPatterns: RecurringAvailability[];
  blockedDates: BlockedDate[];
  onSetRecurring: (pattern: Omit<RecurringAvailability, "id" | "guide_profile_id" | "user_id">) => Promise<{ error: string | null }>;
  onRemoveRecurring: (id: string) => Promise<{ error: string | null }>;
  onBlockDates: (start: Date, end: Date, reason?: string) => Promise<{ error: string | null }>;
  onUnblockDates: (id: string) => Promise<{ error: string | null }>;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityCalendar({
  recurringPatterns,
  blockedDates,
  onSetRecurring,
  onRemoveRecurring,
  onBlockDates,
  onUnblockDates,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockEndDate, setBlockEndDate] = useState<string>("");
  const [blockReason, setBlockReason] = useState("");
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [recurringStartTime, setRecurringStartTime] = useState("08:00");
  const [recurringEndTime, setRecurringEndTime] = useState("17:00");

  // Calendar days including padding for alignment
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  // Check if a date is blocked
  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.some(b => dateStr >= b.start_date && dateStr <= b.end_date);
  };

  // Get recurring pattern for a day
  const getRecurringForDay = (dayOfWeek: number) => {
    return recurringPatterns.find(p => p.day_of_week === dayOfWeek && p.is_active);
  };

  // Handle blocking selected date range
  const handleBlockDates = async () => {
    if (!selectedDate) return;
    const endDate = blockEndDate ? new Date(blockEndDate) : selectedDate;
    await onBlockDates(selectedDate, endDate, blockReason || undefined);
    setBlockDialogOpen(false);
    setBlockEndDate("");
    setBlockReason("");
    setSelectedDate(null);
  };

  // Handle setting recurring pattern
  const handleSetRecurring = async () => {
    if (selectedDate === null) return;
    const dayOfWeek = getDay(selectedDate);
    await onSetRecurring({
      day_of_week: dayOfWeek,
      start_time: recurringStartTime,
      end_time: recurringEndTime,
      is_active: true,
      effective_from: null,
      effective_until: null,
    });
    setRecurringDialogOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      {/* Recurring Schedule Overview */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {DAY_NAMES.map((day, index) => {
            const pattern = getRecurringForDay(index);
            return (
              <div
                key={day}
                className={`p-3 rounded-lg text-center transition-colors ${
                  pattern 
                    ? "bg-accent/10 border border-accent/20" 
                    : "bg-muted/50 border border-border"
                }`}
              >
                <p className="font-medium text-sm text-foreground">{day}</p>
                {pattern ? (
                  <div className="mt-1">
                    <p className="text-xs text-accent">
                      {pattern.start_time.slice(0, 5)} - {pattern.end_time.slice(0, 5)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-1 h-6 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveRecurring(pattern.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Unavailable</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Click a date below to set or modify your schedule for that day of the week.
        </p>
      </div>

      {/* Calendar View */}
      <div className="glass rounded-xl p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-display text-xl text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const blocked = isDateBlocked(day);
            const hasRecurring = getRecurringForDay(getDay(day));

            return (
              <motion.button
                key={day.toString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square p-2 rounded-lg text-center relative transition-all
                  ${!isCurrentMonth ? "opacity-30" : ""}
                  ${isSelected ? "ring-2 ring-accent" : ""}
                  ${blocked ? "bg-destructive/10 text-destructive" : ""}
                  ${hasRecurring && !blocked ? "bg-accent/10" : ""}
                  ${isToday(day) ? "border-2 border-accent" : "border border-border"}
                  hover:border-accent/50
                `}
              >
                <span className={`text-sm ${isToday(day) ? "font-bold" : ""}`}>
                  {format(day, "d")}
                </span>
                {blocked && (
                  <Ban className="h-3 w-3 text-destructive absolute bottom-1 right-1" />
                )}
                {hasRecurring && !blocked && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Actions */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <h4 className="font-display text-lg text-foreground mb-4">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h4>
          
          <div className="flex flex-wrap gap-3">
            {/* Set Recurring */}
            <Dialog open={recurringDialogOpen} onOpenChange={setRecurringDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Set {FULL_DAY_NAMES[getDay(selectedDate)]} Hours
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Weekly Hours for {FULL_DAY_NAMES[getDay(selectedDate)]}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={recurringStartTime}
                        onChange={(e) => setRecurringStartTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={recurringEndTime}
                        onChange={(e) => setRecurringEndTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSetRecurring} className="w-full">
                    Save Weekly Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Block Dates */}
            {!isDateBlocked(selectedDate) ? (
              <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Ban className="h-4 w-4 mr-2" />
                    Block Date(s)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block Dates</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input value={format(selectedDate, "yyyy-MM-dd")} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label>End Date (optional, for range)</Label>
                      <Input
                        type="date"
                        value={blockEndDate}
                        onChange={(e) => setBlockEndDate(e.target.value)}
                        min={format(selectedDate, "yyyy-MM-dd")}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Reason (optional)</Label>
                      <Input
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        placeholder="e.g., Vacation, Personal day"
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleBlockDates} variant="destructive" className="w-full">
                      Block These Dates
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  const block = blockedDates.find(b => {
                    const dateStr = format(selectedDate, "yyyy-MM-dd");
                    return dateStr >= b.start_date && dateStr <= b.end_date;
                  });
                  if (block) onUnblockDates(block.id);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Unblock Date
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Blocked Dates List */}
      {blockedDates.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Blocked Dates
          </h3>
          <div className="space-y-2">
            {blockedDates.map((block) => (
              <div 
                key={block.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {format(new Date(block.start_date), "MMM d")}
                    {block.start_date !== block.end_date && ` - ${format(new Date(block.end_date), "MMM d, yyyy")}`}
                  </p>
                  {block.reason && (
                    <p className="text-sm text-muted-foreground">{block.reason}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUnblockDates(block.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
