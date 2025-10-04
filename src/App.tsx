import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetails from "./pages/PropertyDetails";
import ListProperty from "./pages/ListProperty";
import ListPropertyProtected from "./pages/ListPropertyProtected";
import NotFound from "./pages/NotFound";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

// Dashboard Pages
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { UserDashboard } from "./pages/dashboard/UserDashboard";
import { AgentDashboard } from "./pages/dashboard/AgentDashboard";

// Admin Pages
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminReports from "./pages/admin/AdminReports";
import AdminSystem from "./pages/admin/AdminSystem";
import AdminProperties from "./pages/admin/AdminProperties";

// Auth Pages
import Login from "./pages/Login";
import UserLogin from "./pages/auth/UserLogin";
import UserSignup from "./pages/auth/UserSignup";
import AgentLogin from "./pages/auth/AgentLogin";
import AgentSignup from "./pages/auth/AgentSignup";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DiagnosticTest from "./components/DiagnosticTest";

// Context Providers
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoadingWrapper } from "./components/layout/LoadingWrapper";
import RouteWrapper from "./components/layout/RouteWrapper";

const App = () => {
  // Create QueryClient instance inside the component
  const queryClient = new QueryClient();

  // Add debugging to see which routes are being matched
  const location = useLocation();
  console.log("Current location:", location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoadingWrapper initialLoading={true} loadingDelay={2500}>
          <AuthProvider>
            <ThemeProvider>
              <CurrencyProvider>
                <Routes>
                  {/* Authentication routes with navigation but no footer */}
                  <Route path="/login" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><Login /></RouteWrapper>} />
                  <Route path="/user-login" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><UserLogin /></RouteWrapper>} />
                  <Route path="/user-signup" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><UserSignup /></RouteWrapper>} />
                  <Route path="/agent-login" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><AgentLogin /></RouteWrapper>} />
                  <Route path="/agent-signup" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><AgentSignup /></RouteWrapper>} />
                  <Route path="/admin-login" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><AdminLogin /></RouteWrapper>} />
                  <Route path="/forgot-password" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><ForgotPassword /></RouteWrapper>} />
                  <Route path="/reset-password" element={<RouteWrapper includeAuthNavigation={true} includeFooter={false}><ResetPassword /></RouteWrapper>} />

                  {/* Dashboard routes without header/footer */}
                  <Route
                    path="/admin-dashboard/*"
                    element={
                      <RouteWrapper includeNavigation={false} includeFooter={false}>
                        <RequireAuth requiredUserType="admin">
                          <AdminDashboard />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />
                  <Route
                    path="/user-dashboard/*"
                    element={
                      <RouteWrapper includeNavigation={false} includeFooter={false}>
                        <RequireAuth requiredUserType="user">
                          <UserDashboard />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />
                  <Route
                    path="/agent-dashboard/*"
                    element={
                      <RouteWrapper includeNavigation={false} includeFooter={false}>
                        <RequireAuth requiredUserType="agent">
                          <AgentDashboard />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />

                  {/* New dashboard routes matching sidebar structure */}
                  <Route
                    path="/dashboard/admin/*"
                    element={
                      <RouteWrapper includeNavigation={false} includeFooter={false}>
                        <RequireAuth requiredUserType="admin">
                          <AdminDashboard />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />
                  <Route
                    path="/dashboard/user/*"
                    element={
                      <RouteWrapper includeNavigation={false} includeFooter={false}>
                        <RequireAuth requiredUserType="user">
                          <UserDashboard />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />
                  <Route
                    path="/dashboard/agent/*"
                    element={
                      <RouteWrapper includeNavigation={false} includeFooter={false}>
                        <RequireAuth requiredUserType="agent">
                          <AgentDashboard />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />

                  {/* Preview routes for dashboards (no authentication required) */}
                  <Route path="/preview/dashboard/admin/*" element={<RouteWrapper includeNavigation={false} includeFooter={false}><AdminDashboard /></RouteWrapper>} />
                  <Route path="/preview/dashboard/user/*" element={<RouteWrapper includeNavigation={false} includeFooter={false}><UserDashboard /></RouteWrapper>} />
                  <Route path="/preview/dashboard/agent/*" element={<RouteWrapper includeNavigation={false} includeFooter={false}><AgentDashboard /></RouteWrapper>} />

                  {/* Public routes with header/footer */}
                  <Route path="/" element={<RouteWrapper><Index /></RouteWrapper>} />
                  <Route path="/properties" element={<RouteWrapper><PropertyListings /></RouteWrapper>} />
                  <Route path="/properties/:id" element={<RouteWrapper><PropertyDetails /></RouteWrapper>} />
                  <Route path="/list-property" element={<RouteWrapper><ListProperty /></RouteWrapper>} />
                  <Route
                    path="/list-property-protected"
                    element={
                      <RouteWrapper>
                        <RequireAuth>
                          <ListPropertyProtected />
                        </RequireAuth>
                      </RouteWrapper>
                    }
                  />
                  <Route path="*" element={<RouteWrapper><NotFound /></RouteWrapper>} />
                </Routes>
              </CurrencyProvider>
            </ThemeProvider>
          </AuthProvider>
        </LoadingWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;