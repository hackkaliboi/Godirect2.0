
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ClipboardCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileCheck
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const pendingVerifications = [
  {
    id: 1,
    propertyTitle: "2-Bedroom Townhouse",
    propertyType: "House",
    location: "Riverside Area",
    owner: { name: "Michael Chen", avatar: "/placeholder.svg" },
    requestDate: "Apr 5, 2025",
    priority: "High",
    status: "Pending",
    verificationSteps: [
      { name: "Document Review", status: "completed" },
      { name: "Site Visit", status: "pending" },
      { name: "Title Verification", status: "pending" },
      { name: "Final Report", status: "not-started" },
    ]
  },
  {
    id: 2,
    propertyTitle: "Land Plot (500 sqm)",
    propertyType: "Land",
    location: "Greenfield Suburb",
    owner: { name: "Jennifer Smith", avatar: "/placeholder.svg" },
    requestDate: "Apr 3, 2025",
    priority: "Medium",
    status: "In Progress",
    verificationSteps: [
      { name: "Document Review", status: "completed" },
      { name: "Site Visit", status: "completed" },
      { name: "Title Verification", status: "in-progress" },
      { name: "Final Report", status: "not-started" },
    ]
  },
  {
    id: 3,
    propertyTitle: "Commercial Space (120 sqm)",
    propertyType: "Commercial",
    location: "Business District",
    owner: { name: "Robert Johnson", avatar: "/placeholder.svg" },
    requestDate: "Apr 2, 2025",
    priority: "Low",
    status: "Scheduled",
    verificationSteps: [
      { name: "Document Review", status: "in-progress" },
      { name: "Site Visit", status: "scheduled" },
      { name: "Title Verification", status: "not-started" },
      { name: "Final Report", status: "not-started" },
    ]
  }
];

const completedVerifications = [
  {
    id: 4,
    propertyTitle: "3-Bedroom Apartment",
    propertyType: "Apartment",
    location: "Downtown Area",
    owner: { name: "Sarah Williams", avatar: "/placeholder.svg" },
    completionDate: "Apr 1, 2025",
    outcome: "Approved",
    notes: "All documents verified, property matches description"
  },
  {
    id: 5,
    propertyTitle: "Studio Apartment",
    propertyType: "Apartment",
    location: "University District",
    owner: { name: "David Miller", avatar: "/placeholder.svg" },
    completionDate: "Mar 28, 2025",
    outcome: "Rejected",
    notes: "Discrepancies in property documentation"
  }
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case 'scheduled':
      return <Calendar className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function getProgressPercent(steps: {name: string, status: string}[]) {
  const completed = steps.filter(step => step.status === 'completed').length;
  const inProgress = steps.filter(step => step.status === 'in-progress' || step.status === 'scheduled').length;
  
  return Math.round((completed + (inProgress * 0.5)) / steps.length * 100);
}

export default function AgentVerifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Verifications</h1>
          <p className="text-muted-foreground">
            Manage and track property verification tasks
          </p>
        </div>
        <Button>
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Schedule Verification
        </Button>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pending">Pending Verifications</TabsTrigger>
          <TabsTrigger value="completed">Completed Verifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Properties awaiting verification or in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {pendingVerifications.map((verification) => (
                    <Card key={verification.id} className="border border-muted">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-lg">{verification.propertyTitle}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {verification.location}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge variant={
                            verification.priority === "High" ? "destructive" : 
                            verification.priority === "Medium" ? "warning" : 
                            "outline"
                          }>
                            {verification.priority} Priority
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={verification.owner.avatar} alt={verification.owner.name} />
                              <AvatarFallback>{verification.owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{verification.owner.name}</div>
                              <div className="text-xs text-muted-foreground">{verification.propertyType}</div>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">Requested: {verification.requestDate}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Verification Progress</span>
                              <span className="text-sm">{getProgressPercent(verification.verificationSteps)}%</span>
                            </div>
                            <Progress value={getProgressPercent(verification.verificationSteps)} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {verification.verificationSteps.map((step, index) => (
                              <div key={index} className="flex items-center p-2 border rounded-md">
                                {getStatusIcon(step.status)}
                                <div className="ml-2">
                                  <div className="text-sm font-medium">{step.name}</div>
                                  <div className="text-xs capitalize text-muted-foreground">
                                    {step.status.replace('-', ' ')}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex flex-col sm:flex-row w-full gap-2">
                          <Button className="flex-1">Continue Verification</Button>
                          <Button variant="outline" className="flex-1">View Property Details</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Verifications</CardTitle>
              <CardDescription>Verification tasks you have completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>
                        <div className="font-medium">{verification.propertyTitle}</div>
                        <div className="text-xs flex items-center text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {verification.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={verification.owner.avatar} alt={verification.owner.name} />
                            <AvatarFallback>{verification.owner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{verification.owner.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{verification.completionDate}</TableCell>
                      <TableCell>
                        <Badge variant={verification.outcome === "Approved" ? "success" : "destructive"}>
                          {verification.outcome === "Approved" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {verification.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs line-clamp-2">{verification.notes}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileCheck className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
