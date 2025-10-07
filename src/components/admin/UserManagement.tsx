import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  Eye,
  Download,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserFilters } from "./UserFilters";
import { UserDetailView } from "./UserDetailView";
import { UserBulkActions } from "./UserBulkActions";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  properties?: number;
  avatar?: string;
  phone?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          console.error('Error fetching users:', error);
          setLoading(false);
          return;
        }

        // Transform the data to match our User interface
        const transformedUsers: User[] = (data || []).map((profile: any) => ({
          id: profile.id,
          name: profile.full_name || 'Unknown',
          email: profile.email || 'No email',
          role: profile.user_type as "user" | "agent" | "admin",
          status: profile.status as "active" | "inactive" | "suspended",
          joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown',
          lastActive: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Unknown',
          avatar: profile.avatar_url || undefined,
          phone: profile.phone || undefined
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...users];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.includes(term))
      );
    }
    
    // Apply user type filter
    if (filters.userType !== "all") {
      filtered = filtered.filter(user => user.role === filters.userType);
    }
    
    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(user => user.status === filters.status);
    }
    
    // Apply date range filters
    if (filters.dateFrom) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.joinDate);
        return userDate >= filters.dateFrom;
      });
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.joinDate);
        return userDate <= filters.dateTo;
      });
    }
    
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        (user.phone && user.phone.includes(term))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkActionComplete = () => {
    // Refresh the user list or perform any necessary cleanup
    setSelectedUsers([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-warning text-warning-foreground";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground";
      case "agent":
        return "bg-primary text-primary-foreground";
      case "user":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (selectedUser) {
    return <UserDetailView userId={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <UserCheck className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <UserFilters onFilterChange={handleFilterChange} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <UserBulkActions 
                selectedUsers={selectedUsers} 
                onActionComplete={handleBulkActionComplete} 
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>{user.properties || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedUser(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}