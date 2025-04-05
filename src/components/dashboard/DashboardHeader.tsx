
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  secondaryAction?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onActionClick,
  secondaryAction
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
      <div className="flex gap-2">
        {secondaryAction}
        {actionLabel && (
          <Button 
            onClick={onActionClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
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
    <Button variant="outline" size="sm">
      <Calendar className="mr-2 h-4 w-4" />
      <span>{currentMonth} {currentYear}</span>
    </Button>
  );
}
