
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define client type from the database schema
type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  property_type: string | null;
  budget: string | null;
  price_range: string | null;
  location: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  last_contact: string;
  agent_id: string | null;
};

export default function AgentClients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch clients from Supabase
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["agent-clients"],
    queryFn: async () => {
      // In a real application with auth, we'd filter by the logged-in agent's ID
      const { data, error } = await supabase
        .from("clients")
        .select("*");
      
      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }
      
      return data as Client[];
    }
  });

  // Filter clients based on search term and active tab
  const filteredClients = clients?.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && client.status === "Active";
    if (activeTab === "leads") return matchesSearch && client.status === "Lead";
    if (activeTab === "inactive") return matchesSearch && client.status === "Inactive";
    
    return matchesSearch;
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error("Error loading clients:", error);
    return (
      <div className="text-center">
        <p className="text-red-500">Failed to load clients. Please try again later.</p>
      </div>
    );
  }

  // Format date for last contact
  const formatLastContact = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and requirements
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Clients</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search clients..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="overflow-x-auto">
              {filteredClients && filteredClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Requirements</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" alt={client.name} />
                              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">{client.email}</p>
                              <p className="text-xs text-muted-foreground">{client.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Type:</span> {client.property_type || 'Not specified'}</p>
                            <p><span className="text-muted-foreground">Price:</span> {client.price_range || 'Not specified'}</p>
                            <p><span className="text-muted-foreground">Area:</span> {client.location || 'Not specified'}</p>
                            <p><span className="text-muted-foreground">Beds:</span> {client.bedrooms || 'Any'} <span className="text-muted-foreground ml-2">Baths:</span> {client.bathrooms || 'Any'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            client.status === "Active" ? "default" : 
                            client.status === "Lead" ? "outline" : "secondary"
                          }>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatLastContact(client.last_contact)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Client</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Notes</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No clients match your search criteria." : "No clients found in the database."}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {filteredClients && filteredClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Requirements</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" alt={client.name} />
                              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">{client.email}</p>
                              <p className="text-xs text-muted-foreground">{client.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Type:</span> {client.property_type || 'Not specified'}</p>
                            <p><span className="text-muted-foreground">Price:</span> {client.price_range || 'Not specified'}</p>
                            <p><span className="text-muted-foreground">Area:</span> {client.location || 'Not specified'}</p>
                            <p><span className="text-muted-foreground">Beds:</span> {client.bedrooms || 'Any'} <span className="text-muted-foreground ml-2">Baths:</span> {client.bathrooms || 'Any'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatLastContact(client.last_contact)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Client</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Notes</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No active clients found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="leads">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">No lead clients found</p>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">No inactive clients found</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
