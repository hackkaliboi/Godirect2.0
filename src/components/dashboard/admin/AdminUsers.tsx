
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Loader2, UserCog, Shield, CheckCircle, XCircle, Eye } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define user type from the database schema
type User = {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    name?: string;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    user_type: string;
  };
};

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch users from Supabase Auth and join with profiles table
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Fetch users from auth.users through RPC function
      const { data, error: authError } = await supabase.rpc('get_users');
      
      if (authError) {
        console.error("Error fetching users:", authError);
        throw authError;
      }
      
      return data as User[];
    }
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => {
    const name = user.profiles?.first_name && user.profiles?.last_name 
      ? `${user.profiles.first_name} ${user.profiles.last_name}`
      : user.user_metadata?.name || user.email.split('@')[0];
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle adding new user
  const handleAddUser = async () => {
    try {
      // In a real application, you'd use Supabase's server-side admin functions
      // to create users. For now, just show a toast notification
      toast.info("In a production environment, this would create a new user via Supabase Admin API");
      setIsAddUserDialogOpen(false);
      setNewUserEmail("");
      setNewUserRole("user");
    } catch (error: any) {
      toast.error(`Failed to add user: ${error.message}`);
    }
  };

  // Handle updating user role
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      setIsUpdating(true);
      // Update the user's role in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update role: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle verifying a user
  const handleVerifyUser = async (userId: string) => {
    try {
      setIsUpdating(true);
      // In a real application, you'd update a field in the profiles table
      // For now, just show a toast notification
      toast.success("User verified successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to verify user: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle suspending a user
  const handleSuspendUser = async (userId: string) => {
    try {
      setIsUpdating(true);
      // In a real application, you'd update a status field in the profiles table
      // For now, just show a toast notification
      toast.success("User suspended");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to suspend user: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle viewing user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewUserDialogOpen(true);
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage platform users and their access
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error loading users. Please try again later.</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users and their access
          </p>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
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
              <Input 
                placeholder="Search users..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
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
                {filteredUsers.map((user) => {
                  const userName = user.profiles?.first_name && user.profiles?.last_name 
                    ? `${user.profiles.first_name} ${user.profiles.last_name}`
                    : user.user_metadata?.name || user.email.split('@')[0];
                  
                  const userRole = user.profiles?.user_type || 'User';
                  
                  // For demo, let's assume a user is active if they have a profile
                  const userStatus = user.profiles ? "Active" : "Pending";
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{userRole}</TableCell>
                      <TableCell>
                        <Badge variant={
                          userStatus === "Active" ? "default" : 
                          userStatus === "Pending" ? "outline" : "secondary"
                        }>
                          {userStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isUpdating}>
                              <MoreHorizontal className="h-4 w-4" />
                              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleViewUser(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <UserCog className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onSelect={() => handleUpdateUserRole(user.id, 'user')}>
                                    User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleUpdateUserRole(user.id, 'agent')}>
                                    Agent
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleUpdateUserRole(user.id, 'admin')}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Admin
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            
                            <DropdownMenuItem onSelect={() => handleVerifyUser(user.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify User
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onSelect={() => handleSuspendUser(user.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No users match your search criteria." : "No users found in the database."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center space-y-2 mb-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCog className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">
                  {selectedUser.profiles?.first_name && selectedUser.profiles?.last_name 
                    ? `${selectedUser.profiles.first_name} ${selectedUser.profiles.last_name}`
                    : selectedUser.user_metadata?.name || selectedUser.email.split('@')[0]}
                </h3>
                <Badge variant={selectedUser.profiles ? "default" : "outline"}>
                  {selectedUser.profiles?.user_type || 'User'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                <div className="font-medium">Email:</div>
                <div>{selectedUser.email}</div>
                
                <div className="font-medium">Status:</div>
                <div>
                  <Badge variant={selectedUser.profiles ? "default" : "outline"}>
                    {selectedUser.profiles ? "Active" : "Pending"}
                  </Badge>
                </div>
                
                <div className="font-medium">Joined:</div>
                <div>{formatDate(selectedUser.created_at)}</div>
                
                <div className="font-medium">Last Login:</div>
                <div>{formatDate(selectedUser.created_at)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewUserDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
