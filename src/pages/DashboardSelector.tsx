import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Shield, UserCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardSelector() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"admin" | "agent" | "user" | null>(null);

  const roles = [
    {
      type: "admin" as const,
      title: "Administrator",
      description: "Full platform management and oversight",
      icon: Shield,
      features: ["User Management", "System Analytics", "Platform Settings", "Financial Reports"],
      color: "bg-destructive text-destructive-foreground"
    },
    {
      type: "agent" as const,
      title: "Real Estate Agent",
      description: "Manage listings, clients, and sales",
      icon: UserCheck,
      features: ["Property Listings", "Client Management", "Commission Tracking", "Lead Generation"],
      color: "bg-primary text-primary-foreground"
    },
    {
      type: "user" as const,
      title: "Property Seeker",
      description: "Search and save your favorite properties",
      icon: User,
      features: ["Property Search", "Saved Favorites", "Application Tracking", "Agent Communication"],
      color: "bg-success text-success-foreground"
    }
  ];

  const handleRoleSelect = (role: "admin" | "agent" | "user") => {
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Welcome to RealEstate Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard. This demo shows different interfaces for each user type.
          </p>
          <div className="flex justify-center">
            <Badge variant="outline" className="text-sm">
              Demo Mode - No Authentication Required
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.type} className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${role.color}`}>
                    <role.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => handleRoleSelect(role.type)}
                  className="w-full"
                  variant={role.type === "admin" ? "destructive" : role.type === "agent" ? "default" : "outline"}
                >
                  Enter {role.title} Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Important Note</h3>
                <p className="text-sm text-muted-foreground">
                  This is a demo environment with empty data states. All dashboards show zero values because no users have registered or interacted with the platform yet. Once connected to Supabase and integrated with your public pages, these dashboards will populate with real data.
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">
                    Ready for Supabase Integration
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}