import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube 
} from "lucide-react";

const TopBar = () => {
  return (
    <div className="sticky top-0 z-50 bg-realty-900 dark:bg-realty-950 text-white py-2 border-b border-realty-800">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left Side - Contact Information */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 md:h-4 md:w-4 text-realty-gold" />
              <span>+234 (0) 123 456 7890</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 md:h-4 md:w-4 text-realty-gold" />
              <span>info@godirectrealty.com</span>
            </div>
            

          </div>

          {/* Right Side - Social Media Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs hidden md:inline text-realty-300">Follow Us:</span>
            
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 p-0 rounded-full hover:bg-realty-800 dark:hover:bg-realty-700 transition-colors duration-300"
                asChild
              >
                <a
                  href="https://facebook.com/godirectrealty"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-3 w-3 md:h-4 md:w-4 text-realty-300 hover:text-realty-gold transition-colors" />
                </a>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 p-0 rounded-full hover:bg-realty-800 dark:hover:bg-realty-700 transition-colors duration-300"
                asChild
              >
                <a
                  href="https://twitter.com/godirectrealty"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-3 w-3 md:h-4 md:w-4 text-realty-300 hover:text-realty-gold transition-colors" />
                </a>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 p-0 rounded-full hover:bg-realty-800 dark:hover:bg-realty-700 transition-colors duration-300"
                asChild
              >
                <a
                  href="https://instagram.com/godirectrealty"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-3 w-3 md:h-4 md:w-4 text-realty-300 hover:text-realty-gold transition-colors" />
                </a>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 p-0 rounded-full hover:bg-realty-800 dark:hover:bg-realty-700 transition-colors duration-300"
                asChild
              >
                <a
                  href="https://linkedin.com/company/godirectrealty"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-3 w-3 md:h-4 md:w-4 text-realty-300 hover:text-realty-gold transition-colors" />
                </a>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 p-0 rounded-full hover:bg-realty-800 dark:hover:bg-realty-700 transition-colors duration-300"
                asChild
              >
                <a
                  href="https://youtube.com/@godirectrealty"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube className="h-3 w-3 md:h-4 md:w-4 text-realty-300 hover:text-realty-gold transition-colors" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
