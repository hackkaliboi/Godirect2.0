
import { Link } from "react-router-dom";
import { Phone, Mail, Star } from "lucide-react";
import { Agent } from "@/utils/data";
import { Button } from "@/components/ui/button";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <div className="bg-white dark:bg-realty-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 flex flex-col items-center text-center">
        {/* Agent Image */}
        <img 
          src={agent.image} 
          alt={agent.name} 
          className="w-32 h-32 rounded-full object-cover border-4 border-realty-50 dark:border-realty-700 mb-4"
        />
        
        {/* Agent Info */}
        <h3 className="text-xl font-heading font-semibold text-realty-900 dark:text-white mb-1">
          {agent.name}
        </h3>
        <p className="text-realty-500 dark:text-realty-400 mb-2">{agent.title}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(agent.ratings) 
                    ? "text-yellow-500 fill-yellow-500" 
                    : (i < agent.ratings
                      ? "text-yellow-500 fill-yellow-500" 
                      : "text-gray-300 dark:text-gray-600")
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-realty-600 dark:text-realty-300">
            {agent.ratings} ({agent.reviews} reviews)
          </span>
        </div>
        
        {/* Specializations */}
        <div className="mb-4">
          <div className="flex flex-wrap justify-center gap-2">
            {agent.specializations.map((specialty, index) => (
              <span 
                key={index}
                className="text-xs bg-realty-50 dark:bg-realty-700 text-realty-700 dark:text-realty-200 py-1 px-2 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 w-full mb-6 text-center text-sm">
          <div>
            <p className="font-semibold text-realty-900 dark:text-white">{agent.listings}</p>
            <p className="text-realty-500 dark:text-realty-400">Listings</p>
          </div>
          <div>
            <p className="font-semibold text-realty-900 dark:text-white">{agent.sales}</p>
            <p className="text-realty-500 dark:text-realty-400">Sales</p>
          </div>
          <div>
            <p className="font-semibold text-realty-900 dark:text-white">{agent.experience}</p>
            <p className="text-realty-500 dark:text-realty-400">Years</p>
          </div>
        </div>
        
        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-center"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </div>
      
      {/* View Profile Button */}
      <div className="bg-realty-50 dark:bg-realty-700/50 p-4 text-center">
        <Link 
          to={`/agents/${agent.id}`}
          className="text-realty-800 dark:text-white font-medium hover:text-realty-600 dark:hover:text-realty-300 transition-colors"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;
