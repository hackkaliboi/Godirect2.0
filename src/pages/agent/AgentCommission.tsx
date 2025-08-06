import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calendar, Building2 } from "lucide-react";

export default function AgentCommission() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-accent" />
              Commission Tracking
            </h1>
            <p className="text-muted-foreground">
              Monitor your earnings and sales performance
            </p>
          </div>
          <Button className="bg-gradient-to-r from-accent to-warning">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="mx-auto h-8 w-8 text-accent mb-2" />
              <p className="text-2xl font-bold">$0</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold">$0</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="mx-auto h-8 w-8 text-success mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Properties Sold</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-warning mb-2" />
              <p className="text-2xl font-bold">0%</p>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-8">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Sales History</h3>
          <p className="text-muted-foreground">
            Your commission history and earnings will appear here after your first sale
          </p>
        </div>
      </div>
  );
}