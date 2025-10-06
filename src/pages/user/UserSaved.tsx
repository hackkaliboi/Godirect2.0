import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MapPin, DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UnifiedSearchHistory from "@/components/searches/UnifiedSearchHistory";

export default function UserSaved() {
  return <UnifiedSearchHistory />;
}
