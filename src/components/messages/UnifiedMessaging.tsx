import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { conversationsApi } from "@/lib/api";
import { ConversationWithMessages, Message } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
    MessageSquare,
    Send,
    User,
    Loader2,
    Paperclip,
    Smile,
    MoreVertical,
    Phone,
    Video,
    Search,
    X,
    Info,
    Trash2,
    Home,
    MapPin,
    Tag,
    Bed,
    Bath
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UnifiedMessagingProps {
    conversationId?: string;
}

export default function UnifiedMessaging({ conversationId }: UnifiedMessagingProps) {
    console.log("UnifiedMessaging mounted with conversationId:", conversationId);
    const { user } = useAuth();
    console.log("Current user from AuthContext:", user);
    const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationWithMessages | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            console.log("Loading conversations for user:", user);
            loadConversations();
        }
    }, [user]);

    useEffect(() => {
        console.log("conversationId changed to:", conversationId);
        console.log("conversations length:", conversations.length);
        // Select conversation when conversations are loaded or when conversationId changes
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(c => c.id === conversationId);
            console.log("Trying to select conversation", conversationId, "found:", conversation);
            if (conversation) {
                console.log("Selecting conversation:", conversation);
                console.log("Conversation messages:", conversation.messages);
                setSelectedConversation(conversation);
            } else {
                console.log("Conversation not found in loaded data");
                // If conversation not found, try to load it directly
                loadSingleConversation(conversationId);
            }
        } else if (conversationId && conversations.length === 0) {
            // If we have a conversationId but no conversations loaded, load this specific conversation
            console.log("Loading specific conversation", conversationId);
            loadSingleConversation(conversationId);
        } else {
            console.log("Either no conversationId or no conversations loaded");
        }
    }, [conversationId, conversations]);

    useEffect(() => {
        console.log("Selected conversation changed:", selectedConversation);
    }, [selectedConversation]);

    useEffect(() => {
        console.log("Scrolling to bottom");
        scrollToBottom();
    }, [selectedConversation?.messages]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await conversationsApi.getConversations(user!.id);
            console.log("Loaded conversations:", data);
            setConversations(data);

            // If there's a conversationId provided, select it
            if (conversationId && data.length > 0) {
                const conversation = data.find(c => c.id === conversationId);
                console.log("Trying to auto-select conversation", conversationId, "found:", conversation);
                if (conversation) {
                    console.log("Auto-selecting conversation:", conversation);
                    console.log("Conversation messages:", conversation.messages);
                    setSelectedConversation(conversation);
                } else {
                    console.log("Conversation not found in loaded data");
                }
            } else {
                console.log("No conversationId provided or no data loaded");
            }
        } catch (err: any) {
            console.error("Error loading conversations:", err);
            console.error("Error details:", {
                message: err.message,
                code: err.code,
                details: err.details,
                hint: err.hint
            });
            setError(err.message || "Failed to load messages");
            toast.error("Failed to load messages: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const loadSingleConversation = async (convId: string) => {
        try {
            console.log("Loading single conversation:", convId);

            // Try to get conversation directly first
            const { data: directData, error: directError } = await supabase
                .from('conversations')
                .select(`
                    *,
                    property:properties(id, title, price, images, city, state, bedrooms, bathrooms, property_type, street),
                    messages(*),
                    user:profiles(id, full_name, avatar_url, email)
                `)
                .eq('id', convId)
                .single();

            if (!directError && directData) {
                console.log("Loaded single conversation directly:", directData);
                setSelectedConversation(directData as ConversationWithMessages);

                // Add this conversation to the conversations list if it's not already there
                setConversations(prev => {
                    if (!prev.find(c => c.id === directData.id)) {
                        return [...prev, directData as ConversationWithMessages];
                    }
                    return prev;
                });
                return;
            }

            // If direct fetch failed, try to get it through messages
            const { data: messageData, error: messageError } = await supabase
                .from('messages')
                .select(`
                    conversation:conversations(*, property:properties(id, title, price, images, city, state, bedrooms, bathrooms, property_type, street), messages(*), user:profiles(id, full_name, avatar_url, email))
                `)
                .eq('conversation_id', convId)
                .limit(1);

            if (!messageError && messageData && messageData.length > 0 && messageData[0].conversation) {
                console.log("Loaded single conversation through messages:", messageData[0].conversation);
                setSelectedConversation(messageData[0].conversation as ConversationWithMessages);

                // Add this conversation to the conversations list if it's not already there
                setConversations(prev => {
                    if (!prev.find(c => c.id === messageData[0].conversation.id)) {
                        return [...prev, messageData[0].conversation as ConversationWithMessages];
                    }
                    return prev;
                });
                return;
            }

            throw directError || messageError || new Error("Conversation not found");
        } catch (err: any) {
            console.error("Error loading single conversation:", err);
            console.error("Error details:", {
                message: err.message,
                code: err.code,
                details: err.details,
                hint: err.hint
            });
            toast.error("Failed to load conversation: " + (err.message || "Unknown error"));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedConversation || sending) return;

        try {
            console.log("Sending message:", {
                conversation_id: selectedConversation.id,
                message_text: message.trim()
            });

            setSending(true);
            const result = await conversationsApi.sendMessage({
                conversation_id: selectedConversation.id,
                message_text: message.trim()
            });

            console.log("Message sent successfully:", result);

            // Refresh just this conversation instead of all conversations
            await loadSingleConversation(selectedConversation.id);

            // Clear the message input
            setMessage("");
        } catch (err: any) {
            console.error("Error sending message:", err);
            console.error("Error details:", {
                message: err.message,
                code: err.code,
                details: err.details,
                hint: err.hint
            });
            toast.error("Failed to send message: " + (err.message || "Unknown error"));
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Refresh conversation list periodically to get new messages
    useEffect(() => {
        if (selectedConversation) {
            const interval = setInterval(() => {
                loadSingleConversation(selectedConversation.id);
            }, 10000); // Refresh every 10 seconds

            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    // Also refresh conversations list periodically
    useEffect(() => {
        if (user) {
            const interval = setInterval(() => {
                loadConversations();
            }, 30000); // Refresh every 30 seconds

            return () => clearInterval(interval);
        }
    }, [user, loadConversations]);

    const filteredConversations = conversations.filter(conversation => {
        if (!searchTerm) return true;
        const propertyTitle = conversation.property?.title?.toLowerCase() || "";
        // Get the most recent message for search
        const messages = conversation.messages || [];
        const lastMessage = messages.length > 0
            ? messages[messages.length - 1]?.message_text?.toLowerCase() || ""
            : "";
        return propertyTitle.includes(searchTerm.toLowerCase()) ||
            lastMessage.includes(searchTerm.toLowerCase());
    });

    // Function to delete a conversation
    const deleteConversation = async (conversationId: string) => {
        if (!window.confirm("Are you sure you want to delete this conversation? This cannot be undone.")) {
            return;
        }

        try {
            await conversationsApi.deleteConversation(conversationId);

            // Remove the conversation from the list
            setConversations(prev => prev.filter(c => c.id !== conversationId));

            // If the deleted conversation was selected, clear the selection
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation(null);
            }

            toast.success("Conversation deleted successfully");
        } catch (error) {
            console.error("Error deleting conversation:", error);
            toast.error("Failed to delete conversation");
        }
    };

    if (!user) {
        return <div>Please log in to view your messages</div>;
    }

    return (
        <div className="flex flex-col h-full">
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

                <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
                    {/* Conversations List */}
                    <div className="lg:w-1/3 flex flex-col border rounded-lg">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search conversations..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <div className="text-red-500 mb-2">Error: {error}</div>
                                    <Button variant="outline" onClick={loadConversations}>Retry</Button>
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                    <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {searchTerm ? "No conversations match your search" : "Start a conversation by inquiring about a property"}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredConversations.map((conversation) => (
                                        <div
                                            key={conversation.id}
                                            className={cn(
                                                "p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200 border-b last:border-b-0 group",
                                                selectedConversation?.id === conversation.id ? "bg-muted border-l-4 border-l-primary" : ""
                                            )}
                                            onClick={() => setSelectedConversation(conversation)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-12 h-12 border border-muted">
                                                    <AvatarImage src={conversation.property?.images?.[0]} />
                                                    <AvatarFallback className="bg-muted">
                                                        <User className="h-5 w-5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between">
                                                        <h3 className="font-medium truncate">
                                                            {conversation.property?.title || conversation.title || 'Direct Message'}
                                                        </h3>
                                                        {conversation.last_message_at && (
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                                {format(new Date(conversation.last_message_at), 'HH:mm')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {conversation.property ? (
                                                        <>
                                                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {conversation.property.street}, {conversation.property.city}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                                    <Tag className="h-2.5 w-2.5 mr-1" />
                                                                    ₦{conversation.property.price?.toLocaleString() || 'N/A'}
                                                                </span>
                                                                {conversation.property.bedrooms && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        <Bed className="h-2.5 w-2.5 mr-1" />
                                                                        {conversation.property.bedrooms}B
                                                                    </span>
                                                                )}
                                                                {conversation.property.bathrooms && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                        <Bath className="h-2.5 w-2.5 mr-1" />
                                                                        {conversation.property.bathrooms}Ba
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="mt-1">
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {(() => {
                                                                    const messages = conversation.messages || [];
                                                                    if (messages.length > 0) {
                                                                        const lastMessage = messages[messages.length - 1];
                                                                        const text = lastMessage?.message_text?.substring(0, 50) || 'No messages yet';
                                                                        return text + (lastMessage?.message_text?.length > 50 ? '...' : '');
                                                                    }
                                                                    return 'No messages yet';
                                                                })()}
                                                            </p>
                                                            {conversation.user && (
                                                                <div className="flex items-center mt-2">
                                                                    <Avatar className="w-5 h-5 mr-2">
                                                                        {conversation.user.avatar_url ? (
                                                                            <AvatarImage src={conversation.user.avatar_url} />
                                                                        ) : (
                                                                            <AvatarFallback className="text-xs">
                                                                                {conversation.user.full_name?.charAt(0) || 'U'}
                                                                            </AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {conversation.user.full_name || conversation.user.email}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteConversation(conversation.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Conversation View */}
                    <div className="lg:w-2/3 flex flex-col border rounded-lg">
                        {selectedConversation ? (
                            <>
                                <div className="p-4 border-b flex items-start justify-between bg-gradient-to-r from-muted/50 to-muted/30 shadow-sm">
                                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                                        <Avatar className="mt-1 w-14 h-14 border-2 border-primary/20">
                                            <AvatarImage src={selectedConversation.property?.images?.[0]} />
                                            <AvatarFallback className="bg-primary/10">
                                                <Home className="h-6 w-6 text-primary" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-heading font-bold text-xl truncate">
                                                {selectedConversation.property?.title || selectedConversation.title || 'Direct Message'}
                                            </h3>
                                            {selectedConversation.property ? (
                                                <>
                                                    <div className="flex items-center text-muted-foreground mt-1">
                                                        <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                                        <span className="truncate text-sm">
                                                            {selectedConversation.property.street}, {selectedConversation.property.city}, {selectedConversation.property.state}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <div className="flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                                                            <Tag className="h-4 w-4 mr-1.5" />
                                                            ₦{selectedConversation.property.price?.toLocaleString() || 'Price not available'}
                                                        </div>
                                                        {selectedConversation.property.bedrooms && (
                                                            <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                                                <Bed className="h-4 w-4 mr-1.5" />
                                                                {selectedConversation.property.bedrooms} {selectedConversation.property.bedrooms === 1 ? 'Bed' : 'Beds'}
                                                            </div>
                                                        )}
                                                        {selectedConversation.property.bathrooms && (
                                                            <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                                                <Bath className="h-4 w-4 mr-1.5" />
                                                                {selectedConversation.property.bathrooms} {selectedConversation.property.bathrooms === 1 ? 'Bath' : 'Baths'}
                                                            </div>
                                                        )}
                                                        {selectedConversation.property.property_type && (
                                                            <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                                                <Home className="h-4 w-4 mr-1.5" />
                                                                {selectedConversation.property.property_type}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-3 text-sm text-muted-foreground flex items-center">
                                                        <span className="font-medium">Property ID:</span>
                                                        <span className="ml-2 font-mono bg-muted px-2 py-1 rounded text-xs">
                                                            {selectedConversation.property.id}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-muted-foreground mt-1">
                                                    Direct Conversation
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-1 ml-2">
                                        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                            <Video className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {selectedConversation.messages?.length > 0 ? (
                                            selectedConversation.messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex",
                                                        msg.sender_type === 'user' ? "justify-end" : "justify-start"
                                                    )}
                                                >
                                                    <div className="flex flex-col max-w-[80%]">
                                                        {msg.sender_type !== 'user' && selectedConversation?.user && (
                                                            <div className="flex items-center mb-1 ml-2">
                                                                <Avatar className="w-6 h-6 mr-2">
                                                                    {selectedConversation.user.avatar_url ? (
                                                                        <AvatarImage src={selectedConversation.user.avatar_url} />
                                                                    ) : (
                                                                        <AvatarFallback className="text-xs bg-muted">
                                                                            {selectedConversation.user.full_name?.charAt(0) || 'U'}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                <span className="text-xs font-medium text-muted-foreground">
                                                                    {selectedConversation.user.full_name || selectedConversation.user.email}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div
                                                            className={cn(
                                                                "rounded-lg px-4 py-2",
                                                                msg.sender_type === 'user'
                                                                    ? "bg-primary text-primary-foreground self-end"
                                                                    : "bg-muted self-start"
                                                            )}
                                                        >
                                                            <p className="text-sm">{msg.message_text}</p>
                                                            <p
                                                                className={cn(
                                                                    "text-xs mt-1",
                                                                    msg.sender_type === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                                                                )}
                                                            >
                                                                {format(new Date(msg.created_at), 'HH:mm')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-muted-foreground py-4">
                                                No messages yet. Start the conversation!
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                <div className="p-4 border-t">
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1 relative">
                                            <Input
                                                placeholder="Type your message..."
                                                value={message}
                                                onChange={(e) => {
                                                    console.log("Message input changed:", e.target.value);
                                                    setMessage(e.target.value);
                                                }}
                                                onKeyPress={handleKeyPress}
                                                className="pr-20"
                                            />
                                            <div className="absolute right-2 bottom-2 flex space-x-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Paperclip className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Smile className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                console.log("Send button clicked");
                                                handleSendMessage();
                                            }}
                                            disabled={!message.trim() || sending}
                                            className="h-10"
                                        >
                                            {sending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                                <p className="text-muted-foreground mb-4">
                                    Choose a conversation from the list to start messaging
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                    <div className="flex flex-col items-center">
                                        <Send className="h-5 w-5 mb-1" />
                                        <span>Send messages</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Phone className="h-5 w-5 mb-1" />
                                        <span>Make calls</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Video className="h-5 w-5 mb-1" />
                                        <span>Video chat</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
