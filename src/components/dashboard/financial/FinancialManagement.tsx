
import React, { useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  Building,
  Users,
  Download
} from "lucide-react";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";

export function FinancialManagement() {
  const [activeCity, setActiveCity] = useState<string>("Lagos");
  const [activePropertyType, setActivePropertyType] = useState<string>("All");
  
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Financial Management"
        subtitle="Track revenue, commissions, expenses and payments"
        actionLabel="Export Report"
        actionIcon={<Download className="h-4 w-4" />}
        dateFilter={true}
        filters={[
          {
            label: "City",
            options: [
              { value: "Lagos", label: "Lagos" },
              { value: "Abuja", label: "Abuja" },
              { value: "Enugu", label: "Enugu" },
              { value: "Calabar", label: "Calabar" },
              { value: "All", label: "All Cities" }
            ],
            onChange: (value) => setActiveCity(value),
            value: activeCity
          },
          {
            label: "Property Type",
            options: [
              { value: "All", label: "All Types" },
              { value: "Residential", label: "Residential" },
              { value: "Commercial", label: "Commercial" },
              { value: "Land", label: "Land" },
              { value: "Industrial", label: "Industrial" },
            ],
            onChange: (value) => setActivePropertyType(value),
            value: activePropertyType
          }
        ]}
        exportButton={true}
        refreshButton={true}
      />

      {/* Financial Overview Stats */}
      <StatsCardGrid>
        <StatsCard
          title="Total Revenue"
          value="₦42.8M"
          change={12.5}
          icon={<DollarSign className="h-4 w-4" />}
          progressValue={78}
          compareText="This Month"
        />
        
        <StatsCard
          title="Commissions"
          value="₦3.86M"
          change={8.2}
          icon={<CreditCard className="h-4 w-4" />}
          progressValue={65}
          compareText="38 Agents"
        />
        
        <StatsCard
          title="Expenses"
          value="₦1.24M"
          change={-4.3}
          icon={<FileText className="h-4 w-4" />}
          progressValue={40}
          compareText="Below Budget"
        />
        
        <StatsCard
          title="Profit Margin"
          value="28.4%"
          change={2.1}
          icon={<TrendingUp className="h-4 w-4" />}
          progressValue={84}
          compareText="Industry Avg: 24.8%"
        />
      </StatsCardGrid>

      {/* Financial Management Tabs */}
      <DashboardTabs
        variant="pills"
        tabs={[
          {
            value: "revenue",
            label: "Revenue Breakdown",
            content: <RevenueBreakdown />
          },
          {
            value: "commissions",
            label: "Commission Tracker",
            content: <CommissionTracker />
          },
          {
            value: "expenses",
            label: "Expense Tracker",
            content: <ExpenseTracker />
          },
          {
            value: "payouts",
            label: "Payout Requests",
            content: <PayoutRequests />
          },
          {
            value: "invoices",
            label: "Invoicing",
            content: <InvoicingSystem />
          }
        ]}
      />
    </div>
  );
}

function RevenueBreakdown() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by City</CardTitle>
          <CardDescription>Breakdown of revenue across major cities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Lagos</span>
              <span className="text-sm">₦24.8M (58%)</span>
            </div>
            <Progress value={58} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Abuja</span>
              <span className="text-sm">₦8.5M (20%)</span>
            </div>
            <Progress value={20} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Enugu</span>
              <span className="text-sm">₦5.2M (12%)</span>
            </div>
            <Progress value={12} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Calabar</span>
              <span className="text-sm">₦4.3M (10%)</span>
            </div>
            <Progress value={10} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">View Detailed Report</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Property Type</CardTitle>
          <CardDescription>Breakdown by property category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Residential</span>
              <span className="text-sm">₦23.5M (55%)</span>
            </div>
            <Progress value={55} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Commercial</span>
              <span className="text-sm">₦11.1M (26%)</span>
            </div>
            <Progress value={26} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Land</span>
              <span className="text-sm">₦5.6M (13%)</span>
            </div>
            <Progress value={13} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Industrial</span>
              <span className="text-sm">₦2.6M (6%)</span>
            </div>
            <Progress value={6} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">View Detailed Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function CommissionTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Commissions</CardTitle>
        <CardDescription>Track agent commissions and payouts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Properties Sold</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                agent: "Sarah Johnson",
                propertiesSold: 8,
                totalValue: "₦120.5M",
                commission: "₦1,205,000",
                status: "Paid"
              },
              {
                agent: "Michael Chen",
                propertiesSold: 6,
                totalValue: "₦85.2M",
                commission: "₦852,000",
                status: "Processing"
              },
              {
                agent: "Amara Okafor",
                propertiesSold: 5,
                totalValue: "₦76.8M",
                commission: "₦768,000",
                status: "Pending"
              },
              {
                agent: "David Wilson",
                propertiesSold: 4,
                totalValue: "₦62.3M",
                commission: "₦623,000",
                status: "Paid"
              },
              {
                agent: "Chioma Eze",
                propertiesSold: 3,
                totalValue: "₦41.2M",
                commission: "₦412,000",
                status: "Pending"
              }
            ].map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{row.agent}</TableCell>
                <TableCell>{row.propertiesSold}</TableCell>
                <TableCell>{row.totalValue}</TableCell>
                <TableCell>{row.commission}</TableCell>
                <TableCell>
                  <Badge variant={
                    row.status === "Paid" ? "default" :
                    row.status === "Processing" ? "outline" : "secondary"
                  }>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </CardFooter>
    </Card>
  );
}

