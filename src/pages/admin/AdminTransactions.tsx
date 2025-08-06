import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function AdminTransactions() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-accent" />
            Transaction Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all platform transactions
          </p>
        </div>

        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
          <p className="text-muted-foreground">
            Transaction history and management will appear here when sales begin
          </p>
        </div>
      </div>
    </div>
  );
}