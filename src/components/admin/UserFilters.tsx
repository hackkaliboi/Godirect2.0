import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon } from "lucide-react";

interface UserFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [filters, setFilters] = useState({
    searchTerm: "",
    userType: "all",
    status: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const handleApplyFilters = () => {
    const newFilters = {
      ...filters,
      dateFrom,
      dateTo
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchTerm: "",
      userType: "all",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
    };
    setFilters(resetFilters);
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange(resetFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">User Filters</h4>
            <p className="text-sm text-muted-foreground">
              Filter users by various criteria
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Name, email, or phone..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="user-type">User Type</Label>
            <Select 
              value={filters.userType} 
              onValueChange={(value) => setFilters({...filters, userType: value})}
            >
              <SelectTrigger id="user-type">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">Regular User</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}