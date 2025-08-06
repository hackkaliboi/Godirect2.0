import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Phone, Mail, Award, Building, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const AgentShowcase = () => {
  const [activeAgent, setActiveAgent] = useState(0);

  // Featured agents data will be fetched from Supabase
  interface Agent {
    id: string;
    name: string;
    title: string;
    image: string;
    rating: number;
    reviews: number;
    specialization: string;
    bio: string;
    experience: string;
    properties: number;
    location: string;
    phone: string;
    email: string;
  }

  const agents: Agent[] = [];

  const currentAgent = agents[activeAgent];

  return (
    <div className="container-custom">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
          Meet Our <span className="text-realty-gold">Expert Agents</span>
        </h2>
        <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
          Our team of experienced professionals is ready to help you find the perfect property or sell your existing one.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {agents.map((agent, index) => (
            <Card 
              key={agent.id}
              className={`cursor-pointer transition-all duration-300 ${
                activeAgent === index 
                  ? "border-realty-gold dark:border-realty-gold shadow-md" 
                  : "hover:border-realty-300 dark:hover:border-realty-700"
              }`}
              onClick={() => setActiveAgent(index)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="h-full w-full object-cover rounded-full"
                  />
                  {activeAgent === index && (
                    <div className="absolute inset-0 border-2 border-realty-gold rounded-full animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-realty-900 dark:text-white">{agent.name}</h3>
                  <p className="text-sm text-realty-500 dark:text-realty-400">{agent.title}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs ml-1 text-realty-600 dark:text-realty-300">
                      {agent.rating} ({agent.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            asChild
            variant="outline" 
            className="w-full mt-4 border-realty-200 dark:border-realty-700 hover:bg-realty-50 dark:hover:bg-realty-800 group"
          >
            <Link to="/agents">
              View All Agents
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div 
          className="lg:col-span-2 bg-white dark:bg-realty-800/30 rounded-xl shadow-lg overflow-hidden animate-fade-up"
          key={currentAgent.id}
          style={{ animationDuration: "0.4s" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-full">
              <div className="relative h-full min-h-[300px]">
                <img 
                  src={currentAgent.image} 
                  alt={currentAgent.name} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-realty-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-realty-gold text-realty-900 mb-2">
                    {currentAgent.specialization}
                  </Badge>
                  <h3 className="text-white text-xl font-semibold">{currentAgent.name}</h3>
                  <p className="text-white/80 text-sm">{currentAgent.title}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{currentAgent.rating}</span>
                <span className="text-sm text-realty-500 dark:text-realty-400">
                  ({currentAgent.reviews} reviews)
                </span>
              </div>
              
              <p className="text-realty-600 dark:text-realty-300 mb-6">
                {currentAgent.bio}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-realty-600 dark:text-realty-300">
                  <Award className="h-4 w-4 mr-2 text-realty-500 dark:text-realty-400" />
                  <span>{currentAgent.experience}</span>
                </div>
                <div className="flex items-center text-sm text-realty-600 dark:text-realty-300">
                  <Building className="h-4 w-4 mr-2 text-realty-500 dark:text-realty-400" />
                  <span>{currentAgent.properties} Properties</span>
                </div>
                <div className="flex items-center text-sm text-realty-600 dark:text-realty-300">
                  <MapPin className="h-4 w-4 mr-2 text-realty-500 dark:text-realty-400" />
                  <span>{currentAgent.location}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-realty-500 dark:text-realty-400" />
                  <span className="text-realty-900 dark:text-white">{currentAgent.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-realty-500 dark:text-realty-400" />
                  <span className="text-realty-900 dark:text-white">{currentAgent.email}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  asChild
                  className="bg-realty-800 hover:bg-realty-900 text-white dark:bg-realty-gold dark:text-realty-900"
                >
                  <Link to={`/agents/${currentAgent.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-realty-200 dark:border-realty-700"
                >
                  <Link to={`/contact?agent=${currentAgent.id}`}>
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentShowcase;
