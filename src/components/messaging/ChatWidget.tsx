import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreHorizontal,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { conversationsApi } from '@/lib/api';
import { ConversationWithMessages, Message } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ChatWidgetProps {
  propertyId?: string;
  agentId?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, showAvatar }) => {
  return (
    <div className={`flex gap-2 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {showAvatar && !isOwnMessage && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isOwnMessage ? 'text-right' : 'text-left'}`}>
        <div
          className={`
            inline-block px-4 py-2 rounded-2xl
            ${isOwnMessage 
              ? 'bg-realty-800 text-white rounded-br-md' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
            }
          `}
        >
          <p className="text-sm">{message.message_text}</p>
          {message.message_type === 'image' && message.file_url && (
            <img 
              src={message.file_url} 
              alt="Shared image" 
              className="mt-2 max-w-full h-auto rounded-lg"
            />
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          {isOwnMessage && message.read_at && (
            <span className="ml-2 text-realty-600">✓ Read</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  propertyId, 
  agentId, 
  isOpen, 
  onToggle, 
  onClose 
}) => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ConversationWithMessages | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && user && propertyId && agentId) {
      initializeConversation();
    }
  }, [isOpen, user, propertyId, agentId]);

  const initializeConversation = async () => {
    if (!user || !propertyId || !agentId) return;

    try {
      setIsLoading(true);
      
      // First, try to find existing conversation
      const conversations = await conversationsApi.getConversations(user.id);
      const existingConversation = conversations.find(
        conv => conv.property_id === propertyId && conv.agent_id === agentId
      );

      if (existingConversation) {
        setConversation(existingConversation);
        setMessages(existingConversation.messages || []);
        
        // Mark messages as read
        await conversationsApi.markMessagesAsRead(existingConversation.id);
      } else {
        // Create new conversation
        const newConversation = await conversationsApi.createConversation(
          propertyId, 
          user.id, 
          agentId
        );
        setConversation(newConversation);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || !user) return;

    try {
      const message = await conversationsApi.sendMessage({
        conversation_id: conversation.id,
        message_text: newMessage.trim()
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Create notification for agent
      // This would typically be handled by a backend trigger
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversation) return;

    // Here you would upload the file to Supabase Storage
    // and then send a message with the file URL
    toast.info('File upload feature coming soon');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          className="bg-realty-800 hover:bg-realty-900 text-white rounded-full p-4 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        {/* Chat Header */}
        <CardHeader className="p-4 bg-realty-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={conversation?.agent?.image} />
                <AvatarFallback>
                  {conversation?.agent?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">
                  {conversation?.agent?.name || 'Agent'}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-300">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-realty-700 p-1"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-realty-700 p-1"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {conversation?.property && (
            <div className="mt-2 p-2 bg-realty-700 rounded-lg">
              <p className="text-xs text-gray-300 mb-1">Discussing:</p>
              <p className="text-sm font-medium truncate">
                {conversation.property.title}
              </p>
              <p className="text-xs text-realty-gold">
                ₦{conversation.property.price.toLocaleString()}
              </p>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <CardContent className="p-0 flex-1 flex flex-col h-[440px]">
              <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-realty-800"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-sm">
                      Start a conversation about this property
                    </p>
                  </div>
                ) : (
                  <div>
                    {messages.map((message, index) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
                      
                      return (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwnMessage={isOwnMessage}
                          showAvatar={showAvatar}
                        />
                      );
                    })}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-realty-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="border-gray-300 focus:border-realty-800"
                    />
                  </div>
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-realty-800 hover:bg-realty-900 text-white"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </div>
            </CardContent>

            {/* Quick Actions */}
            <div className="p-3 border-t bg-gray-50 dark:bg-gray-900 rounded-b-lg">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <Video className="w-3 h-3 mr-1" />
                  Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget;