function ExpenseTracker() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Expense Overview</CardTitle>
          <CardDescription>Monthly expense breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>This Month</TableHead>
                <TableHead>Previous Month</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  category: "Marketing & Advertising",
                  thisMonth: "₦450,000",
                  previousMonth: "₦425,000",
                  change: 5.9
                },
                {
                  category: "Staff Salaries",
                  thisMonth: "₦320,000",
                  previousMonth: "₦320,000",
                  change: 0
                },
                {
                  category: "Office Rent",
                  thisMonth: "₦180,000",
                  previousMonth: "₦180,000",
                  change: 0
                },
                {
                  category: "Software & Tools",
                  thisMonth: "₦120,000",
                  previousMonth: "₦95,000",
                  change: 26.3
                },
                {
                  category: "Utilities",
                  thisMonth: "₦85,000",
                  previousMonth: "₦78,000",
                  change: 9.0
                },
                {
                  category: "Miscellaneous",
                  thisMonth: "₦85,000",
                  previousMonth: "₦102,000",
                  change: -16.7
                }
              ].map((expense, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{expense.category}</TableCell>
                  <TableCell>{expense.thisMonth}</TableCell>
                  <TableCell>{expense.previousMonth}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {expense.change > 0 ? (
                        <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                      ) : expense.change < 0 ? (
                        <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <span className="mr-1">—</span>
                      )}
                      <span className={
                        expense.change > 0 ? "text-red-500" :
                        expense.change < 0 ? "text-green-500" : ""
                      }>
                        {expense.change === 0 ? "0%" : `${Math.abs(expense.change)}%`}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Add New Expense</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
          <CardDescription>Monthly budget utilization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold">₦1.24M / ₦1.5M</div>
            <div className="text-sm text-muted-foreground">Used of total budget</div>
            <div className="mt-4">
              <Progress value={82.7} className="h-2" />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">82.7% utilized</div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Marketing</span>
                <span className="text-muted-foreground">90% of ₦500K</span>
              </div>
              <Progress value={90} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Operations</span>
                <span className="text-muted-foreground">75% of ₦650K</span>
              </div>
              <Progress value={75} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Development</span>
                <span className="text-muted-foreground">60% of ₦350K</span>
              </div>
              <Progress value={60} className="h-1.5" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">Adjust Budget</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function PayoutRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Requests</CardTitle>
        <CardDescription>Manage agent and partner payout requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requested By</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Sarah Johnson",
                type: "Agent Commission",
                amount: "₦850,000",
                date: "Apr 3, 2025",
                status: "Pending"
              },
              {
                name: "TechReal Partners",
                type: "Partner Fee",
                amount: "₦425,000",
                date: "Apr 2, 2025",
                status: "Processing"
              },
              {
                name: "Michael Chen",
                type: "Agent Commission",
                amount: "₦620,000",
                date: "Apr 1, 2025",
                status: "Approved"
              },
              {
                name: "GlobalHomeX",
                type: "Partner Fee",
                amount: "₦380,000",
                date: "Mar 29, 2025",
                status: "Completed"
              },
              {
                name: "Amara Okafor",
                type: "Agent Commission",
                amount: "₦540,000",
                date: "Mar 28, 2025",
                status: "Completed"
              }
            ].map((request, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.amount}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Badge variant={
                    request.status === "Completed" ? "default" :
                    request.status === "Approved" ? "outline" :
                    request.status === "Processing" ? "secondary" : "destructive"
                  }>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {request.status === "Pending" && (
                      <Button size="sm">Approve</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 5 of 12 requests
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function InvoicingSystem() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Track and manage your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "INV-2025-042",
                  client: "Lagos Executive Homes",
                  amount: "₦2,450,000",
                  date: "Apr 4, 2025",
                  status: "Paid",
                },
                {
                  id: "INV-2025-041",
                  client: "Emerald Heights",
                  amount: "₦1,850,000",
                  date: "Apr 3, 2025",
                  status: "Pending",
                },
                {
                  id: "INV-2025-040",
                  client: "Ocean View Properties",
                  amount: "₦3,200,000",
                  date: "Apr 2, 2025",
                  status: "Overdue",
                },
                {
                  id: "INV-2025-039",
                  client: "City Central Realty",
                  amount: "₦1,650,000",
                  date: "Apr 1, 2025",
                  status: "Paid",
                },
                {
                  id: "INV-2025-038",
                  client: "Golden Gate Estates",
                  amount: "₦2,120,000",
                  date: "Mar 31, 2025",
                  status: "Paid",
                }
              ].map((invoice, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === "Paid" ? "default" :
                      invoice.status === "Pending" ? "secondary" : "destructive"
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">
                        <FileSpreadsheet className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 5 of 42 invoices
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
          <CardDescription>Generate a new invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">New invoices this month</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Total value</div>
              <div className="text-2xl font-bold">₦42.6M</div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <Button className="w-full">Create New Invoice</Button>
              <Button variant="outline" className="w-full">Generate Bulk Invoices</Button>
              <Button variant="outline" className="w-full">Invoice Templates</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="w-full p-4 bg-muted/40 rounded-md">
            <h4 className="font-medium mb-2">Quick Status</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Pending</div>
                <div>₦8.2M</div>
              </div>
              <div>
                <div className="text-muted-foreground">Overdue</div>
                <div className="text-red-500">₦3.8M</div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
