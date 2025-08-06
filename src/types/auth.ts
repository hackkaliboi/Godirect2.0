import { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userType: "admin" | "agent" | "user" | null;
  signOut: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);