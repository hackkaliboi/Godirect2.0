import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  LifeBuoy, 
  MessageSquare, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Link2,
  Edit,
  Trash2,
  Send
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const supportTickets = [
  { 
    id: "T-2835",
    subject: "Unable to upload property photos",
    status: "open",
    priority: "high",
    user: "John Doe",
    email: "john.doe@example.com",
    created: "2023-04-01T10:30:00",
    lastUpdate: "2023-04-02T14:15:00",
    department: "Technical Support",
    messages: [
      {
        user: "John Doe",
        isAgent: false,
        message: "I'm trying to upload photos for my new property listing but keep getting an error message.",
        time: "2023-04-01T10:30:00"
      },
      {
        user: "Sarah Johnson",
        isAgent: true,
        message: "Hello John, can you please provide more details about the error message you're seeing? Also, what file format and size are your images?",
        time: "2023-04-01T11:45:00"
      },
      {
        user: "John Doe",
        isAgent: false,
        message: "The error says 'Upload failed'. I'm trying to upload JPG files that are about 2MB each.",
        time: "2023-04-01T13:20:00"
      },
      {
        user: "Sarah Johnson",
        isAgent: true,
        message: "Thanks for the information. Our system allows JPG files up to 5MB, so size shouldn't be the issue. Let me investigate this further. In the meantime, can you try uploading from a different browser?",
        time: "2023-04-02T14:15:00"
      }
    ]
  },
  { 
    id: "T-2836",
    subject: "Payment not reflecting in account",
    status: "pending",
    priority: "medium",
    user: "Alice Smith",
    email: "alice.smith@example.com",
    created: "2023-04-02T09:15:00",
    lastUpdate: "2023-04-03T11:30:00",
    department: "Billing",
    messages: [
      {
        user: "Alice Smith",
        isAgent: false,
        message: "I made a payment yesterday but it's not showing in my account.",
        time: "2023-04-02T09:15:00"
      }
    ]
  },
  { 
    id: "T-2834",
    subject: "Need help with contract template",
    status: "closed",
    priority: "low",
    user: "Robert Brown",
    email: "robert.brown@example.com",
    created: "2023-03-30T15:45:00",
    lastUpdate: "2023-04-01T10:20:00",
    department: "Legal",
    messages: [
      {
        user: "Robert Brown",
        isAgent: false,
        message: "I need assistance with the rental agreement template.",
        time: "2023-03-30T15:45:00"
      }
    ]
  },
  { 
    id: "T-2837",
    subject: "Commission calculation discrepancy",
    status: "open",
    priority: "high",
    user: "Michael Wilson",
    email: "michael.wilson@example.com",
    created: "2023-04-03T08:00:00",
    lastUpdate: "2023-04-03T16:45:00",
    department: "Finance",
    messages: [
      {
        user: "Michael Wilson",
        isAgent: false,
        message: "There seems to be an error in my commission calculation for last month.",
        time: "2023-04-03T08:00:00"
      }
    ]
  },
];

const knowledgeBaseArticles = [
  {
    id: 1,
    title: "How to List a New Property",
    category: "Listings",
    author: "Admin Team",
    date: "2023-02-15",
    excerpt: "Step-by-step guide to listing a new property on the platform."
  },
  {
    id: 2,
    title: "Understanding Commission Structures",
    category: "Finance",
    author: "Finance Team",
    date: "2023-02-10",
    excerpt: "Detailed explanation of how agent commissions are calculated."
  },
  {
    id: 3,
    title: "Managing Client Communications",
    category: "Client Relations",
    author: "Support Team",
    date: "2023-03-05",
    excerpt: "Best practices for maintaining effective client communications."
  },
  {
    id: 4,
    title: "Property Image Guidelines",
    category: "Listings",
    author: "Marketing Team",
    date: "2023-03-22",
    excerpt: "Guidelines for high-quality property images that attract buyers."
  },
  {
    id: 5,
    title: "Using the Document Signing Tool",
    category: "Legal",
    author: "Legal Team",
    date: "2023-04-01",
    excerpt: "Instructions for using the electronic document signing feature."
  }
];

interface SupportCenterProps {
  initialTab?: "tickets" | "knowledge" | "team";
}

export default function SupportCenter({ initialTab = "tickets" }: SupportCenterProps) {
  const [selectedTicket, setSelectedTicket] = useState(supportTickets[0]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSendReply = () => {
    if (replyText.trim()) {
      setReplyText("");
      // In a real app, this would send the reply to the backend
      // and update the ticket
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground">
          Manage support tickets and knowledge base articles
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="team">Team Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Tickets</CardTitle>
                  <Button size="sm" className="h-8">+ New Ticket</Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search tickets..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  {supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-3 border-b cursor-pointer hover:bg-muted transition-colors ${selectedTicket.id === ticket.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium truncate flex-1">{ticket.subject}</div>
                        <span className="text-xs text-muted-foreground">{ticket.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground truncate">{ticket.user}</div>
                        <div className="flex gap-1">
                          <Badge className={`${getStatusColor(ticket.status)}`} variant="outline">
                            {ticket.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(ticket.priority)}`} variant="outline">
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Last updated: {new Date(ticket.lastUpdate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription>Ticket {selectedTicket.id} • {selectedTicket.department}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue={selectedTicket.status}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue={selectedTicket.priority}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Requester:</span>
                    <span>{selectedTicket.user} ({selectedTicket.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(selectedTicket.created)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <ScrollArea className="h-[calc(100vh-500px)]">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.isAgent ? 'justify-start' : 'justify-start'}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.user}`} />
                          <AvatarFallback>{message.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[80%] rounded-lg p-3 ${message.isAgent ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium text-sm">
                              {message.user} {message.isAgent && <Badge variant="outline" className="ml-2">Staff</Badge>}
                            </div>
                            <div className="text-xs opacity-70">{formatDate(message.time)}</div>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <Textarea 
                    placeholder="Type your reply here..." 
                    className="min-h-[100px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Templates
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link2 className="mr-2 h-4 w-4" />
                        Attach
                      </Button>
                    </div>
                    <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                      <Send className="mr-2 h-4 w-4" /> 
                      Send Reply
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search knowledge base..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="listings">Listings</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="client">Client Relations</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {knowledgeBaseArticles.map(article => (
              <Card key={article.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardDescription>
                    By {article.author} • {new Date(article.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">Read Full Article</Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Chat</CardTitle>
              <CardDescription>
                Internal communication channel for support team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Team Chat Feature</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This feature will enable real-time communication between support team members.
                  Perfect for collaborating on complex tickets or sharing important information.
                </p>
                <Button className="mt-4">
                  Launch Team Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
