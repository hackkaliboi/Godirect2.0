import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Building2, DollarSign, Shield } from "lucide-react";
import { AgentManagement } from "@/components/admin/AgentManagement";
import { AgentKYCManagement } from "@/components/admin/AgentKYCManagement";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentStat {
  title: string;
  value: string;
  icon: any;
  description: string;
}

export default function AdminAgents() {
  const [agentStats, setAgentStats] = useState<AgentStat[]>([
    {
      title: "Total Agents",
      value: "0",
      icon: UserCheck,
      description: "All registered agents"
    },
    {
      title: "Active Agents",
      value: "0",
      icon: Building2,
      description: "Agents with active listings"
    },
    {
      title: "Pending Applications",
      value: "0",
      icon: UserCheck,
      description: "Agents awaiting approval"
    },
    {
      title: "Pending KYC",
      value: "0",
      icon: Shield,
      description: "Agents awaiting verification"
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch total agents from profiles table
        const { count: totalAgents, error: totalError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'agent');

        console.log('Total agents count:', totalAgents);
        console.log('Total agents error:', totalError);

        if (totalError) {
          console.error('Error fetching total agents:', totalError);
          setError(totalError.message);
          return;
        }

        // Fetch agents with properties (active agents)
        const { data: agentProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_type', 'agent');

        console.log('Agent profiles:', agentProfiles);
        console.log('Profiles error:', profilesError);

        if (profilesError) {
          console.error('Error fetching agent profiles:', profilesError);
          setError(profilesError.message);
          return;
        }

        // Count how many agents have properties
        let activeAgents = 0;
        if (agentProfiles) {
          for (const profile of agentProfiles) {
            const { count: propertyCount, error } = await supabase
              .from('properties')
              .select('*', { count: 'exact', head: true })
              .eq('agent_id', profile.id);

            console.log(`Agent ${profile.id} has ${propertyCount} properties`);

            if (!error && propertyCount && propertyCount > 0) {
              activeAgents++;
            }
          }
        }

        // For now, we'll use a simple approach for pending applications
        // In a real implementation, you'd have a status field to check
        const pendingApplications = 0;

        // Update stats with real data
        setAgentStats([
          { ...agentStats[0], value: totalAgents?.toString() || "0" },
          { ...agentStats[1], value: activeAgents.toString() },
          { ...agentStats[2], value: pendingApplications.toString() },
          { ...agentStats[3], value: "0" } // Placeholder for pending KYC
        ]);
      } catch (err) {
        console.error('Error fetching agent stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentStats();
  }, []);

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Agent Management
          </h1>
          <p className="text-muted-foreground">
            Manage real estate agents and their performance
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive">Error loading agent statistics: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading agent statistics...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {agentStats.map((stat, index) => (
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
        )}

        <Tabs defaultValue="agents" className="w-full">
          <TabsList>
            <TabsTrigger value="agents">All Agents</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          </TabsList>
          <TabsContent value="agents">
            <AgentManagement />
          </TabsContent>
          <TabsContent value="kyc">
            <AgentKYCManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}