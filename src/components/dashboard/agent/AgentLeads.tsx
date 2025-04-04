
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MoreVertical, Plus, Search } from "lucide-react";

// Mock leads data
const mockLeads = [
  {
    id: "1",
    name: "David Johnson",
    email: "david.johnson@example.com",
    phone: "(555) 123-4567",
    interest: "Buying",
    status: "New",
    propertyType: "House",
    budget: "$500,000 - $750,000",
    lastContact: "2024-03-28T10:30:00Z",
    notes: "Looking for a 3-bedroom house in the suburbs.",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    phone: "(555) 234-5678",
    interest: "Buying",
    status: "In Progress",
    propertyType: "Apartment",
    budget: "$300,000 - $500,000",
    lastContact: "2024-03-25T14:45:00Z",
    notes: "Interested in downtown area, needs parking space.",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    interest: "Selling",
    status: "Hot",
    propertyType: "Condo",
    budget: "N/A",
    lastContact: "2024-03-27T09:15:00Z",
    notes: "Has a waterfront condo to sell, moving out of state.",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    phone: "(555) 456-7890",
    interest: "Buying",
    status: "Cold",
    propertyType: "Townhouse",
    budget: "$750,000 - $1,000,000",
    lastContact: "2024-03-15T16:20:00Z",
    notes: "Was looking but decided to wait 6 months.",
  },
  {
    id: "5",
    name: "James Davis",
    email: "james.davis@example.com",
    phone: "(555) 567-8901",
    interest: "Renting",
    status: "In Progress",
    propertyType: "Apartment",
    budget: "$2,000 - $3,000/mo",
    lastContact: "2024-03-26T11:30:00Z",
    notes: "Relocating for work, needs furnished apartment ASAP.",
  }
];

const statusColors = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hot: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Cold: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
  Converted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const AgentLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState("All");
  
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesInterest = interestFilter === "All" || lead.interest === interestFilter;
    
    return matchesSearch && matchesStatus && matchesInterest;
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>Manage and track potential clients</CardDescription>
            </div>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add New Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Hot">Hot</SelectItem>
                    <SelectItem value="Cold">Cold</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={interestFilter} onValueChange={setInterestFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Interests</SelectItem>
                    <SelectItem value="Buying">Buying</SelectItem>
                    <SelectItem value="Selling">Selling</SelectItem>
                    <SelectItem value="Renting">Renting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="list" className="pt-2">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Card View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="pt-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-4 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Contact</div>
                    <div>Interest</div>
                    <div>Status</div>
                  </div>
                  
                  {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No leads match your search criteria</p>
                    </div>
                  ) : (
                    filteredLeads.map(lead => (
                      <div key={lead.id} className="grid grid-cols-1 md:grid-cols-4 p-4 border-b items-center">
                        <div className="font-medium">{lead.name}</div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span className="text-sm">{lead.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span className="text-sm">{lead.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-1">{lead.interest}</div>
                          <div className="text-sm text-muted-foreground">{lead.budget}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={statusColors[lead.status as keyof typeof statusColors]}>
                            {lead.status}
                          </Badge>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Converted</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="grid" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLeads.length === 0 ? (
                    <div className="col-span-full p-8 text-center">
                      <p className="text-muted-foreground">No leads match your search criteria</p>
                    </div>
                  ) : (
                    filteredLeads.map(lead => (
                      <Card key={lead.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{lead.name}</CardTitle>
                              <CardDescription>{lead.propertyType} - {lead.budget}</CardDescription>
                            </div>
                            <Badge variant="outline" className={statusColors[lead.status as keyof typeof statusColors]}>
                              {lead.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="pt-2">
                            <Label className="text-xs text-muted-foreground">Last Contact</Label>
                            <div className="text-sm">
                              {new Date(lead.lastContact).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Notes</Label>
                            <div className="text-sm mt-1">{lead.notes}</div>
                          </div>
                        </CardContent>
                        <CardFooter className="gap-2 justify-end">
                          <Button variant="outline" size="sm">Contact</Button>
                          <Button size="sm">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentLeads;
