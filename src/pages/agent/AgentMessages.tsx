import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Search } from "lucide-react";

export default function AgentMessages() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              Messages
            </h1>
            <p className="text-muted-foreground">
              Communicate with clients and manage inquiries
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Send className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground mb-4">
            Client messages and property inquiries will appear here
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Receive property inquiries from interested buyers</p>
            <p>• Chat with existing clients about their needs</p>
            <p>• Send property updates and market information</p>
          </div>
        </div>
      </div>
  );
}