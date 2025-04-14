
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardPath = location.pathname.includes("dashboard");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => navigate(-1);
  const goHome = () => {
    if (isDashboardPath) {
      // Extract the dashboard type from the path
      const dashboardType = location.pathname.split('/')[1].split('-')[0];
      navigate(`/${dashboardType}-dashboard`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page not found</p>
        
        <Alert className="mb-8" variant="destructive">
          <AlertTitle>Page Not Available</AlertTitle>
          <AlertDescription>
            The page you are looking for doesn't exist or has been moved.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={goBack} className="flex gap-2 items-center">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={goHome} className="flex gap-2 items-center">
            <HomeIcon className="h-4 w-4" />
            {isDashboardPath ? "Return to Dashboard" : "Return Home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
