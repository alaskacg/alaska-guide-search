import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, MapPin, Calendar, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  category: string;
  locations: string[];
  onFilterChange?: (filters: Record<string, string>) => void;
}

const FilterBar = ({ category, locations }: FilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 mb-8"
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder={`Search ${category} guides...`}
            className="bg-background/50"
          />
        </div>

        {/* Location Filter */}
        <Select>
          <SelectTrigger className="w-[180px] bg-background/50">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location.toLowerCase().replace(/\s/g, '-')}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select>
          <SelectTrigger className="w-[180px] bg-background/50">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Date</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="next-month">Next Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Filter */}
        <Select>
          <SelectTrigger className="w-[160px] bg-background/50">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Price</SelectItem>
            <SelectItem value="budget">Under $500</SelectItem>
            <SelectItem value="mid">$500 - $1,000</SelectItem>
            <SelectItem value="premium">$1,000+</SelectItem>
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select>
          <SelectTrigger className="w-[140px] bg-background/50">
            <Star className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Rating</SelectItem>
            <SelectItem value="4.5+">4.5+ Stars</SelectItem>
            <SelectItem value="4+">4+ Stars</SelectItem>
          </SelectContent>
        </Select>

        {/* More Filters */}
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>
    </motion.div>
  );
};

export default FilterBar;
