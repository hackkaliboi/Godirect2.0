
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter, RefreshCw, UserPlus, Mail, Phone, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Define interfaces for our data model
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  listings: number;
  status: string;
  joined: string;
  bio?: string;
  specialization?: string;
  avatar_url?: string;
  commission_rate?: number;
  total_sales?: number;
  license_number?: string;
  address?: string;
}

interface AgentFormState {
  name: string;
  email: string;
  phone: string;
  status: string;
  bio: string;
  specialization: string;
  commission_rate: number;
  license_number: string;
  address: string;
}

export default function AdminAgents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formState, setFormState] = useState<AgentFormState>({
    name: "",
    email: "",
    phone: "",
    status: "Pending",
    bio: "",
    specialization: "",
    commission_rate: 5,
    license_number: "",
    address: ""
  });
  
  // Reset form state
  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      phone: "",
      status: "Pending",
      bio: "",
      specialization: "",
      commission_rate: 5,
      license_number: "",
      address: ""
    });
  };
  
  // Fetch agents from Supabase
  const { data: agents, isLoading, refetch } = useQuery({
    queryKey: ["agents", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("agents")
        .select("*")
        .order("name", { ascending: true });
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching agents:", error);
        throw error;
      }
      
      // If no data exists, create initial agents
      if (!data || data.length === 0) {
        // Create the initial agents
        const initialAgents = [
          {
            id: crypto.randomUUID(),
            name: "Sarah Johnson",
            email: "sarah.j@godirect.com",
            phone: "(234) 567-8901",
            listings: 12,
            status: "Active",
            joined: new Date("2023-01-15").toISOString(),
            bio: "Experienced real estate agent with over 10 years in the industry.",
            specialization: "Residential Properties",
            commission_rate: 5.5,
            license_number: "NG-REA-12345",
            address: "Lagos, Nigeria",
            total_sales: 45000000
          },
          {
            id: crypto.randomUUID(),
            name: "David Martinez",
            email: "david.m@godirect.com",
            phone: "(345) 678-9012",
            listings: 8,
            status: "Active",
            joined: new Date("2023-03-03").toISOString(),
            bio: "Specializing in luxury properties and high-end real estate.",
            specialization: "Luxury Properties",
            commission_rate: 6.0,
            license_number: "NG-REA-23456",
            address: "Abuja, Nigeria",
            total_sales: 78000000
          },
          {
            id: crypto.randomUUID(),
            name: "Jennifer Williams",
            email: "jennifer.w@godirect.com",
            phone: "(456) 789-0123",
            listings: 15,
            status: "Active",
            joined: new Date("2022-11-12").toISOString(),
            bio: "Expert in commercial properties and business real estate solutions.",
            specialization: "Commercial Properties",
            commission_rate: 5.0,
            license_number: "NG-REA-34567",
            address: "Port Harcourt, Nigeria",
            total_sales: 92000000
          },
          {
            id: crypto.randomUUID(),
            name: "Robert Brown",
            email: "robert.b@godirect.com",
            phone: "(567) 890-1234",
            listings: 6,
            status: "Inactive",
            joined: new Date("2023-02-28").toISOString(),
            bio: "Focused on helping first-time homebuyers find their perfect match.",
            specialization: "Residential Properties",
            commission_rate: 4.5,
            license_number: "NG-REA-45678",
            address: "Kano, Nigeria",
            total_sales: 23000000
          }
        ];
        
        // Insert initial agents
        for (const agent of initialAgents) {
          await supabase.from("agents").insert(agent);
        }
        
        // Fetch the newly created agents
        const { data: newData } = await supabase
          .from("agents")
          .select("*")
          .order("name", { ascending: true });
          
        if (newData) {
          return newData.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            listings: item.listings || 0,
            status: item.status || "Pending",
            joined: item.joined || new Date().toISOString(),
            bio: item.bio || "",
            specialization: item.specialization || "",
            avatar_url: item.avatar_url,
            commission_rate: item.commission_rate || 5,
            total_sales: item.total_sales || 0,
            license_number: item.license_number || "",
            address: item.address || ""
          })) as Agent[];
        }
        
        return [] as Agent[];
      }
      
      // Transform data to match Agent interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        listings: item.listings || 0,
        status: item.status || "Pending",
        joined: item.joined || new Date().toISOString(),
        bio: item.bio || "",
        specialization: item.specialization || "",
        avatar_url: item.avatar_url,
        commission_rate: item.commission_rate || 5,
        total_sales: item.total_sales || 0,
        license_number: item.license_number || "",
        address: item.address || ""
      })) as Agent[];
    }
  });
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Agents Refreshed",
        description: "The agent list has been updated with the latest data.",
      });
    } catch (error) {
      console.error("Error refreshing agents:", error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the agent list.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Add new agent mutation
  const addAgentMutation = useMutation({
    mutationFn: async (newAgent: AgentFormState) => {
      const agentData = {
        id: crypto.randomUUID(),
        name: newAgent.name,
        email: newAgent.email,
        phone: newAgent.phone,
        status: newAgent.status,
        joined: new Date().toISOString(),
        listings: 0,
        bio: newAgent.bio,
        specialization: newAgent.specialization,
        commission_rate: newAgent.commission_rate,
        license_number: newAgent.license_number,
        address: newAgent.address
      };
      
      const { error } = await supabase
        .from("agents")
        .insert(agentData);
        
      if (error) throw error;
      return agentData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast({
        title: "Agent Added",
        description: "The new agent has been successfully added.",
      });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error adding agent:", error);
      toast({
        title: "Error",
        description: "Failed to add the agent. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update agent mutation
  const updateAgentMutation = useMutation({
    mutationFn: async (agent: Agent) => {
      const { error } = await supabase
        .from("agents")
        .update({
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          status: agent.status,
          bio: agent.bio,
          specialization: agent.specialization,
          commission_rate: agent.commission_rate,
          license_number: agent.license_number,
          address: agent.address
        })
        .eq("id", agent.id);
        
      if (error) throw error;
      return agent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast({
        title: "Agent Updated",
        description: "The agent has been successfully updated.",
      });
      setSelectedAgent(null);
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to update the agent. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", agentId);
        
      if (error) throw error;
      return agentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast({
        title: "Agent Deleted",
        description: "The agent has been successfully deleted.",
      });
      setSelectedAgent(null);
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete the agent. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Handle add agent
  const handleAddAgent = () => {
    addAgentMutation.mutate(formState);
  };
  
  // Handle edit agent
  const handleEditAgent = () => {
    if (!selectedAgent) return;
    
    const updatedAgent: Agent = {
      ...selectedAgent,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      status: formState.status,
      bio: formState.bio,
      specialization: formState.specialization,
      commission_rate: formState.commission_rate,
      license_number: formState.license_number,
      address: formState.address
    };
    
    updateAgentMutation.mutate(updatedAgent);
  };
  
  // Handle delete agent
  const handleDeleteAgent = () => {
    if (!selectedAgent) return;
    deleteAgentMutation.mutate(selectedAgent.id);
  };
  
  // Filter agents by search query
  const filteredAgents = agents?.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.phone.includes(searchQuery)
  );
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Real Estate Agents"
        subtitle="Manage agents and their property listings"
        actionLabel="Add Agent"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}
      />

      <Card>
        <CardHeader className="px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Agents</CardTitle>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search agents..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh} 
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Agents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                    Status: Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>
                    Status: Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                    Status: Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAgents && filteredAgents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Listings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={agent.avatar_url || "/placeholder-avatar.jpg"} alt={agent.name} />
                          <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.specialization}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {agent.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {agent.phone}
                      </div>
                    </TableCell>
                    <TableCell>{agent.listings}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={agent.status === "Active" ? "default" : 
                                agent.status === "Inactive" ? "secondary" : "outline"}
                        className={agent.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : 
                                 agent.status === "Inactive" ? "bg-gray-100 text-gray-800 hover:bg-gray-100" : 
                                 "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                      >
                        {agent.status === "Active" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> {agent.status}
                          </span>
                        ) : agent.status === "Inactive" ? (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> {agent.status}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {agent.status}
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(agent.joined).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedAgent(agent);
                            setIsViewDialogOpen(true);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedAgent(agent);
                            setFormState({
                              name: agent.name,
                              email: agent.email,
                              phone: agent.phone,
                              status: agent.status,
                              bio: agent.bio || "",
                              specialization: agent.specialization || "",
                              commission_rate: agent.commission_rate || 5,
                              license_number: agent.license_number || "",
                              address: agent.address || ""
                            });
                            setIsEditDialogOpen(true);
                          }}>
                            Edit Agent
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setSelectedAgent(agent);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No agents found. Add your first agent to get started.</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </div>
          )}
        </CardContent>
        {filteredAgents && filteredAgents.length > 0 && (
          <CardFooter className="flex justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredAgents.length}</span> of{" "}
              <span className="font-medium">{agents?.length || 0}</span> agents
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Add Agent Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Enter the details for the new agent. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formState.status} 
                  onValueChange={(value) => setFormState({ ...formState, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="john.doe@godirect.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  placeholder="(234) 123-4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formState.specialization}
                  onChange={(e) => setFormState({ ...formState, specialization: e.target.value })}
                  placeholder="Residential Properties"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission">Commission Rate (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={formState.commission_rate}
                  onChange={(e) => setFormState({ ...formState, commission_rate: parseFloat(e.target.value) })}
                  placeholder="5.0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={formState.license_number}
                  onChange={(e) => setFormState({ ...formState, license_number: e.target.value })}
                  placeholder="NG-REA-12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  placeholder="Lagos, Nigeria"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                placeholder="Brief description about the agent..."
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddAgent} 
              disabled={!formState.name || !formState.email || !formState.phone || !formState.status}
            >
              Add Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update the agent's information. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select 
                  value={formState.status} 
                  onValueChange={(value) => setFormState({ ...formState, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Input
                  id="edit-specialization"
                  value={formState.specialization}
                  onChange={(e) => setFormState({ ...formState, specialization: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-commission">Commission Rate (%)</Label>
                <Input
                  id="edit-commission"
                  type="number"
                  value={formState.commission_rate}
                  onChange={(e) => setFormState({ ...formState, commission_rate: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-license">License Number</Label>
                <Input
                  id="edit-license"
                  value={formState.license_number}
                  onChange={(e) => setFormState({ ...formState, license_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditAgent} 
              disabled={!formState.name || !formState.email || !formState.phone || !formState.status}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Agent Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              Detailed information about the agent.
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedAgent.avatar_url || "/placeholder-avatar.jpg"} alt={selectedAgent.name} />
                  <AvatarFallback className="text-xl">{selectedAgent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedAgent.name}</h3>
                  <p className="text-muted-foreground">{selectedAgent.specialization}</p>
                  <Badge 
                    variant={selectedAgent.status === "Active" ? "default" : 
                            selectedAgent.status === "Inactive" ? "secondary" : "outline"}
                    className="mt-1"
                  >
                    {selectedAgent.status}
                  </Badge>
                </div>
              </div>
              
              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Basic Info</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                      <p className="flex items-center gap-1 mt-1">
                        <Mail className="h-4 w-4" /> {selectedAgent.email}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                      <p className="flex items-center gap-1 mt-1">
                        <Phone className="h-4 w-4" /> {selectedAgent.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">License Number</h4>
                    <p className="mt-1">{selectedAgent.license_number || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                    <p className="mt-1">{selectedAgent.address || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
                    <p className="mt-1">{selectedAgent.bio || "No bio provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Commission Rate</h4>
                      <p className="mt-1">{selectedAgent.commission_rate || 5}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                      <p className="mt-1">{new Date(selectedAgent.joined).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Active Listings</h4>
                      <p className="text-2xl font-bold mt-1">{selectedAgent.listings}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Total Sales</h4>
                      <p className="text-2xl font-bold mt-1">₦{(selectedAgent.total_sales || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Monthly Performance</h4>
                    <div className="h-[200px] flex items-end justify-between">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 100) + 20;
                        return (
                          <div key={i} className="relative w-full">
                            <div 
                              className="bg-primary/90 rounded-t w-6 mx-auto" 
                              style={{ height: `${height}px` }}
                            />
                            <span className="text-xs text-muted-foreground absolute bottom-[-20px] left-1/2 transform -translate-x-1/2">
                              {new Date(Date.now() - (5-i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', { month: 'short' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Recent Activity</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-3 border-b pb-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {i === 0 ? <CheckCircle className="h-4 w-4 text-primary" /> : 
                             i === 1 ? <Edit className="h-4 w-4 text-amber-500" /> : 
                             i === 2 ? <UserPlus className="h-4 w-4 text-green-500" /> : 
                             <Mail className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {i === 0 ? "Completed a property sale" : 
                               i === 1 ? "Updated profile information" : 
                               i === 2 ? "Added a new client" : 
                               "Sent follow-up emails to prospects"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (selectedAgent) {
                  setFormState({
                    name: selectedAgent.name,
                    email: selectedAgent.email,
                    phone: selectedAgent.phone,
                    status: selectedAgent.status,
                    bio: selectedAgent.bio || "",
                    specialization: selectedAgent.specialization || "",
                    commission_rate: selectedAgent.commission_rate || 5,
                    license_number: selectedAgent.license_number || "",
                    address: selectedAgent.address || ""
                  });
                  setIsViewDialogOpen(false);
                  setIsEditDialogOpen(true);
                }
              }}
            >
              Edit Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Agent Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the agent
              {selectedAgent && ` ${selectedAgent.name}`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAgent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
