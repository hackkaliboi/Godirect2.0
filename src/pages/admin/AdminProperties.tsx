import { PropertyManagement } from "@/components/admin/PropertyManagement";
// Removed TestComponent import as it's no longer needed

export default function AdminProperties() {
  console.log("AdminProperties page rendering");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Property Management</h1>
        <p className="text-muted-foreground">
          Manage all property listings, approve new submissions, and oversee platform inventory.
        </p>
      </div>
      <div>
        {/* Removed debug text as it's no longer needed */}
        <PropertyManagement />
      </div>
    </div>
  );
}