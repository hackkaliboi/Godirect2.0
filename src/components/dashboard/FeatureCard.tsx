
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, icon, children, footer, className = "" }: FeatureCardProps) {
  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export function FeatureValue({ value, description }: { value: React.ReactNode; description?: string }) {
  return (
    <>
      <div className="text-3xl font-bold">{value}</div>
      {description && (
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      )}
    </>
  );
}

export function MetricGroup({ data }: { data: { label: string; value: string | number }[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      {data.map((item, index) => (
        <div key={index} className="bg-muted/30 rounded-md p-3">
          <div className="text-xs text-muted-foreground">{item.label}</div>
          <div className="text-lg font-semibold mt-1">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function GoalProgress({ 
  label, 
  current, 
  target, 
  unit = "", 
  percentage 
}: { 
  label: string; 
  current: number; 
  target: number; 
  unit?: string; 
  percentage: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{current}{unit} / {target}{unit}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-xs text-muted-foreground">{percentage}% of monthly target</div>
    </div>
  );
}
