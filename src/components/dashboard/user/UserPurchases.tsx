
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPriceWithCommas } from "@/utils/data";

// Mock purchase data (buying properties)
const mockPurchases = [
  {
    id: "PUR-1001",
    propertyId: "1",
    propertyTitle: "Modern Luxury Villa with Ocean View",
    amount: 1250000,
    serviceFee: 62500, // 5% service fee
    status: "completed",
    date: "2023-12-15T10:30:00Z",
  },
  {
    id: "PUR-1002",
    propertyId: "3",
    propertyTitle: "Spacious Family Home in Quiet Neighborhood",
    amount: 685000,
    serviceFee: 34250, // 5% service fee
    status: "pending",
    date: "2024-01-22T14:45:00Z",
  },
  {
    id: "PUR-1003",
    propertyId: "5",
    propertyTitle: "Historic Brownstone with Modern Updates",
    amount: 1495000,
    serviceFee: 74750, // 5% service fee
    status: "pending",
    date: "2024-02-10T09:15:00Z",
  },
];

// Mock sales data (selling properties)
const mockSales = [
  {
    id: "SALE-2001",
    propertyId: "8",
    propertyTitle: "Downtown Apartment with River View",
    amount: 875000,
    commission: 43750, // 5% commission
    netAmount: 831250, // After commission
    status: "completed",
    paymentStatus: "paid",
    date: "2023-11-05T11:20:00Z",
  },
  {
    id: "SALE-2002",
    propertyId: "12",
    propertyTitle: "Renovated Cottage with Garden",
    amount: 495000,
    commission: 24750, // 5% commission
    netAmount: 470250, // After commission
    status: "completed", 
    paymentStatus: "processing",
    date: "2024-01-18T15:30:00Z",
  },
  {
    id: "SALE-2003",
    propertyId: "15",
    propertyTitle: "Modern Townhouse in Gated Community",
    amount: 725000,
    commission: 36250, // 5% commission
    netAmount: 688750, // After commission
    status: "pending",
    paymentStatus: "awaiting_completion",
    date: "2024-02-25T13:10:00Z",
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  awaiting_completion: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const UserPurchases = () => {
  const [purchases] = useState(mockPurchases);
  const [sales] = useState(mockSales);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Transactions</CardTitle>
        <CardDescription>
          View and manage your property purchases, sales, and payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="purchases">
          <TabsList className="mb-4">
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            <TabsTrigger value="sales">My Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchases">
            {purchases.length === 0 ? (
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any property purchases yet.
                </p>
                <Button asChild>
                  <a href="/properties">Browse Properties</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>
                          <a 
                            href={`/properties/${purchase.propertyId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {purchase.propertyTitle}
                          </a>
                        </TableCell>
                        <TableCell>{formatPriceWithCommas(purchase.amount)}</TableCell>
                        <TableCell>
                          {new Date(purchase.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[purchase.status as keyof typeof statusColors]}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sales">
            {sales.length === 0 ? (
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">No sales yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't sold any properties yet.
                </p>
                <Button asChild>
                  <a href="/user-dashboard/properties/new">List a Property</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Gross Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>
                          <a 
                            href={`/properties/${sale.propertyId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {sale.propertyTitle}
                          </a>
                        </TableCell>
                        <TableCell>{formatPriceWithCommas(sale.amount)}</TableCell>
                        <TableCell className="text-red-600">
                          -{formatPriceWithCommas(sale.commission)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPriceWithCommas(sale.netAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[sale.status as keyof typeof statusColors]}>
                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" 
                            className={paymentStatusColors[sale.paymentStatus as keyof typeof paymentStatusColors]}>
                            {sale.paymentStatus === "paid" ? "Paid" : 
                             sale.paymentStatus === "processing" ? "Processing" : "Awaiting Completion"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPurchases;
