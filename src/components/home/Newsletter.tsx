
import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      toast({
        title: "Thank you for subscribing!",
        description: "You'll now receive our latest property updates and market insights.",
      });
    }, 1000);
  };

  return (
    <section className="bg-realty-beige dark:bg-realty-800/50 py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white dark:bg-realty-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left column with image */}
            <div 
              className="md:col-span-2 bg-cover bg-center h-48 md:h-auto"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop')" }}
            ></div>
            
            {/* Right column with form */}
            <div className="md:col-span-3 p-8 md:p-10">
              <div className="flex items-center mb-2">
                <Mail className="h-5 w-5 text-realty-gold mr-2" />
                <h3 className="text-sm font-semibold text-realty-gold">NEWSLETTER</h3>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-3 text-realty-900 dark:text-white">
                Stay Updated with Godirect
              </h2>
              
              <p className="text-realty-600 dark:text-realty-300 mb-6">
                Subscribe to receive the latest property listings, market trends, and real estate insights directly in your inbox.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-realty-700 bg-white dark:bg-realty-900 text-realty-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-realty-gold"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-realty-800 dark:bg-realty-gold text-white dark:text-realty-900 rounded-lg hover:bg-realty-700 dark:hover:bg-realty-gold/90 transition-colors font-medium flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
                <p className="text-xs text-realty-500 dark:text-realty-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
