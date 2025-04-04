
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const users = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", role: "User", status: "Active", joined: "Mar 12, 2023" },
  { id: 2, name: "Emma Johnson", email: "emma.johnson@example.com", role: "User", status: "Active", joined: "Apr 5, 2023" },
  { id: 3, name: "Michael Brown", email: "michael.brown@example.com", role: "User", status: "Inactive", joined: "Jan 23, 2023" },
  { id: 4, name: "Sophia Davis", email: "sophia.davis@example.com", role: "User", status: "Active", joined: "May 18, 2023" },
  { id: 5, name: "William Wilson", email: "william.wilson@example.com", role: "User", status: "Active", joined: "Feb 9, 2023" },
  { id: 6, name: "Olivia Taylor", email: "olivia.taylor@example.com", role: "User", status: "Inactive", joined: "Dec 15, 2022" },
  { id: 7, name: "James Anderson", email: "james.anderson@example.com", role: "User", status: "Pending", joined: "Jun 4, 2023" },
  { id: 8, name: "Charlotte Thomas", email: "charlotte.thomas@example.com", role: "User", status: "Active", joined: "Apr 28, 2023" },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users and their access
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.status === "Active" ? "default" : 
                      user.status === "Inactive" ? "secondary" : "outline"
                    }>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
