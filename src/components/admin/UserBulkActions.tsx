import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  XCircle,
  UserX,
  Download,
  Mail,
  Users
} from "lucide-react";
import { toast } from "sonner";

interface UserBulkActionsProps {
  selectedUsers: string[];
  onActionComplete: () => void;
}

export function UserBulkActions({ selectedUsers, onActionComplete }: UserBulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real implementation, you would perform the actual bulk operations here
      // For now, we'll just simulate the actions
      
      switch (action) {
        case "activate":
          toast.success(`Activated ${selectedUsers.length} users`);
          break;
        case "suspend":
          toast.success(`Suspended ${selectedUsers.length} users`);
          break;
        case "delete":
          toast.success(`Deleted ${selectedUsers.length} users`);
          break;
        case "export":
          toast.success(`Exported ${selectedUsers.length} users to CSV`);
          break;
        case "email":
          toast.success(`Prepared email for ${selectedUsers.length} users`);
          break;
        default:
          toast.error("Unknown action");
      }
      
      onActionComplete();
    } catch (error) {
      toast.error("Failed to perform bulk action");
      console.error("Bulk action error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isProcessing || selectedUsers.length === 0}>
          {isProcessing ? "Processing..." : `Bulk Actions (${selectedUsers.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Activate Users</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction("suspend")}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Suspend Users</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction("delete")} className="text-destructive">
            <UserX className="mr-2 h-4 w-4" />
            <span>Delete Users</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleBulkAction("export")}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export to CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBulkAction("email")}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Send Email</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}