
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Send, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const conversations = [
  {
    id: 1,
    agent: "Sarah Johnson",
    avatar: "/placeholder.svg",
    property: "Modern Downtown Apartment",
    lastMessage: "Hi Alex, I'm available to show the apartment tomorrow at 2 PM if that works for you?",
    timestamp: "10:45 AM",
    unread: true,
  },
  {
    id: 2,
    agent: "David Martinez",
    avatar: "/placeholder.svg",
    property: "Suburban Family Home",
    lastMessage: "I've scheduled the home inspection for Monday. Let me know if you have any questions!",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    agent: "Jennifer Williams",
    avatar: "/placeholder.svg",
    property: "Luxury Waterfront Condo",
    lastMessage: "The seller has accepted your offer! I'll send over the paperwork shortly.",
    timestamp: "Jun 12",
    unread: false,
  },
  {
    id: 4,
    agent: "Robert Brown",
    avatar: "/placeholder.svg",
    property: "Cozy Studio Apartment",
    lastMessage: "Thanks for your interest. Would you like to schedule a viewing?",
    timestamp: "Jun 10",
    unread: false,
  },
];

// Messages for the selected conversation
const messages = [
  {
    id: 1,
    sender: "agent",
    text: "Hello Alex! Thank you for your interest in the Modern Downtown Apartment.",
    timestamp: "Jun 13, 9:30 AM",
  },
  {
    id: 2,
    sender: "user",
    text: "Hi Sarah, I'm really interested in the property. Is it possible to schedule a viewing?",
    timestamp: "Jun 13, 9:45 AM",
  },
  {
    id: 3,
    sender: "agent",
    text: "Absolutely! I have availability tomorrow at 10 AM or 2 PM. Would either of those times work for you?",
    timestamp: "Jun 13, 10:00 AM",
  },
  {
    id: 4,
    sender: "user",
    text: "2 PM would work perfectly for me. How long do you think the viewing will take?",
    timestamp: "Jun 13, 10:15 AM",
  },
  {
    id: 5,
    sender: "agent",
    text: "Great! We usually allow about 30-45 minutes for a thorough viewing. I'll send you the address and parking details shortly.",
    timestamp: "Jun 13, 10:20 AM",
  },
  {
    id: 6,
    sender: "agent",
    text: "Hi Alex, I'm available to show the apartment tomorrow at 2 PM if that works for you?",
    timestamp: "Today, 10:45 AM",
  },
];

export default function UserMessages() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with real estate agents about properties
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[300px_1fr] h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-border">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-8" />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(600px-56px)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-start p-4 gap-3 cursor-pointer hover:bg-muted/50 ${
                    conversation.id === 1 ? "bg-muted" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} alt={conversation.agent} />
                    <AvatarFallback>{conversation.agent.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">{conversation.agent}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {conversation.timestamp}
                      </p>
                    </div>
                    
                    <p className="text-xs text-primary truncate">
                      {conversation.property}
                    </p>
                    
                    <div className="flex items-center mt-1">
                      <p className={`text-sm truncate ${
                        conversation.unread ? "font-medium" : "text-muted-foreground"
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <div className="ml-2 w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-primary">Modern Downtown Apartment</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      message.sender === "user" 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Type your message..." 
                  className="min-h-[60px] resize-none"
                />
                <Button className="h-[60px] w-[60px]" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
