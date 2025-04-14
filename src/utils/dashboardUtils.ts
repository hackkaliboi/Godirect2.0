import { supabase } from "@/integrations/supabase/client";
import { TrendingDown, TrendingUp } from "lucide-react";

export interface DashboardStat {
  id: string;
  stat_name: string;
  stat_value: string;
  stat_change: number;
  trend?: string;
  compare_text?: string;
  updated_at: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStat[]> => {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*');
    
    if (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    throw error;
  }
};

export const refreshDashboardStats = async (): Promise<{ success: boolean, message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('calculate-dashboard-stats');
    
    if (error) {
      console.error("Error refreshing dashboard stats:", error);
      return { 
        success: false, 
        message: error.message || "Failed to refresh dashboard statistics"
      };
    }
    
    return { 
      success: true, 
      message: "Dashboard statistics refreshed successfully"
    };
  } catch (error) {
    console.error("Error in refreshDashboardStats:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred"
    };
  }
};

export const findStatByName = (stats: DashboardStat[] | undefined, name: string): DashboardStat => {
  if (!stats) return { id: '', stat_name: name, stat_value: '0', stat_change: 0, updated_at: '' };
  const stat = stats.find(s => s.stat_name === name);
  return stat || { id: '', stat_name: name, stat_value: '0', stat_change: 0, updated_at: '' };
};

export const formatTrendIcon = (change: number) => {
  if (change > 0) {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  }
  if (change < 0) {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return null;
};

export const formatTrendClass = (change: number): string => {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-muted-foreground";
};

export const getTrendClass = (trend?: string): string => {
  switch (trend) {
    case "positive":
      return "text-green-500";
    case "negative":
      return "text-red-500";
    case "warning":
      return "text-amber-500";
    default:
      return "text-blue-500";
  }
};
