import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, User } from "lucide-react";

export default function UserMessages() {
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
              Communicate with agents and property managers
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow whitespace-nowrap">
            <Send className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start conversations with agents about properties you're interested in
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Ask questions about specific properties</p>
            <p>• Schedule viewings and meetings</p>
            <p>• Get expert advice from real estate professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
}