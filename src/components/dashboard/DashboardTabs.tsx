
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function DashboardTabs({ tabs, defaultValue, className = "w-full" }: DashboardTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0].value} className={className}>
      <TabsList className={`grid grid-cols-${tabs.length} mb-4`}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
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
