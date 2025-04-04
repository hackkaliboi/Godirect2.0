
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
import { formatPriceWithCommas } from "@/utils/data";

// Mock purchase data
const mockPurchases = [
  {
    id: "PUR-1001",
    propertyId: "1",
    propertyTitle: "Modern Luxury Villa with Ocean View",
    amount: 1250000,
    status: "completed",
    date: "2023-12-15T10:30:00Z",
  },
  {
    id: "PUR-1002",
    propertyId: "3",
    propertyTitle: "Spacious Family Home in Quiet Neighborhood",
    amount: 685000,
    status: "pending",
    date: "2024-01-22T14:45:00Z",
  },
  {
    id: "PUR-1003",
    propertyId: "5",
    propertyTitle: "Historic Brownstone with Modern Updates",
    amount: 1495000,
    status: "pending",
    date: "2024-02-10T09:15:00Z",
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const UserPurchases = () => {
  const [purchases] = useState(mockPurchases);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Purchases</CardTitle>
        <CardDescription>
          View and manage your property purchases and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default UserPurchases;
