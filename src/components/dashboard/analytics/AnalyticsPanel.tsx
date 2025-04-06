import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { StatsCardGrid, StatsCard, AnalyticsCard } from '../StatsCard';
import { DashboardHeader } from '../DashboardHeader';
import { Building2, DollarSign, Users, TrendingUp, Calendar, Activity, ShoppingBag, Map, Search, MousePointerClick, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardTabs } from "../DashboardTabs";

// Sample data for charts
const propertyPerformanceData = [
  { name: 'Jan', Listings: 65, Views: 180, Inquiries: 42 },
  { name: 'Feb', Listings: 59, Views: 210, Inquiries: 51 },
  { name: 'Mar', Listings: 80, Views: 290, Inquiries: 68 },
  { name: 'Apr', Listings: 81, Views: 320, Inquiries: 85 },
  { name: 'May', Listings: 56, Views: 250, Inquiries: 63 },
  { name: 'Jun', Listings: 55, Views: 195, Inquiries: 47 },
  { name: 'Jul', Listings: 72, Views: 270, Inquiries: 58 },
];

const propertyTypeData = [
  { name: 'Residential', value: 68 },
  { name: 'Commercial', value: 26 },
  { name: 'Land/Plots', value: 13 },
  { name: 'Industrial', value: 8 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const marketTrendsData = [
  { month: 'Jan', "Average Price": 420000, "Last Year": 380000 },
  { month: 'Feb', "Average Price": 450000, "Last Year": 400000 },
  { month: 'Mar', "Average Price": 470000, "Last Year": 410000 },
  { month: 'Apr', "Average Price": 490000, "Last Year": 420000 },
  { month: 'May', "Average Price": 510000, "Last Year": 430000 },
  { month: 'Jun', "Average Price": 525000, "Last Year": 440000 },
];

const conversionData = [
  { name: 'View Listing', value: 100 },
  { name: 'Contact Agent', value: 42 },
  { name: 'Schedule Visit', value: 28 },
  { name: 'Make Offer', value: 16 },
  { name: 'Closed Deal', value: 8 },
];

// Agent performance data
const agentPerformanceData = [
  { name: 'Sarah Johnson', sales: 12, commission: 58000, rating: 4.9 },
  { name: 'David Martinez', sales: 9, commission: 42000, rating: 4.7 },
  { name: 'Jennifer Williams', sales: 17, commission: 72000, rating: 4.8 },
  { name: 'Robert Brown', sales: 7, commission: 31000, rating: 4.5 },
  { name: 'Amanda Davis', sales: 14, commission: 61000, rating: 4.6 },
];

// Heatmap data (simplified representation)
const heatmapData = [
  { area: "Downtown", hotness: 95, price: "$520k", change: 8.2 },
  { area: "North End", hotness: 88, price: "$410k", change: 5.4 },
  { name: "West Side", hotness: 76, price: "$310k", change: 3.8 },
  { area: "South Beach", hotness: 92, price: "$485k", change: 7.9 },
  { area: "East Village", hotness: 81, price: "$370k", change: 4.2 },
];

export default function AnalyticsPanel() {
  const [timeRange, setTimeRange] = React.useState('90days');

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Analytics Dashboard"
        subtitle="Comprehensive view of property performance and market trends"
        dateFilter={true}
        exportButton={true}
        refreshButton={true}
        filters={[
          {
            label: "Time Range",
            options: [
              { value: '30days', label: 'Last 30 Days' },
              { value: '90days', label: 'Last 90 Days' },
              { value: 'ytd', label: 'Year to Date' },
              { value: '1year', label: 'Last Year' },
            ],
            onChange: (value) => setTimeRange(value),
            value: timeRange
          }
        ]}
      />
      
      <StatsCardGrid columns={4}>
        <StatsCard 
          title="Total Listings" 
          value="124" 
          change={10.7} 
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatsCard 
          title="Total Revenue" 
          value="$37.95M" 
          change={18.2}
          icon={<DollarSign className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Total Users" 
          value="1,690" 
          change={24.3}
          icon={<Users className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Conversion Rate" 
          value="3.2%" 
          change={-0.5}
          icon={<TrendingUp className="h-4 w-4" />} 
        />
      </StatsCardGrid>
      
      <DashboardTabs 
        variant="pills"
        tabs={[
          {
            value: "performance",
            label: "Performance Metrics",
            icon: <Activity className="h-4 w-4" />,
            content: <PerformanceMetrics />
          },
          {
            value: "market-trends",
            label: "Market Trends",
            icon: <TrendingUp className="h-4 w-4" />,
            content: <MarketTrends />
          },
          {
            value: "heatmap",
            label: "Area Heatmap",
            icon: <Map className="h-4 w-4" />,
            content: <AreaHeatmap />
          },
          {
            value: "agent-performance",
            label: "Agent Performance",
            icon: <Users className="h-4 w-4" />,
            content: <AgentPerformance />
          },
          {
            value: "conversion-funnel",
            label: "Conversion Funnel",
            icon: <MousePointerClick className="h-4 w-4" />,
            content: <ConversionFunnel />
          },
        ]}
      />
    </div>
  );
}

function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Performance Overview</CardTitle>
          <CardDescription>New listings, views and inquiries over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={propertyPerformanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Listings" fill="#8884d8" />
                <Bar dataKey="Views" fill="#82ca9d" />
                <Bar dataKey="Inquiries" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Types Distribution</CardTitle>
            <CardDescription>Breakdown by property category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Keywords</CardTitle>
            <CardDescription>Most popular search terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Modern Apartment</span>
                  <span className="text-sm text-muted-foreground">24%</span>
                </div>
                <Progress value={24} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Waterfront</span>
                  <span className="text-sm text-muted-foreground">21%</span>
                </div>
                <Progress value={21} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3 Bedroom</span>
                  <span className="text-sm text-muted-foreground">18%</span>
                </div>
                <Progress value={18} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Downtown</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <Progress value={15} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Garden</span>
                  <span className="text-sm text-muted-foreground">12%</span>
                </div>
                <Progress value={12} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MarketTrends() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Average Property Prices</CardTitle>
          <CardDescription>Current year vs. previous year comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketTrendsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Price']} />
                <Legend />
                <Line type="monotone" dataKey="Average Price" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Last Year" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price per Sqft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$425</div>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <ArrowUp className="mr-1 h-4 w-4" />
              5.2%
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs. previous quarter</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Days on Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">38</div>
            <div className="flex items-center text-green-500 text-sm font-medium">
              <ArrowDown className="mr-1 h-4 w-4" />
              12%
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs. previous quarter</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+24</div>
            <div className="flex items-center text-red-500 text-sm font-medium">
              <ArrowDown className="mr-1 h-4 w-4" />
              8.1%
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs. previous quarter</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AreaHeatmap() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Area Performance Heatmap</CardTitle>
          <CardDescription>Property hotspots with the highest activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium p-4">Area</th>
                  <th className="text-left font-medium p-4">Heat Level</th>
                  <th className="text-left font-medium p-4">Avg. Price</th>
                  <th className="text-left font-medium p-4">YoY Change</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((area, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-4">{area.area}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-full h-2 rounded-full bg-gradient-to-r ${
                          area.hotness > 90 ? 'from-red-600 to-red-400' : 
                          area.hotness > 80 ? 'from-orange-600 to-orange-400' : 
                          'from-yellow-600 to-yellow-400'
                        }`}></div>
                        <span>{area.hotness}%</span>
                      </div>
                    </td>
                    <td className="p-4">{area.price}</td>
                    <td className="p-4 text-green-500">+{area.change}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Interactive map visualization available in the full version</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Downtown" 
          value="$520k" 
          subtitle="Highly active area" 
          bgColor="bg-gradient-to-br from-red-50 to-red-100" 
          textColor="text-red-800"
        />
        <StatsCard 
          title="North End" 
          value="$410k" 
          subtitle="Growing market" 
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
          textColor="text-orange-800"
        />
        <StatsCard 
          title="West Side" 
          value="$310k" 
          subtitle="Stable market" 
          bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
          textColor="text-yellow-800"
        />
        <StatsCard 
          title="South Beach" 
          value="$485k" 
          subtitle="Hot market" 
          bgColor="bg-gradient-to-br from-red-50 to-red-100"
          textColor="text-red-800"
        />
      </div>
    </div>
  );
}

function AgentPerformance() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Sales" 
          value="59" 
          icon={<ShoppingBag className="h-4 w-4" />}
          change={14.6}
        />
        <StatsCard 
          title="Total Commission" 
          value="$264,000" 
          icon={<DollarSign className="h-4 w-4" />}
          change={18.3}
        />
        <StatsCard 
          title="Avg. Rating" 
          value="4.7" 
          icon={<Activity className="h-4 w-4" />}
          change={0.2}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Ranking</CardTitle>
          <CardDescription>Top performing agents by sales volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium p-4">Agent</th>
                  <th className="text-left font-medium p-4">Sales</th>
                  <th className="text-left font-medium p-4">Commission</th>
                  <th className="text-left font-medium p-4">Rating</th>
                  <th className="text-left font-medium p-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformanceData.map((agent, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-4 font-medium">{agent.name}</td>
                    <td className="p-4">{agent.sales}</td>
                    <td className="p-4">${agent.commission.toLocaleString()}</td>
                    <td className="p-4">{agent.rating}/5.0</td>
                    <td className="p-4">
                      <Progress 
                        value={
                          (agent.sales / Math.max(...agentPerformanceData.map(a => a.sales))) * 100
                        } 
                        className="h-2" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">View All Agents</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConversionFunnel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>From listing view to closed deal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={conversionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {conversionData.map((step, idx) => (
          <Card key={idx} className={`bg-gradient-to-br ${
            idx === 0 ? 'from-blue-50 to-blue-100' :
            idx === conversionData.length - 1 ? 'from-green-50 to-green-100' : 
            'from-indigo-50 to-indigo-100'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{step.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${
                idx === 0 ? 'text-blue-700' :
                idx === conversionData.length - 1 ? 'text-green-700' : 
                'text-indigo-700'
              }`}>
                {step.value}%
              </div>
              {idx < conversionData.length - 1 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {((conversionData[idx+1].value / step.value) * 100).toFixed(1)}% conversion
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
