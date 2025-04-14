
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const UserNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        
        <Alert className="my-4" variant="destructive">
          <AlertTitle>Dashboard Page Not Available</AlertTitle>
          <AlertDescription>
            The dashboard page you're looking for doesn't exist or has been moved.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex gap-2 items-center"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/user-dashboard")}
            className="flex gap-2 items-center"
          >
            <HomeIcon className="h-4 w-4" />
            Dashboard Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserNotFound;
