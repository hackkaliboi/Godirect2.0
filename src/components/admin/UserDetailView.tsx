import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  CreditCard,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Edit,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { conversationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import UnifiedMessaging from "@/components/messages/UnifiedMessaging";

interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  status: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserProperty {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
}

interface UserTransaction {
  id: string;
  property_id: string;
  price: number;
  status: string;
  created_at: string;
}

interface UserInquiry {
  id: string;
  property_id: string;
  message: string;
  status: string;
  created_at: string;
}

export function UserDetailView({ userId, onBack }: UserDetailViewProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<UserProperty[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMessaging, setShowMessaging] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    console.log("UserDetailView state updated:", { showMessaging, conversationId });
  }, [showMessaging, conversationId]);

  useEffect(() => {
    console.log("conversationId state changed to:", conversationId);
  }, [conversationId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Fetch user properties (where user is the agent)
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('id, title, price, status, created_at')
          .eq('agent_id', userId);

        if (propertiesError) throw propertiesError;
        setProperties(propertiesData || []);

        // Fetch user transactions
        const { data: transactionsData, error: transactionsError } = await (supabase as any)
          .from('property_transactions')
          .select('id, property_id, price, status, created_at')
          .or(`buyer_id.eq.${userId},seller_id.eq.${userId},agent_id.eq.${userId}`);

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Fetch user inquiries
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('property_inquiries')
          .select('id, property_id, message, status, created_at')
          .eq('user_id', userId);

        if (inquiriesError) throw inquiriesError;
        setInquiries(inquiriesData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching user data for userId:", userId);
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "suspended":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getTransactionStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const startConversation = async () => {
    try {
      console.log("Starting conversation with user:", userId);
      console.log("Current user:", user);
      // Create a direct conversation with the user
      // Include the user ID in the title so the user can find it
      const conversation = await conversationsApi.createDirectConversation(
        userId,
        `Message from Admin: ${user?.full_name || 'User'} (${userId})`
      );
      console.log("Created conversation:", conversation);
      console.log("Setting conversationId to:", conversation.id);
      setConversationId(conversation.id);
      setShowMessaging(true);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      alert("Failed to start conversation. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>User not found</p>
        <Button onClick={onBack} className="mt-4">Back to Users</Button>
      </div>
    );
  }

  // Show messaging interface if requested
  if (showMessaging) {
    console.log("Showing messaging interface with conversationId:", conversationId);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowMessaging(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Details
          </Button>
        </div>
        <div className="text-lg font-semibold">
          Messaging with {user?.full_name || 'User'}
        </div>
        <UnifiedMessaging conversationId={conversationId || undefined} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Users
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={startConversation}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button
            onClick={() => {
              // In a real implementation, this would open an edit user form
              console.log("Edit user", userId);
              alert(`In a full implementation, this would open a form to edit user details for user ID: ${userId}`);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>
                {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.full_name || 'Unnamed User'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
                <Badge variant="secondary">
                  {user.user_type}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {format(new Date(user.created_at), 'PPP')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="properties">
        <TabsList>
          <TabsTrigger value="properties">Properties ({properties.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries ({inquiries.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Home className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No properties listed by this user</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Listed on {format(new Date(property.created_at), 'PPP')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{property.price.toLocaleString()}</p>
                        <Badge variant="secondary">{property.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No transactions found for this user</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionStatusIcon(transaction.status)}
                        <div>
                          <h3 className="font-medium">Transaction #{transaction.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transaction.created_at), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{transaction.price.toLocaleString()}</p>
                        <Badge variant="secondary">{transaction.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry History</CardTitle>
            </CardHeader>
            <CardContent>
              {inquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No inquiries made by this user</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Property Inquiry</h3>
                        <Badge variant="secondary">{inquiry.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(new Date(inquiry.created_at), 'PPP')}
                      </p>
                      <p className="text-sm">{inquiry.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Activity logs will appear here</p>
                <p className="text-sm mt-2">Track user login history and actions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}