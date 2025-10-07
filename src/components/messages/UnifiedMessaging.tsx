import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { conversationsApi } from "@/lib/api";
import { ConversationWithMessages, Message } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UnifiedMessagingProps {
    conversationId?: string;
}

export default function UnifiedMessaging({ conversationId }: UnifiedMessagingProps) {
    const { user } = useAuth();
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
            loadConversations();
        }
    }, [user]);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(c => c.id === conversationId);
            if (conversation) {
                setSelectedConversation(conversation);
            }
        }
    }, [conversationId, conversations]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await conversationsApi.getConversations(user!.id);
            setConversations(data);

            // If there's a conversationId in the URL, select it
            if (conversationId && data.length > 0) {
                const conversation = data.find(c => c.id === conversationId);
                if (conversation) {
                    setSelectedConversation(conversation);
                }
            }
        } catch (err) {
            console.error("Error loading conversations:", err);
            setError(err.message || "Failed to load messages");
            toast.error("Failed to load messages: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedConversation || sending) return;

        try {
            setSending(true);
            await conversationsApi.sendMessage({
                conversation_id: selectedConversation.id,
                message_text: message.trim()
            });

            // Refresh the conversation
            await loadConversations();

            // Clear the message input
            setMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
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

    const filteredConversations = conversations.filter(conversation => {
        if (!searchTerm) return true;
        const propertyTitle = conversation.property?.title?.toLowerCase() || "";
        const lastMessage = conversation.messages?.[0]?.message_text?.toLowerCase() || "";
        return propertyTitle.includes(searchTerm.toLowerCase()) ||
            lastMessage.includes(searchTerm.toLowerCase());
    });

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

                {/* Information about messaging system */}
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    How Messaging Works
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    Start conversations by inquiring about properties. Property owners will respond to your messages here.
                                    You can send text messages, schedule calls, or arrange property viewings.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                                "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                                                selectedConversation?.id === conversation.id ? "bg-muted" : ""
                                            )}
                                            onClick={() => setSelectedConversation(conversation)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={conversation.property?.images?.[0]} />
                                                    <AvatarFallback>
                                                        <User className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between">
                                                        <h3 className="font-medium truncate">
                                                            {conversation.property?.title || 'Property Inquiry'}
                                                        </h3>
                                                        {conversation.last_message_at && (
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                                {format(new Date(conversation.last_message_at), 'HH:mm')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {conversation.messages?.[0]?.message_text?.substring(0, 50) || 'No messages yet'}
                                                        {conversation.messages?.[0]?.message_text?.length > 50 ? '...' : ''}
                                                    </p>
                                                </div>
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
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={selectedConversation.property?.images?.[0]} />
                                            <AvatarFallback>
                                                <User className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium">{selectedConversation.property?.title || 'Property Inquiry'}</h3>
                                            <p className="text-sm text-muted-foreground">Property Owner</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Video className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {selectedConversation.messages?.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex",
                                                    msg.sender_type === 'user' ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "max-w-[80%] rounded-lg px-4 py-2",
                                                        msg.sender_type === 'user'
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"
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
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                <div className="p-4 border-t">
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1 relative">
                                            <Input
                                                placeholder="Type your message..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
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
                                            onClick={handleSendMessage}
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