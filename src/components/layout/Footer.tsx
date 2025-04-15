
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-realty-800 to-realty-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-realty-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-realty-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container-custom py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-realty-gold to-realty-gold/80 rounded-md flex items-center justify-center shadow-lg">
                <span className="text-realty-900 font-bold text-lg">GD</span>
              </div>
              <span className="text-xl font-heading font-bold tracking-tight">GODIRECT</span>
            </div>
            <p className="text-realty-300 text-sm leading-relaxed max-w-xs">
              Connecting you with premier properties in Enugu and Calabar, Nigeria since 2010. Your trusted partner in real estate.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-realty-gold hover:bg-white/10 rounded-full transition-all duration-300">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-realty-gold hover:bg-white/10 rounded-full transition-all duration-300">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-realty-gold hover:bg-white/10 rounded-full transition-all duration-300">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-realty-gold hover:bg-white/10 rounded-full transition-all duration-300">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 relative inline-block">
              <span>Quick Links</span>
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-realty-gold"></span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties" className="text-realty-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-0 h-0.5 bg-realty-gold group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-realty-300 hover:text-white transition-colors">
                  Our Agents
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-realty-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-realty-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="text-realty-300 hover:text-white transition-colors">
                  Market Trends
                </Link>
              </li>
              <li>
                <Link to="/" className="text-realty-300 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 relative inline-block">
              <span>Contact Us</span>
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-realty-gold"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex">
                <MapPin className="h-5 w-5 text-realty-300 mr-2 flex-shrink-0" />
                <span className="text-realty-300">
                  Enugu Office:<br />
                  123 Independence Avenue,<br />
                  Enugu, Nigeria
                </span>
              </li>
              <li className="flex mt-2">
                <MapPin className="h-5 w-5 text-realty-300 mr-2 flex-shrink-0" />
                <span className="text-realty-300">
                  Calabar Office:<br />
                  45 Marina Road,<br />
                  Calabar, Nigeria
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-realty-300 mr-2 flex-shrink-0" />
                <span className="text-realty-300">(+234) 801-234-5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-realty-300 mr-2 flex-shrink-0" />
                <span className="text-realty-300">info@godirect.com.ng</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 relative inline-block">
              <span>Newsletter</span>
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-realty-gold"></span>
            </h3>
            <p className="text-sm text-realty-300 mb-4">
              Subscribe to our newsletter for the latest property updates in Enugu and Calabar.
            </p>
            <form className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-md bg-realty-800/70 border border-realty-700/50 text-white placeholder:text-realty-500 pr-12 h-10 focus:outline-none focus:ring-2 focus:ring-realty-gold focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 bg-realty-gold hover:bg-realty-gold/90 text-realty-900 rounded-r-md transition-all duration-300 hover:shadow-md hover:shadow-realty-gold/20"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-realty-800/50 mt-12 pt-8 text-center text-xs text-realty-400">
          <p>© {new Date().getFullYear()} GODIRECT Nigeria. All rights reserved.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="hover:text-realty-gold transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-realty-gold transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-realty-gold transition-colors">Cookies</Link>
            <Link to="/" className="hover:text-realty-gold transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
