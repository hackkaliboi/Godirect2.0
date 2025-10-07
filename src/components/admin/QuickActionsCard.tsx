import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    FileText,
    Users,
    Building2,
    Settings,
    BarChart3,
    Bell,
    CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActionsCard() {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Add Property",
            description: "Create a new property listing",
            icon: PlusCircle,
            action: () => navigate("/dashboard/admin/properties/create"),
            color: "bg-primary"
        },
        {
            title: "View Users",
            description: "Manage user accounts",
            icon: Users,
            action: () => navigate("/dashboard/admin/users"),
            color: "bg-success"
        },
        {
            title: "Manage Properties",
            description: "View and edit all properties",
            icon: Building2,
            action: () => navigate("/dashboard/admin/properties"),
            color: "bg-accent"
        },
        {
            title: "View Transactions",
            description: "Check payment records",
            icon: CreditCard,
            action: () => navigate("/dashboard/admin/transactions"),
            color: "bg-warning"
        },
        {
            title: "Analytics",
            description: "View platform metrics",
            icon: BarChart3,
            action: () => navigate("/dashboard/admin/analytics"),
            color: "bg-info"
        },
        {
            title: "System Settings",
            description: "Configure platform settings",
            icon: Settings,
            action: () => navigate("/dashboard/admin/settings"),
            color: "bg-destructive"
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-auto p-4 flex flex-row items-center justify-start gap-3 hover:scale-[1.02] transition-transform text-left"
                                onClick={action.action}
                            >
                                <div className={`p-2 rounded-full ${action.color} text-white flex-shrink-0`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="font-medium text-sm">{action.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}