import { PropertyManagement } from "@/components/admin/PropertyManagement";
import { TestComponent } from "@/components/admin/TestComponent";

export default function AdminProperties() {
  console.log("AdminProperties page rendering");
  
  // Add a simple test to see if the page is rendering
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Property Management</h1>
        <p className="text-muted-foreground">
          Manage all property listings, approve new submissions, and oversee platform inventory.
        </p>
      </div>
      <div>
        <p>Debug: This text should always be visible</p>
        <TestComponent />
        <PropertyManagement />
      </div>
    </div>
  );
}