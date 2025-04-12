
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  label: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  value: string;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  dateFilter?: boolean;
  exportButton?: boolean;
  refreshButton?: boolean;
  filters?: FilterProps[];
}

export function DashboardHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  dateFilter = false,
  exportButton = false,
  refreshButton = false,
  filters = [],
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {dateFilter && (
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {filters && filters.length > 0 && filters.map((filter, index) => (
          <Select key={index} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option, optIndex) => (
                <SelectItem key={optIndex} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        
        {exportButton && (
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        )}
        
        {refreshButton && (
          <Button variant="outline" onClick={onAction} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        )}
        
        {actionLabel && !refreshButton && (
          <Button onClick={onAction} className="gap-2">
            {actionIcon}
            <span>{actionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
