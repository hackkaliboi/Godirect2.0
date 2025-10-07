import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { conversationsApi } from "@/lib/api";
import { toast } from "sonner";
import { ConversationWithMessages } from "@/types/database";
import UnifiedMessaging from "@/components/messages/UnifiedMessaging";

export default function UserMessages() {
  return <UnifiedMessaging />;
}
