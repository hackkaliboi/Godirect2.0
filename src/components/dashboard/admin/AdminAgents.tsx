
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const agents = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@homepulse.com", phone: "(555) 123-4567", listings: 12, status: "Active", joined: "Jan 15, 2023" },
  { id: 2, name: "David Martinez", email: "david.m@homepulse.com", phone: "(555) 234-5678", listings: 8, status: "Active", joined: "Mar 3, 2023" },
  { id: 3, name: "Jennifer Williams", email: "jennifer.w@homepulse.com", phone: "(555) 345-6789", listings: 15, status: "Active", joined: "Nov 12, 2022" },
  { id: 4, name: "Robert Brown", email: "robert.b@homepulse.com", phone: "(555) 456-7890", listings: 6, status: "Inactive", joined: "Feb 28, 2023" },
  { id: 5, name: "Amanda Davis", email: "amanda.d@homepulse.com", phone: "(555) 567-8901", listings: 10, status: "Active", joined: "Apr 17, 2023" },
  { id: 6, name: "Michael Wilson", email: "michael.w@homepulse.com", phone: "(555) 678-9012", listings: 0, status: "Pending", joined: "Jun 5, 2023" },
];

export default function AdminAgents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real Estate Agents</h1>
          <p className="text-muted-foreground">
            Manage agents and their property listings
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>

      <Card>
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <CardTitle>All Agents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search agents..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
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
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg`} alt={agent.name} />
                        <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>{agent.listings}</TableCell>
                  <TableCell>
                    <Badge variant={
                      agent.status === "Active" ? "default" : 
                      agent.status === "Inactive" ? "secondary" : "outline"
                    }>
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.joined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Listings</DropdownMenuItem>
                        <DropdownMenuItem>Edit Agent</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate Agent</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
