import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
import { Search, MoreHorizontal, UserCheck, UserX, Mail, Phone, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types";

interface AgentProfile extends Profile {
  propertiesCount: number;
  salesCount: number;
}

export function AgentManagement() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch agents from profiles table where user_type = 'agent'
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'agent');

        console.log('Profiles data:', profilesData);
        console.log('Profiles error:', profilesError);

        if (profilesError) {
          console.error('Error fetching agent profiles:', profilesError);
          setError(profilesError.message);
          setLoading(false);
          return;
        }

        // For each agent profile, fetch their property count
        const agentsWithStats: AgentProfile[] = await Promise.all(
          (profilesData || []).map(async (profile) => {
            // Fetch property count for this agent
            const { count: propertiesCount, error: propertiesError } = await supabase
              .from('properties')
              .select('*', { count: 'exact', head: true })
              .eq('agent_id', profile.id);

            // Fetch sales count for this agent (assuming sales table exists)
            const { count: salesCount, error: salesError } = await supabase
              .from('sales')
              .select('*', { count: 'exact', head: true })
              .eq('agent_id', profile.id);

            return {
              ...profile,
              propertiesCount: propertiesCount || 0,
              salesCount: salesCount || 0
            };
          })
        );

        console.log('Agents with stats:', agentsWithStats);
        setAgents(agentsWithStats);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-destructive mb-4">Error loading agents: {error}</div>
            <p className="text-muted-foreground">
              There was an error fetching agent data. Please check the console for more details.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Agent Management</CardTitle>
          <Button>
            <UserCheck className="mr-2 h-4 w-4" />
            Invite Agent
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search agents..."
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Agents Registered</h3>
            <p className="text-muted-foreground mb-4">
              Agent profiles will appear here when they register
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Manage agent accounts and permissions</p>
              <p>• Approve agent applications</p>
              <p>• Monitor agent performance and activity</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={agent.avatar_url || undefined} />
                      <AvatarFallback>
                        {agent.full_name?.split(' ').map(n => n[0]).join('') || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{agent.full_name || 'Unknown Agent'}</div>
                      <div className="text-sm text-muted-foreground">Agent</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{agent.email || 'No email'}</span>
                      </div>
                      {agent.phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{agent.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{agent.propertiesCount}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{agent.salesCount}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agent.status || 'pending')}>
                      {agent.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserCheck className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <UserX className="mr-2 h-4 w-4" />
                          Suspend Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}