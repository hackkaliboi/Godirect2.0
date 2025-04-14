import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  BadgePercent,
  RefreshCw
} from "lucide-react";
import { formatTrendIcon } from "@/components/dashboard/DashboardIcons";

interface Sale {
  id: string;
  property_id: string;
  buyer_id: string;
  seller_id: string;
  agent_id: string;
  sale_price: number;
  commission_amount: number;
  sale_date: string;
  status: string;
}

interface RevenueMetric {
  id: string;
  metric_type: string;
  revenue: number;
  sales_count: number;
  change_percentage: number;
  metric_date: string;
}

interface RegionRevenue {
  region: string;
  amount: number;
  percentage: number;
}

const AdminSales = () => {
  const [periodFilter, setPeriodFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const { data: salesData, isLoading: salesLoading, refetch: refetchSales } = useQuery({
    queryKey: ["sales-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("sale_date", { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  const { data: revenueMetrics, isLoading: revenueLoading, refetch: refetchRevenue } = useQuery({
    queryKey: ["revenue-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_metrics")
        .select("*")
        .order("metric_date", { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  const totalRevenue = salesData?.reduce((sum, sale) => sum + (sale.sale_price || 0), 0) || 0;
  const formattedTotalRevenue = `$${(totalRevenue / 1000000).toFixed(2)}M`;
  
  const propertiesSold = salesData?.length || 0;
  
  const avgSalePrice = propertiesSold > 0 ? totalRevenue / propertiesSold : 0;
  const formattedAvgSalePrice = `$${Math.round(avgSalePrice / 1000)}K`;
  
  const revenueChange = revenueMetrics?.[0]?.change_percentage || 0;
  
  const salesGrowth = 7.3;
  
  const priceTrend = -2.1;

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchSales(),
        refetchRevenue()
      ]);
      
      toast({
        title: "Data refreshed",
        description: "Sales and revenue data has been updated",
      });
    } catch (error) {
      console.error("Error refreshing sales data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh sales data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const revenueByPropertyType = [
    { type: "Residential", amount: totalRevenue * 0.559, percentage: 55.9 },
    { type: "Commercial", amount: totalRevenue * 0.337, percentage: 33.7 },
    { type: "Land/Plots", amount: totalRevenue * 0.084, percentage: 8.4 },
    { type: "Industrial", amount: totalRevenue * 0.020, percentage: 2.0 },
  ];

  const revenueByRegion: RegionRevenue[] = [
    { region: "Enugu", amount: totalRevenue * 0.432, percentage: 43.2 },
    { region: "Calabar", amount: totalRevenue * 0.329, percentage: 32.9 },
    { region: "Lagos", amount: totalRevenue * 0.153, percentage: 15.3 },
    { region: "Abuja", amount: totalRevenue * 0.086, percentage: 8.6 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales & Revenue</h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of all sales and revenue metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="enugu">Enugu</SelectItem>
              <SelectItem value="calabar">Calabar</SelectItem>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="abuja">Abuja</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefreshData} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </Button>
          
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {salesLoading ? (
          <>
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{formattedTotalRevenue}</div>
                  <div className={`flex items-center text-sm font-medium ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {revenueChange >= 0 ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                    {Math.abs(revenueChange).toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs. previous period</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Properties Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{propertiesSold}</div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    {salesGrowth}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs. previous period</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Avg. Sale Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{formattedAvgSalePrice}</div>
                  <div className="flex items-center text-red-500 text-sm font-medium">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    {Math.abs(priceTrend)}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs. previous period</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Analysis of revenue sources and trends</CardDescription>
            </CardHeader>
            <CardContent>
              {salesLoading || revenueLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md mb-6">
                    <BarChart3 className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">Revenue chart visualization</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Revenue by Property Type</h4>
                      <div className="space-y-2">
                        {revenueByPropertyType.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm">
                              <span>{item.type}</span>
                              <span>${(item.amount / 1000000).toFixed(1)}M ({item.percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Revenue by Region</h4>
                      <div className="space-y-2">
                        {revenueByRegion.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm">
                              <span>{item.region}</span>
                              <span>${(item.amount / 1000000).toFixed(1)}M ({item.percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Highest Sale</div>
                      <div className="text-lg font-bold mt-1">$2.8M</div>
                      <div className="text-xs text-muted-foreground">Commercial property in Lagos</div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Lowest Sale</div>
                      <div className="text-lg font-bold mt-1">$68K</div>
                      <div className="text-xs text-muted-foreground">Land plot in Enugu</div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Commission</div>
                      <div className="text-lg font-bold mt-1">$3.16M</div>
                      <div className="text-xs text-muted-foreground">8.3% of total revenue</div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Top Agent</div>
                      <div className="text-lg font-bold mt-1">$1.2M</div>
                      <div className="text-xs text-muted-foreground">Sarah Johnson</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Daily Revenue Report</CardTitle>
              <CardDescription>Tracking sales performance on a daily basis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md mb-6">
                <BarChart3 className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Daily revenue chart</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Today's Revenue</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold">$140,000</div>
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">+15% from yesterday</span>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">24 properties sold today</div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Morning (6AM-12PM)</span>
                      <span>$42,000 (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Afternoon (12PM-5PM)</span>
                      <span>$70,000 (50%)</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Evening (5PM-11PM)</span>
                      <span>$28,000 (20%)</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Daily Sales Breakdown</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg. Transaction</div>
                      <div className="text-lg font-bold mt-1">$5,833</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Listings Viewed</div>
                      <div className="text-lg font-bold mt-1">864</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                      <div className="text-lg font-bold mt-1">2.8%</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Agent Commission</div>
                      <div className="text-lg font-bold mt-1">$14,000</div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium mt-4">Top 3 Properties Sold Today</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">42 Oakwood Avenue</div>
                        <div className="text-xs text-muted-foreground">Residential</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$420,000</div>
                        <div className="text-xs text-muted-foreground">John Davis (Agent)</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">125 Market Street</div>
                        <div className="text-xs text-muted-foreground">Commercial</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$380,000</div>
                        <div className="text-xs text-muted-foreground">Sarah Johnson (Agent)</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">78 River Road</div>
                        <div className="text-xs text-muted-foreground">Residential</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$325,000</div>
                        <div className="text-xs text-muted-foreground">Mark Williams (Agent)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Daily Transaction Log</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Monthly Revenue Report</CardTitle>
              <CardDescription>Tracking sales performance by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md mb-6">
                <BarChart3 className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Monthly revenue chart</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">This Month's Revenue</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold">$2.8M</div>
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">+12.5% from last month</span>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">48 properties sold this month</div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Week 1</span>
                      <span>$560,000 (20%)</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Week 2</span>
                      <span>$840,000 (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Week 3</span>
                      <span>$700,000 (25%)</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Week 4</span>
                      <span>$700,000 (25%)</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Monthly Metrics</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg. Property Value</div>
                      <div className="text-lg font-bold mt-1">$385K</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Days on Market</div>
                      <div className="text-lg font-bold mt-1">32 days</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Commission</div>
                      <div className="text-lg font-bold mt-1">$280K</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">New Listings</div>
                      <div className="text-lg font-bold mt-1">37</div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium mt-4">Monthly Growth</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Revenue Growth</span>
                        <span className="text-green-500">+12.5%</span>
                      </div>
                      <Progress value={12.5} className="h-2 bg-muted" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Property Sales Growth</span>
                        <span className="text-green-500">+8.3%</span>
                      </div>
                      <Progress value={8.3} className="h-2 bg-muted" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Customer Growth</span>
                        <span className="text-green-500">+15.2%</span>
                      </div>
                      <Progress value={15.2} className="h-2 bg-muted" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Profit Margin</span>
                        <span className="text-red-500">-2.1%</span>
                      </div>
                      <Progress value={2.1} className="h-2 bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Generate Monthly Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Yearly Revenue Report</CardTitle>
              <CardDescription>Annual performance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md mb-6">
                <BarChart3 className="h-10 w-10 text-muted" />
                <span className="ml-2 text-muted-foreground">Yearly revenue chart</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Annual Revenue</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold">$37.95M</div>
                    <div className="flex items-center mt-1">
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">-6.1% from last year</span>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">482 properties sold this year</div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Q1 (Jan-Mar)</span>
                      <span>$8.5M (22.4%)</span>
                    </div>
                    <Progress value={22.4} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Q2 (Apr-Jun)</span>
                      <span>$10.2M (26.9%)</span>
                    </div>
                    <Progress value={26.9} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Q3 (Jul-Sep)</span>
                      <span>$11.5M (30.3%)</span>
                    </div>
                    <Progress value={30.3} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Q4 (Oct-Dec)</span>
                      <span>$7.75M (20.4%)</span>
                    </div>
                    <Progress value={20.4} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Annual Metrics</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">YTD Target</div>
                      <div className="text-lg font-bold mt-1">$40M</div>
                      <div className="text-xs text-muted-foreground">94.9% achieved</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Market Share</div>
                      <div className="text-lg font-bold mt-1">23.8%</div>
                      <div className="text-xs text-green-500">+1.2% YoY</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Profit</div>
                      <div className="text-lg font-bold mt-1">$10.8M</div>
                      <div className="text-xs text-muted-foreground">28.4% margin</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                      <div className="text-lg font-bold mt-1">-6.1%</div>
                      <div className="text-xs text-red-500">Below target of +5%</div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium mt-4">Annual Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Top-Performing Month</div>
                        <div className="text-xs text-muted-foreground">August</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$4.2M</div>
                        <div className="text-xs text-muted-foreground">58 properties sold</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Most Active Region</div>
                        <div className="text-xs text-muted-foreground">Enugu</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$16.4M</div>
                        <div className="text-xs text-muted-foreground">43.2% of revenue</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Highest-Growth Segment</div>
                        <div className="text-xs text-muted-foreground">Commercial Properties</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">+18.7%</div>
                        <div className="text-xs text-muted-foreground">Year-over-year</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Annual Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSales;
