
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetails from "./pages/PropertyDetails";
import Agents from "./pages/Agents";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  // Create QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication routes without header/footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard routes without header/footer */}
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            <Route path="/user-dashboard/*" element={<UserDashboard />} />
            <Route path="/agent-dashboard/*" element={<AgentDashboard />} />
            
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
