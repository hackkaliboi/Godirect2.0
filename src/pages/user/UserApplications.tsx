import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function UserApplications() {
  return (
    <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-warning flex-shrink-0" />
              <span className="break-words">My Applications</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track your rental and purchase applications
            </p>
          </div>
          <Button className="bg-gradient-to-r from-warning to-accent whitespace-nowrap">
            <FileText className="mr-2 h-4 w-4" />
            Application History
          </Button>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-warning mb-2" />
              <p className="text-xl sm:text-2xl font-bold">0</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <CheckCircle className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-success mb-2" />
              <p className="text-xl sm:text-2xl font-bold">0</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <XCircle className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-destructive mb-2" />
              <p className="text-xl sm:text-2xl font-bold">0</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Declined</p>
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