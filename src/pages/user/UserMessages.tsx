import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { conversationsApi } from "@/lib/api";
import { toast } from "sonner";
import { ConversationWithMessages } from "@/types/database";

export default function UserMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversationsApi.getConversations(user!.id);
      setConversations(data);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError(err.message || "Failed to load messages");
      toast.error("Failed to load messages: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your messages</div>;
  }

  return (
    <div>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <span className="break-words">Messages</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Communicate with property owners and managers
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow whitespace-nowrap">
            <Send className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button onClick={loadConversations}>Retry</Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start conversations about properties you're interested in
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Ask questions about specific properties</p>
              <p>• Schedule viewings and meetings</p>
              <p>• Get expert advice from property owners</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{conversation.property?.title || 'Property Inquiry'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {conversation.messages?.[0]?.message_text?.substring(0, 50) || 'No messages yet'}
                          {conversation.messages?.[0]?.message_text?.length > 50 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {conversation.last_message_at 
                          ? new Date(conversation.last_message_at).toLocaleDateString() 
                          : 'No messages'}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}