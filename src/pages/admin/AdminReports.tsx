import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AdminReports() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-success" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Generate and view comprehensive platform reports
          </p>
        </div>

        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Report Data Available</h3>
          <p className="text-muted-foreground">
            Reports will be generated when platform activity begins
          </p>
        </div>
      </div>
    </div>
  );
}