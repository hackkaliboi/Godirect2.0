
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Determine appropriate className for TabsList based on variant
  const getTabsListClassName = () => {
    const baseClasses = {
      default: "grid w-full mb-4",
      pills: "bg-transparent p-0 gap-2 flex flex-wrap",
      underline: "bg-transparent border-b border-border rounded-none p-0 gap-4 flex flex-wrap"
    };
    
    // Add responsive classes based on variant
    if (variant === "default") {
      return `${baseClasses[variant]} grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(tabs.length, 4)}`;
    }
    
    return baseClasses[variant];
  };

  // Determine appropriate className for TabsTrigger based on variant
  const getTabsTriggerClassName = (tab: TabItem) => {
    switch (variant) {
      case "pills":
        return "bg-background border border-input px-3 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none";
      case "underline":
        return "rounded-none bg-transparent px-2 pb-2 pt-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none text-sm flex-1 sm:flex-none";
      default:
        return "text-sm h-auto flex items-center justify-center py-2 px-3";
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
            <span className="whitespace-nowrap">{isMobile && tab.icon ? '' : tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="mt-6">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="pt-2">
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
