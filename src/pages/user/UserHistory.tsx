import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, MapPin, Filter, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { searchHistoryApi } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import UnifiedSearchHistory from "@/components/searches/UnifiedSearchHistory";

export default function UserHistory() {
  return <UnifiedSearchHistory />;
}