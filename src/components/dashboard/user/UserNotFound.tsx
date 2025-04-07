
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

const UserNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
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
