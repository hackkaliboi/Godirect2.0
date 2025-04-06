
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function DashboardTabs({ 
  tabs, 
  defaultValue, 
  className = "w-full",
  variant = "default" 
}: DashboardTabsProps) {
  // Determine appropriate className for TabsList based on variant
  const getTabsListClassName = () => {
    switch(variant) {
      case "pills":
        return "bg-transparent p-0 gap-2";
      case "underline":
        return "bg-transparent border-b border-border rounded-none p-0 gap-4";
      default:
        return "grid w-full grid-cols-" + tabs.length + " mb-4";
    }
  };
  
  // Determine appropriate className for TabsTrigger based on variant
  const getTabsTriggerClassName = (tab: TabItem) => {
    switch(variant) {
      case "pills":
        return "bg-background border border-input px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";
      case "underline":
        return "rounded-none bg-transparent px-2 pb-2 pt-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none";
      default:
        return "";
    }
  };
  
  return (
    <Tabs defaultValue={defaultValue || tabs[0].value} className={className}>
      <TabsList className={getTabsListClassName()}>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className={getTabsTriggerClassName(tab)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
