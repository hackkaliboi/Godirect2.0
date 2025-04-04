
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const clients = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john.smith@example.com", 
    phone: "(555) 234-5678",
    status: "Active", 
    propertyType: "Condo",
    budget: "$300,000 - $400,000",
    priceRange: "$300k-$400k",
    location: "Downtown",
    bedrooms: "2+",
    bathrooms: "2+",
    lastContact: "Today"
  },
  { 
    id: 2, 
    name: "Emma Johnson", 
    email: "emma.johnson@example.com", 
    phone: "(555) 345-6789",
    status: "Active", 
    propertyType: "Single Family",
    budget: "$500,000 - $700,000",
    priceRange: "$500k-$700k",
    location: "Suburbs",
    bedrooms: "3+",
    bathrooms: "2+",
    lastContact: "Yesterday"
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael.brown@example.com", 
    phone: "(555) 456-7890",
    status: "Active", 
    propertyType: "Townhouse",
    budget: "$400,000 - $500,000",
    priceRange: "$400k-$500k",
    location: "Midtown",
    bedrooms: "2-3",
    bathrooms: "2+",
    lastContact: "2 days ago"
  },
  { 
    id: 4, 
    name: "Sophia Davis", 
    email: "sophia.davis@example.com", 
    phone: "(555) 567-8901",
    status: "Inactive", 
    propertyType: "Apartment",
    budget: "$250,000 - $350,000",
    priceRange: "$250k-$350k",
    location: "University District",
    bedrooms: "1-2",
    bathrooms: "1+",
    lastContact: "2 weeks ago"
  },
  { 
    id: 5, 
    name: "William Wilson", 
    email: "william.wilson@example.com", 
    phone: "(555) 678-9012",
    status: "Lead", 
    propertyType: "Condo",
    budget: "$350,000 - $450,000",
    priceRange: "$350k-$450k",
    location: "Waterfront",
    bedrooms: "2+",
    bathrooms: "2+",
    lastContact: "1 day ago"
  },
];

export default function AgentClients() {
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
                <Input placeholder="Search clients..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="overflow-x-auto">
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
                  {clients.map((client) => (
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
                          <p><span className="text-muted-foreground">Type:</span> {client.propertyType}</p>
                          <p><span className="text-muted-foreground">Price:</span> {client.priceRange}</p>
                          <p><span className="text-muted-foreground">Area:</span> {client.location}</p>
                          <p><span className="text-muted-foreground">Beds:</span> {client.bedrooms} <span className="text-muted-foreground ml-2">Baths:</span> {client.bathrooms}</p>
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
                      <TableCell>{client.lastContact}</TableCell>
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
            </TabsContent>
            
            <TabsContent value="active">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Active clients would appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="leads">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Lead clients would appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Inactive clients would appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
