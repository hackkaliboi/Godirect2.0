
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AgentCard from "@/components/agents/AgentCard";
import { Helmet } from "react-helmet-async";
import { fetchAgents, Agent } from "@/utils/supabaseData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAgents = async () => {
      setIsLoading(true);
      const data = await fetchAgents();
      setAgents(data);
      setFilteredAgents(data);
      setIsLoading(false);
    };
    
    getAgents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAgents(agents);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const results = agents.filter((agent) => 
      agent.name.toLowerCase().includes(term) ||
      (agent.specializations && agent.specializations.some(spec => spec.toLowerCase().includes(term)))
    );
    
    setFilteredAgents(results);
  }, [searchTerm, agents]);

  return (
    <>
      <Helmet>
        <title>Our Agents | HomePulse Realty</title>
        <meta name="description" content="Meet our experienced team of real estate professionals ready to help you find your dream home." />
      </Helmet>
      
      <div className="bg-realty-beige dark:bg-realty-800/30 py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
              Our Expert Agents
            </h1>
            <p className="text-lg text-realty-600 dark:text-realty-300">
              Our team of highly professional real estate agents are ready to help you find your perfect home or sell your property.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto mb-12 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-realty-500" size={20} />
            <Input
              type="text"
              placeholder="Search agents by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-realty-800 p-6 rounded-lg shadow-md animate-pulse">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="mt-4 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="mt-3 h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-heading font-semibold mb-2 text-realty-900 dark:text-white">
                No agents found
              </h3>
              <p className="text-realty-600 dark:text-realty-400">
                Try adjusting your search to find real estate agents.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="py-16 bg-white dark:bg-realty-900">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
              Join Our Team
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-3xl mx-auto">
              Are you a real estate professional looking to advance your career? We're always looking for dedicated agents to join our team.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link to="/agent-signup">
              <Button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-realty-800 text-white hover:bg-realty-700 h-10 px-8"
              >
                Become an Agent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Agents;
