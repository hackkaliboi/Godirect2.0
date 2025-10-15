import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeMessages, useRealtimeConversations } from "@/hooks/useRealtimeMessages";
import { conversationsApi } from "@/lib/api";
import { Message, ConversationWithMessages } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageCircle, User, Bot, Search, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RealtimeChatProps {
  conversationId?: string;
  propertyId?: string;
  onConversationCreated?: (conversationId: string) => void;
  onConversationDeleted?: () => void;
}

const RealtimeChat = ({ 
  conversationId: initialConversationId, 
  propertyId, 
  onConversationCreated,
  onConversationDeleted
}: RealtimeChatProps) => {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId || null);
  const [message, setMessage] = useState("");
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading: messagesLoading, newMessage } = useRealtimeMessages(conversationId, user?.id || null);
  const { conversations, loading: conversationsLoading } = useRealtimeConversations(user?.id || null);
  
  const currentConversation = conversations.find(conv => conv.id === conversationId) || null;

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    const title = conv.property?.title || conv.title || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;
    
    try {
      // If no conversation exists, create one first
      let convId = conversationId;
      if (!convId && propertyId) {
        setIsCreatingConversation(true);
        const newConversation = await conversationsApi.createConversation(propertyId, user.id);
        convId = newConversation.id;
        setConversationId(convId);
        if (onConversationCreated) {
          onConversationCreated(convId);
        }
        setIsCreatingConversation(false);
      }
      
      if (!convId) return;
      
      // Send the message
      await conversationsApi.sendMessage({
        conversation_id: convId,
        message_text: message.trim(),
        message_type: 'text'
      });
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }
    
    try {
      // Delete conversation (this would need to be implemented in the API)
      // For now, we'll just remove it from the local state
      if (conversationId === convId) {
        setConversationId(null);
        if (onConversationDeleted) {
          onConversationDeleted();
        }
      }
      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  // If no conversation ID is provided and no property ID, show conversation selector
  if (!conversationId && !propertyId) {
    return (
      <div className="flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex">
            {/* Conversation List */}
            <div className="w-1/3 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-realty-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                {conversationsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <MessageCircle className="h-12 w-12 text-realty-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-realty-600 dark:text-realty-400">
                      Start a conversation by messaging about a property.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={cn(
                          "p-4 cursor-pointer hover:bg-realty-50 dark:hover:bg-realty-800 transition-colors",
                          conversationId === conversation.id && "bg-realty-100 dark:bg-realty-800"
                        )}
                        onClick={() => setConversationId(conversation.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={conversation.user?.avatar_url || undefined} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h4 className="font-medium truncate">
                                {conversation.property?.title || conversation.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                  handleDeleteConversation(conversation.id);
                }}
                              >
                                <Trash2 className="h-3 w-3 text-realty-500" />
                              </Button>
                            </div>
                            <p className="text-sm text-realty-600 dark:text-realty-400 truncate">
                              {conversation.messages?.[conversation.messages.length - 1]?.message_text || "No messages yet"}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-realty-500">
                            {conversation.last_message_at 
                              ? format(new Date(conversation.last_message_at), 'MMM d')
                              : format(new Date(conversation.created_at), 'MMM d')}
                          </div>
                          {conversation.messages && conversation.messages.some(m => !m.read_at) && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Chat Area */}
            <div className="w-2/3 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <MessageCircle className="h-16 w-16 text-realty-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                  <p className="text-realty-600 dark:text-realty-400">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        {/* Conversation Header */}
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            {currentConversation?.property ? (
              <>
                <div className="relative">
                  {currentConversation.property.images?.[0] ? (
                    <img 
                      src={currentConversation.property.images[0]} 
                      alt={currentConversation.property.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-realty-200 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-realty-600" />
                    </div>
                  )}
                </div>
                <div>
                  <div>{currentConversation.property.title}</div>
                  <div className="text-sm font-normal text-realty-600 dark:text-realty-400">
                    {currentConversation.property.city}, {currentConversation.property.state}
                  </div>
                </div>
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                {currentConversation?.title || "Chat"}
              </>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConversationId(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        {/* Messages Area */}
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageCircle className="h-12 w-12 text-realty-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-realty-600 dark:text-realty-400">
                  Be the first to start the conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-3",
                      msg.sender_id === user?.id ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender_id !== user?.id && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={(msg as any).sender?.avatar_url || undefined} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      msg.sender_id === user?.id 
                        ? "bg-realty-800 text-white rounded-br-none" 
                        : "bg-realty-100 dark:bg-realty-800 text-realty-900 dark:text-white rounded-bl-none"
                    )}>
                      <p className="whitespace-pre-wrap">{msg.message_text}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        msg.sender_id === user?.id ? "text-realty-200" : "text-realty-500"
                      )}>
                        {format(new Date(msg.created_at), 'h:mm a')}
                      </p>
                    </div>
                    {msg.sender_id === user?.id && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={(msg as any).sender?.avatar_url || undefined} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isCreatingConversation || !conversationId}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || isCreatingConversation || !conversationId}
                className="bg-realty-800 hover:bg-realty-900"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeChat;