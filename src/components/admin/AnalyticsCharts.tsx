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

// Empty data for charts (will be populated when connected to real data)
const revenueData = [
  { month: "Jan", revenue: 0, transactions: 0 },
  { month: "Feb", revenue: 0, transactions: 0 },
  { month: "Mar", revenue: 0, transactions: 0 },
  { month: "Apr", revenue: 0, transactions: 0 },
  { month: "May", revenue: 0, transactions: 0 },
  { month: "Jun", revenue: 0, transactions: 0 },
];

const userGrowthData = [
  { month: "Jan", users: 0, agents: 0 },
  { month: "Feb", users: 0, agents: 0 },
  { month: "Mar", users: 0, agents: 0 },
  { month: "Apr", users: 0, agents: 0 },
  { month: "May", users: 0, agents: 0 },
  { month: "Jun", users: 0, agents: 0 },
];

const propertyTypeData = [
  { name: "Apartments", value: 0, color: "hsl(var(--primary))" },
  { name: "Houses", value: 0, color: "hsl(var(--accent))" },
  { name: "Condos", value: 0, color: "hsl(var(--success))" },
  { name: "Commercial", value: 0, color: "hsl(var(--warning))" },
];

interface AnalyticsChartsProps {
  className?: string;
}

export function AnalyticsCharts({ className }: AnalyticsChartsProps) {
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
            <Tooltip />
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
          Revenue data will appear when transactions are processed
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
          User growth will show when registration begins
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
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Distribution will update as properties are added
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
            <Bar dataKey="transactions" fill="hsl(var(--success))" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Transaction volume will display when sales occur
        </p>
      </div>
    </div>
  );
}