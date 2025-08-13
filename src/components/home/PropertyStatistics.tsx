
import { 
  BadgeCheck, 
  Building2, 
  Home, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

const PropertyStatistics = () => {
  // Statistics data will be fetched from Supabase
  const stats: any[] = [];

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
        
        {stats.length > 0 ? (
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
        ) : (
          <div className="bg-white dark:bg-realty-800 rounded-xl shadow-md p-8 text-center">
            <p className="text-xl text-realty-600 dark:text-realty-400">Statistics will be available soon</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyStatistics;
