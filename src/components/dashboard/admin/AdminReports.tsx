import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, FileSpreadsheet, Download, Calendar, Filter, RefreshCw, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReports() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30days");
  const [activeTab, setActiveTab] = useState("sales");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data states
  const [salesData, setSalesData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch sales data
      const { data: sales, error: salesError } = await supabase
        .from('payments')
        .select('amount, status, created_at, properties(title, property_type)')
        .order('created_at', { ascending: false });
      
      if (salesError) throw salesError;
      
      // Fetch agent data
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name, properties(id)');
      
      if (agentsError) throw agentsError;
      
      // Fetch property data
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title, status, price, property_type, created_at')
        .order('created_at', { ascending: false });
      
      if (propertiesError) throw propertiesError;
      
      // Process sales data for charts
      const processedSalesData = processSalesData(sales);
      setSalesData(processedSalesData);
      
      // Process agent data for charts
      const processedAgentData = processAgentData(agents);
      setAgentData(processedAgentData);
      
      // Process property data for charts
      const processedPropertyData = processPropertyData(properties);
      setPropertyData(processedPropertyData);
      
      // Get top properties
      const sortedProperties = [...properties].sort((a, b) => b.price - a.price).slice(0, 5);
      setTopProperties(sortedProperties);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Failed to load analytics data",
        description: "There was an error loading the analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const refreshData = () => {
    setIsRefreshing(true);
    fetchData();
  };
  
  // Process data for charts
  const processSalesData = (data) => {
    // For demo purposes, generate some sample data if real data is insufficient
    if (!data || data.length < 5) {
      return [
        { name: 'Jan', sales: 4000, revenue: 2400 },
        { name: 'Feb', sales: 3000, revenue: 1398 },
        { name: 'Mar', sales: 2000, revenue: 9800 },
        { name: 'Apr', sales: 2780, revenue: 3908 },
        { name: 'May', sales: 1890, revenue: 4800 },
        { name: 'Jun', sales: 2390, revenue: 3800 },
      ];
    }
    
    // Process actual data
    // This would be more sophisticated in a real application
    return data.map((item, index) => ({
      name: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short' }),
      sales: 1,
      revenue: item.amount || Math.floor(Math.random() * 10000),
    }));
  };
  
  const processAgentData = (data) => {
    // For demo purposes, generate some sample data if real data is insufficient
    if (!data || data.length < 3) {
      return [
        { name: 'John Doe', value: 400, listings: 12 },
        { name: 'Jane Smith', value: 300, listings: 8 },
        { name: 'Robert Johnson', value: 300, listings: 7 },
        { name: 'Emily Brown', value: 200, listings: 5 },
      ];
    }
    
    // Process actual data
    return data.map(agent => ({
      name: agent.name,
      value: agent.properties ? agent.properties.length : 0,
      listings: agent.properties ? agent.properties.length : 0,
    }));
  };
  
  const processPropertyData = (data) => {
    // For demo purposes, generate some sample data if real data is insufficient
    if (!data || data.length < 5) {
      return [
        { name: 'Week 1', listings: 4, sales: 2 },
        { name: 'Week 2', listings: 3, sales: 1 },
        { name: 'Week 3', listings: 5, sales: 3 },
        { name: 'Week 4', listings: 7, sales: 4 },
        { name: 'Week 5', listings: 6, sales: 2 },
      ];
    }
    
    // Group properties by week
    const weeks = {};
    data.forEach(property => {
      const date = new Date(property.created_at);
      const weekNumber = Math.ceil((date.getDate()) / 7);
      const weekName = `Week ${weekNumber}`;
      
      if (!weeks[weekName]) {
        weeks[weekName] = { listings: 0, sales: 0 };
      }
      
      weeks[weekName].listings += 1;
      if (property.status === 'Sold') {
        weeks[weekName].sales += 1;
      }
    });
    
    return Object.keys(weeks).map(week => ({
      name: week,
      listings: weeks[week].listings,
      sales: weeks[week].sales,
    }));
  };
  
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Reports & Analytics"
        subtitle="Comprehensive reporting and analytics for your real estate business"
        actionLabel="Refresh Data"
        actionIcon={<RefreshCw className="h-4 w-4" />}
        onAction={refreshData}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{timeRange === '30days' ? 'Last 30 Days' : 'All Time'}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div>
                <div className="text-2xl font-bold">₦{salesData.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {salesData.length} transactions
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{agentData.length} Agents</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{agentData.reduce((sum, item) => sum + (item.listings || 0), 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total property listings by agents
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Property Trends</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{propertyData.length} Weeks</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{propertyData.reduce((sum, item) => sum + (item.listings || 0), 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total properties listed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Analytics Dashboard</CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{timeRange === '7days' ? 'Last 7 days' : 
                         timeRange === '30days' ? 'Last 30 days' : 
                         timeRange === '90days' ? 'Last 90 days' : 'This year'}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="mt-0">
              {isLoading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Number of Sales" />
                      <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₦)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="agents" className="mt-0">
              {isLoading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={agentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {agentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} listings`, props.payload.name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="properties" className="mt-0">
              {isLoading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={propertyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="listings" stroke="#8884d8" name="New Listings" />
                      <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
            
      <Card>
        <CardHeader>
          <CardTitle>Top Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : topProperties.length > 0 ? (
            <div className="space-y-4">
              {topProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-muted-foreground">{property.property_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₦{property.price.toLocaleString()}</p>
                    <Badge variant={property.status === "For Sale" ? "default" : 
                                  property.status === "For Rent" ? "secondary" : "outline"}>
                      {property.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No properties found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
