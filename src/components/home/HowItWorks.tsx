
import { Search, Home, FileCheck, Key } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <Search className="w-10 h-10 text-realty-gold" />,
      title: "Discover Properties",
      description: "Browse thousands of listings using our advanced search filters to find your perfect match."
    },
    {
      id: 2,
      icon: <Home className="w-10 h-10 text-realty-gold" />,
      title: "Tour Homes",
      description: "Schedule viewings online or through our mobile app to see properties in person or via virtual tour."
    },
    {
      id: 3,
      icon: <FileCheck className="w-10 h-10 text-realty-gold" />,
      title: "Make an Offer",
      description: "Submit offers with guidance from our expert agents who will negotiate the best terms for you."
    },
    {
      id: 4,
      icon: <Key className="w-10 h-10 text-realty-gold" />,
      title: "Close the Deal",
      description: "Complete the transaction with our streamlined closing process and move into your new home."
    }
  ];

  return (
    <section className="section-padding bg-realty-50 dark:bg-realty-900/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-semibold mb-2 text-realty-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
            Finding and purchasing your dream home has never been easier
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-realty-800 dark:bg-realty-gold text-white dark:text-realty-900 flex items-center justify-center font-semibold z-10">
                {step.id}
              </div>
              
              {/* Connection line */}
              {step.id < steps.length && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-realty-200 dark:bg-realty-700 z-0 transform -translate-x-1/2" />
              )}
              
              {/* Card */}
              <div className="bg-white dark:bg-realty-800 rounded-xl shadow-md p-6 h-full z-10 relative transition-transform hover:translate-y-[-5px] duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-realty-100 dark:bg-realty-700/30 rounded-full">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold mb-2 text-realty-800 dark:text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-realty-600 dark:text-realty-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
