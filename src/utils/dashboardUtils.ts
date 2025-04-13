
import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*');
  
  if (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
  
  return data || [];
};

export const findStatByName = (stats: DashboardStat[] | undefined, name: string): DashboardStat => {
  if (!stats) return { id: '', stat_name: name, stat_value: '0', stat_change: 0, updated_at: '' };
  const stat = stats.find(s => s.stat_name === name);
  return stat || { id: '', stat_name: name, stat_value: '0', stat_change: 0, updated_at: '' };
};

export const formatTrendIcon = (change: number): JSX.Element | null => {
  if (change > 0) return null; // Positive icon component would go here
  if (change < 0) return null; // Negative icon component would go here
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
