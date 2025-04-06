
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, RefreshCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  secondaryAction?: React.ReactNode;
  dateFilter?: boolean;
  exportButton?: boolean;
  refreshButton?: boolean;
  filters?: {
    label: string;
    options: {value: string, label: string}[];
    onChange: (value: string) => void;
    value: string;
  }[];
}

export function DashboardHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onActionClick,
  secondaryAction,
  dateFilter = false,
  exportButton = false,
  refreshButton = false,
  filters = []
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {filters.length > 0 && filters.map((filter, index) => (
          <div key={index} className="w-auto min-w-[140px]">
            <Select value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        
        {dateFilter && <CurrentMonthButton />}
        
        {refreshButton && (
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCcw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}
        
        {exportButton && (
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}
        
        {secondaryAction}
        
        {actionLabel && (
          <Button 
            onClick={onActionClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            {actionIcon && <span className="mr-2">{actionIcon}</span>}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function CurrentMonthButton() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return (
    <Button variant="outline" size="sm" className="h-9">
      <Calendar className="mr-2 h-4 w-4" />
      <span>{currentMonth} {currentYear}</span>
    </Button>
  );
}
