import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function UserApplications() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-warning" />
              My Applications
            </h1>
            <p className="text-muted-foreground">
              Track your rental and purchase applications
            </p>
          </div>
          <Button className="bg-gradient-to-r from-warning to-accent">
            <FileText className="mr-2 h-4 w-4" />
            Application History
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="mx-auto h-8 w-8 text-warning mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-success mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Declined</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Submitted</h3>
          <p className="text-muted-foreground">
            Your rental and purchase applications will appear here with their current status
          </p>
        </div>
    </div>
  );
}