
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, User, Phone, Mail, ExternalLink, Clock, Building, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const inquiry = {
  id: 1,
  propertyId: 1,
  property: {
    id: 1,
    name: "Modern Downtown Apartment",
    address: "123 Main St, Downtown",
    price: "$325,000",
    image: "/placeholder.svg"
  },
  contact: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567"
  },
  date: "2023-06-15T10:30:00",
  message: "I'm interested in viewing this property. Is it available for a showing this weekend? I'm particularly interested in seeing the kitchen and master bathroom. Also, could you tell me more about the neighborhood and nearby amenities?",
  status: "New",
  messages: [
    {
      id: 1,
      sender: "Alex Johnson",
      role: "user",
      message: "I'm interested in viewing this property. Is it available for a showing this weekend? I'm particularly interested in seeing the kitchen and master bathroom. Also, could you tell me more about the neighborhood and nearby amenities?",
      date: "2023-06-15T10:30:00"
    }
  ]
};

const UserInquiryDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleSendReply = () => {
    if (replyText.trim() === "") return;
    
    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setReplyText("");
      toast({
        title: "Reply Sent",
        description: "Your message has been sent successfully.",
      });
      
      // In a real app, we would update the state with the new message
    }, 1000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Link to="/user-dashboard/inquiries">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiry Details</h1>
          <p className="text-muted-foreground">
            View and respond to property inquiry
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Inquiry Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Inquiry from {inquiry.contact.name}</CardTitle>
                <CardDescription>
                  {formatDate(inquiry.date)}
                </CardDescription>
              </div>
              <Badge variant={inquiry.status === "New" ? "default" : "secondary"}>
                {inquiry.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Messages */}
            <div className="space-y-6">
              {inquiry.messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} alt={message.sender} />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">{message.sender}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(message.date)}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Reply Form */}
            <div className="space-y-3">
              <h3 className="font-medium text-base">Your Reply</h3>
              <Textarea 
                placeholder="Type your reply here..." 
                className="min-h-[150px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendReply} 
                  disabled={replyText.trim() === "" || sending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact & Property Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${inquiry.contact.name}`} alt={inquiry.contact.name} />
                  <AvatarFallback>{inquiry.contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{inquiry.contact.name}</h3>
                  <p className="text-sm text-muted-foreground">Potential Buyer</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${inquiry.contact.email}`} className="text-sm hover:underline">
                    {inquiry.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${inquiry.contact.phone}`} className="text-sm hover:underline">
                    {inquiry.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Inquiry received on {new Date(inquiry.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Property Info */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted overflow-hidden rounded-md">
                <img 
                  src={inquiry.property.image} 
                  alt={inquiry.property.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{inquiry.property.name}</h3>
                <p className="text-sm text-muted-foreground">{inquiry.property.address}</p>
                <p className="text-lg font-bold mt-1">{inquiry.property.price}</p>
              </div>
              
              <div className="flex">
                <Button className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Property
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                Schedule a Showing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Send Availability
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
                Mark as Spam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserInquiryDetails;
