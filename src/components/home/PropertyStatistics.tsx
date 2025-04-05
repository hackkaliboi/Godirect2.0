
import { 
  BadgeCheck, 
  Building2, 
  Home, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

const PropertyStatistics = () => {
  const stats = [
    {
      id: 1,
      icon: <Home className="h-8 w-8 text-realty-gold" />,
      value: "15,000+",
      label: "Active Listings",
      description: "Properties available across the country",
      color: "text-realty-gold"
    },
    {
      id: 2,
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      value: "98%",
      label: "Client Satisfaction",
      description: "Based on our customer reviews",
      color: "text-green-500"
    },
    {
      id: 3,
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      value: "$4.2B",
      label: "Property Sales",
      description: "Total property value sold last year",
      color: "text-blue-500"
    },
    {
      id: 4,
      icon: <Users className="h-8 w-8 text-purple-500" />,
      value: "200+",
      label: "Expert Agents",
      description: "Professional agents ready to help you",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="section-padding bg-white dark:bg-realty-900/70">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-semibold mb-2 text-realty-900 dark:text-white">
            HomePulse by the Numbers
          </h2>
          <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
            Trusted by thousands of home buyers and sellers nationwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-white dark:bg-realty-800 rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              
              <div className={cn("text-3xl font-bold mb-1", stat.color)}>
                {stat.value}
              </div>
              
              <div className="text-lg font-heading font-medium text-realty-800 dark:text-white mb-2">
                {stat.label}
              </div>
              
              <p className="text-sm text-realty-600 dark:text-realty-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyStatistics;
