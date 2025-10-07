import { useEffect, useState } from "react";
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
  Filter,
  BarChart3,
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserStat {
  title: string;
  value: string;
  icon: any;
  description: string;
}

export default function AdminUsers() {
  const [userStats, setUserStats] = useState<UserStat[]>([
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
  ]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Fetch total users
        const { count: totalUsers, error: totalError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalError) {
          console.error('Error fetching total users:', totalError);
          return;
        }

        // Fetch users created this month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const { data: newUsersData, error: monthError } = await supabase
          .from('profiles')
          .select('created_at');

        if (monthError) {
          console.error('Error fetching users:', monthError);
          return;
        }

        // Filter users created this month
        const newThisMonth = newUsersData?.filter(user => {
          if (!user.created_at) return false;
          const userDate = new Date(user.created_at);
          return userDate >= oneMonthAgo;
        }).length || 0;

        // Count agents
        const { count: agentCount, error: agentError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'agent');

        if (agentError) {
          console.error('Error fetching agent count:', agentError);
          return;
        }

        // Count pending verifications (users with KYC documents pending)
        const { count: pendingVerifications, error: kycError } = await supabase
          .from('kyc_documents')
          .select('*', { count: 'exact', head: true })
          .eq('verification_status', 'pending');

        if (kycError) {
          console.error('Error fetching pending verifications:', kycError);
          return;
        }

        // Count active users (users with recent activity)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: activeUsers, error: activeError } = await (supabase as any)
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', thirtyDaysAgo.toISOString());

        if (activeError) {
          console.error('Error fetching active users:', activeError);
          return;
        }

        // Update stats with real data
        setUserStats([
          { ...userStats[0], value: totalUsers?.toString() || "0" },
          { ...userStats[1], value: activeUsers?.toString() || "0" },
          { ...userStats[2], value: pendingVerifications?.toString() || "0" },
          { ...userStats[3], value: newThisMonth.toString() }
        ]);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

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
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Bulk Email
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
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
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              User Registration Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">Registration trends chart</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Visualize user growth over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">User location map</p>
                <p className="text-sm text-muted-foreground mt-1">
                  See where your users are located
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}