import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RevenueDataPoint {
  month: string;
  revenue: number;
  transactions: number;
}

interface UserGrowthDataPoint {
  month: string;
  users: number;
  agents: number;
}

interface PropertyTypeDataPoint {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartsProps {
  className?: string;
  timeRange?: string; // Add timeRange prop
}

// Helper function to calculate date range
const getDateRange = (timeRange: string) => {
  const now = new Date();
  const startDate = new Date(now);

  switch (timeRange) {
    case '1d':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30); // Default to 30 days
  }

  return { startDate, endDate: now };
};

// Helper function to format date for display
const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function AnalyticsCharts({ className, timeRange = '30d' }: AnalyticsChartsProps) {
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<PropertyTypeDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        const { startDate, endDate } = getDateRange(timeRange);

        // Fetch revenue and transaction data grouped by time periods
        const { data: transactions, error: transactionsError } = await (supabase as any)
          .from('property_transactions')
          .select('price, created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: true });

        if (transactionsError) throw transactionsError;

        // Group transactions by week/month for revenue chart
        const revenueDataPoints: RevenueDataPoint[] = [];

        // For simplicity, we'll create data points for each week in the selected range
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const periodCount = timeRange === '1d' ? 24 :
          timeRange === '7d' ? 7 :
            timeRange === '30d' ? 4 :
              timeRange === '90d' ? 12 :
                12; // 1y

        const periodLabel = timeRange === '1d' ? 'hour' :
          timeRange === '7d' ? 'day' :
            timeRange === '30d' ? 'week' :
              timeRange === '90d' ? 'week' :
                'month';

        for (let i = 0; i < periodCount; i++) {
          const periodStart = new Date(startDate);
          if (timeRange === '1d') {
            periodStart.setHours(periodStart.getHours() + i);
          } else if (timeRange === '7d' || timeRange === '30d') {
            periodStart.setDate(periodStart.getDate() + i * Math.ceil(daysDiff / periodCount));
          } else {
            periodStart.setMonth(periodStart.getMonth() + i);
          }

          const periodEnd = new Date(periodStart);
          if (timeRange === '1d') {
            periodEnd.setHours(periodEnd.getHours() + 1);
          } else if (timeRange === '7d' || timeRange === '30d') {
            periodEnd.setDate(periodEnd.getDate() + Math.ceil(daysDiff / periodCount));
          } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
          }

          // Filter transactions for this period
          const periodTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.created_at);
            return transactionDate >= periodStart && transactionDate < periodEnd;
          });

          const periodRevenue = periodTransactions.reduce((sum, t) => sum + (t.price || 0), 0);
          const periodTransactionCount = periodTransactions.length;

          revenueDataPoints.push({
            month: formatDateForDisplay(periodStart),
            revenue: periodRevenue,
            transactions: periodTransactionCount
          });
        }

        // Fetch user growth data
        const { data: users, error: usersError } = await (supabase as any)
          .from('profiles')
          .select('created_at, user_type')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: true });

        if (usersError) throw usersError;

        // Group users by week/month for user growth chart
        const userGrowthDataPoints: UserGrowthDataPoint[] = [];

        for (let i = 0; i < periodCount; i++) {
          const periodStart = new Date(startDate);
          if (timeRange === '1d') {
            periodStart.setHours(periodStart.getHours() + i);
          } else if (timeRange === '7d' || timeRange === '30d') {
            periodStart.setDate(periodStart.getDate() + i * Math.ceil(daysDiff / periodCount));
          } else {
            periodStart.setMonth(periodStart.getMonth() + i);
          }

          const periodEnd = new Date(periodStart);
          if (timeRange === '1d') {
            periodEnd.setHours(periodEnd.getHours() + 1);
          } else if (timeRange === '7d' || timeRange === '30d') {
            periodEnd.setDate(periodEnd.getDate() + Math.ceil(daysDiff / periodCount));
          } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
          }

          // Filter users for this period
          const periodUsers = users.filter(u => {
            const userDate = new Date(u.created_at);
            return userDate >= periodStart && userDate < periodEnd;
          });

          const periodUserCount = periodUsers.length;
          const periodAgentCount = periodUsers.filter(u => u.user_type === 'agent').length;

          userGrowthDataPoints.push({
            month: formatDateForDisplay(periodStart),
            users: periodUserCount,
            agents: periodAgentCount
          });
        }

        // Fetch property type data
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('property_type');

        if (propertiesError) throw propertiesError;

        // Generate property type data
        const propertyTypeMap: Record<string, number> = {};
        properties?.forEach(property => {
          propertyTypeMap[property.property_type] = (propertyTypeMap[property.property_type] || 0) + 1;
        });

        const propertyTypeDataPoints: PropertyTypeDataPoint[] = Object.entries(propertyTypeMap).map(([name, count], index) => ({
          name,
          value: count,
          color: `hsl(var(--${['primary', 'accent', 'success', 'warning'][index % 4]}))`
        }));

        // Fill in with default data if no properties
        if (propertyTypeDataPoints.length === 0) {
          propertyTypeDataPoints.push(
            { name: "Apartments", value: 0, color: "hsl(var(--primary))" },
            { name: "Houses", value: 0, color: "hsl(var(--accent))" },
            { name: "Condos", value: 0, color: "hsl(var(--success))" },
            { name: "Commercial", value: 0, color: "hsl(var(--warning))" }
          );
        }

        setRevenueData(revenueDataPoints);
        setUserGrowthData(userGrowthDataPoints);
        setPropertyTypeData(propertyTypeDataPoints);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Fallback to empty data
        setRevenueData([]);
        setUserGrowthData([]);
        setPropertyTypeData([
          { name: "Apartments", value: 0, color: "hsl(var(--primary))" },
          { name: "Houses", value: 0, color: "hsl(var(--accent))" },
          { name: "Condos", value: 0, color: "hsl(var(--success))" },
          { name: "Commercial", value: 0, color: "hsl(var(--warning))" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
        <div className="bg-card rounded-lg border p-6 col-span-2 flex items-center justify-center">
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {/* Revenue Chart */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Revenue trends based on platform activity
        </p>
      </div>

      {/* User Growth Chart */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Users"
            />
            <Line
              type="monotone"
              dataKey="agents"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="Agents"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          User registration growth over time
        </p>
      </div>

      {/* Property Types Distribution */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Property Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={propertyTypeData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
            >
              {propertyTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Properties']} />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Distribution of property types on the platform
        </p>
      </div>

      {/* Transaction Volume */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="transactions" fill="hsl(var(--success))" name="Transactions" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Number of transactions per time period
        </p>
      </div>
    </div>
  );
}