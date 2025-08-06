import { UserManagement } from "@/components/admin/UserManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Mail,
  Download,
  Filter
} from "lucide-react";

export default function AdminUsers() {
  const userStats = [
    {
      title: "Total Users",
      value: "0",
      icon: Users,
      description: "All registered users"
    },
    {
      title: "Active Users",
      value: "0",
      icon: UserCheck,
      description: "Users active in last 30 days"
    },
    {
      title: "Pending Verifications",
      value: "0",
      icon: UserX,
      description: "Users awaiting verification"
    },
    {
      title: "New This Month",
      value: "0",
      icon: UserPlus,
      description: "New registrations this month"
    }
  ];

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, agents, and platform access
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter Users
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <UserManagement />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Registration Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">No registration data yet</p>
                <p className="text-sm">
                  Registration trends will appear when users start signing up
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">No pending applications</p>
                <p className="text-sm">
                  Agent applications will appear here for approval
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}