import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetails from "./pages/PropertyDetails";
import Agents from "./pages/Agents";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AgentDashboard from "./pages/AgentDashboard";

// Auth Pages
import UserLogin from "./pages/auth/UserLogin";
import UserSignup from "./pages/auth/UserSignup";
import AgentLogin from "./pages/auth/AgentLogin";
import AgentSignup from "./pages/auth/AgentSignup";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Auth Context
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

const App = () => {
  // Create QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            {/* Authentication routes without header/footer */}
            <Route path="/login" element={<Navigate to="/user-login" replace />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-signup" element={<UserSignup />} />
            <Route path="/agent-login" element={<AgentLogin />} />
            <Route path="/agent-signup" element={<AgentSignup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard routes without header/footer */}
            <Route 
              path="/admin-dashboard/*" 
              element={
                <RequireAuth requiredUserType="admin">
                  <AdminDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/user-dashboard/*" 
              element={
                <RequireAuth requiredUserType="user">
                  <UserDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/agent-dashboard/*" 
              element={
                <RequireAuth requiredUserType="agent">
                  <AgentDashboard />
                </RequireAuth>
              } 
            />
            
            {/* Public routes with header/footer */}
            <Route
              path="/"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <Index />
                  </main>
                  <Footer />
                </div>
              }
            />
            
            <Route
              path="/properties"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <PropertyListings />
                  </main>
                  <Footer />
                </div>
              }
            />
            
            <Route
              path="/properties/:id"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <PropertyDetails />
                  </main>
                  <Footer />
                </div>
              }
            />
            
            <Route
              path="/agents"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <Agents />
                  </main>
                  <Footer />
                </div>
              }
            />
            
            <Route
              path="/about"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <About />
                  </main>
                  <Footer />
                </div>
              }
            />
            
            <Route
              path="/contact"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <Contact />
                  </main>
                  <Footer />
                </div>
              }
            />
            
            <Route
              path="*"
              element={
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                    <NotFound />
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
