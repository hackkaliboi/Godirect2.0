
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare,
  Search, 
  Filter, 
  ExternalLink,
  ArrowRight,
  Clock,
  ArrowUpRight,
  MessageCircle
} from "lucide-react";

// Sample data
const inquiries = [
  { 
    id: 1,
    propertyId: 1,
    property: "Modern Downtown Apartment",
    address: "123 Main St, Downtown",
    agent: "Sarah Johnson",
    date: "2023-06-15",
    message: "I'm interested in viewing this property. Is it available for a showing this weekend?",
    status: "New",
    replied: false,
  },
  { 
    id: 2,
    propertyId: 2,
    property: "Luxury Waterfront Condo",
    address: "789 Marina Blvd, Waterfront",
    agent: "David Martinez",
    date: "2023-06-12",
    message: "Does this property have covered parking? And are utilities included in the HOA fees?",
    status: "Replied",
    replied: true,
  },
  { 
    id: 3,
    propertyId: 3,
    property: "Suburban Family Home",
    address: "456 Oak Ave, Pleasant Valley",
    agent: "Jennifer Williams",
    date: "2023-06-10",
    message: "I'm interested in scheduling a viewing for next week. What times are available?",
    status: "New",
    replied: false,
  },
  { 
    id: 4,
    propertyId: 4,
    property: "Downtown Office Space",
    address: "555 Business Ave, Downtown",
    agent: "Robert Brown",
    date: "2023-06-08",
    message: "Is this space suitable for a team of 10 people? Also, are there any meeting rooms included?",
    status: "Closed",
    replied: true,
  },
  { 
    id: 5,
    propertyId: 5,
    property: "Cozy Studio Apartment",
    address: "101 College St, University District",
    agent: "Amanda Davis",
    date: "2023-06-05",
    message: "What's the pet policy for this apartment? I have a small dog.",
    status: "Replied",
    replied: true,
  },
];

const UserInquiries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">
            Manage your property inquiries
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
          <h2 className="text-xl font-semibold">Your Inquiries</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search inquiries..." 
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">
            New
            <Badge variant="default" className="ml-2">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{inquiry.property}</h3>
                        <p className="text-xs text-muted-foreground">{inquiry.address}</p>
                      </div>
                      <Badge variant={
                        inquiry.status === "New" ? "default" :
                        inquiry.status === "Replied" ? "secondary" : "outline"
                      }>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3">{inquiry.message}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {inquiry.date}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Property
                        </Button>
                        <Link to={`/user-dashboard/inquiries/${inquiry.id}`}>
                          <Button size="sm">
                            {inquiry.replied ? "View Response" : "Reply"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {inquiries.filter(i => i.status === "New").map((inquiry) => (
                  <div key={inquiry.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{inquiry.property}</h3>
                        <p className="text-xs text-muted-foreground">{inquiry.address}</p>
                      </div>
                      <Badge variant="default">New</Badge>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3">{inquiry.message}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {inquiry.date}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Property
                        </Button>
                        <Link to={`/user-dashboard/inquiries/${inquiry.id}`}>
                          <Button size="sm">
                            Reply
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="replied">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {inquiries.filter(i => i.status === "Replied").map((inquiry) => (
                  <div key={inquiry.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{inquiry.property}</h3>
                        <p className="text-xs text-muted-foreground">{inquiry.address}</p>
                      </div>
                      <Badge variant="secondary">Replied</Badge>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3">{inquiry.message}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {inquiry.date}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Property
                        </Button>
                        <Link to={`/user-dashboard/inquiries/${inquiry.id}`}>
                          <Button size="sm">
                            View Response
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="closed">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {inquiries.filter(i => i.status === "Closed").map((inquiry) => (
                  <div key={inquiry.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{inquiry.property}</h3>
                        <p className="text-xs text-muted-foreground">{inquiry.address}</p>
                      </div>
                      <Badge variant="outline">Closed</Badge>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3">{inquiry.message}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {inquiry.date}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Property
                        </Button>
                        <Link to={`/user-dashboard/inquiries/${inquiry.id}`}>
                          <Button size="sm" variant="outline">
                            View History
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-background shadow-sm rounded-lg p-4">
              <p className="text-3xl font-bold">{inquiries.length}</p>
              <p className="text-sm text-muted-foreground">Total Inquiries</p>
            </div>
            <div className="bg-background shadow-sm rounded-lg p-4">
              <p className="text-3xl font-bold">{inquiries.filter(i => i.status === "New").length}</p>
              <p className="text-sm text-muted-foreground">New Inquiries</p>
            </div>
            <div className="bg-background shadow-sm rounded-lg p-4">
              <p className="text-3xl font-bold">{inquiries.filter(i => i.status === "Replied").length}</p>
              <p className="text-sm text-muted-foreground">Replied</p>
            </div>
            <div className="bg-background shadow-sm rounded-lg p-4">
              <div className="flex items-center justify-center mb-1">
                <p className="text-3xl font-bold">75%</p>
                <ArrowUpRight className="ml-1 h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInquiries;
