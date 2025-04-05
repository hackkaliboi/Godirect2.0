
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-realty-900 text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-realty-900 font-bold">GD</span>
              </div>
              <span className="text-xl font-heading font-semibold">GODIRECT</span>
            </div>
            <p className="text-realty-300 text-sm">
              Connecting you with premier properties in Enugu and Calabar, Nigeria since 2010.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-white rounded-full">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-white rounded-full">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-white rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-realty-300 hover:text-white rounded-full">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties" className="text-realty-300 hover:text-white transition-colors">
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
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
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
            <h3 className="font-heading font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-realty-300 mb-4">
              Subscribe to our newsletter for the latest property updates in Enugu and Calabar.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-md bg-realty-800 border-realty-700 text-white placeholder:text-realty-500 pr-12 h-10 focus:outline-none focus:ring-2 focus:ring-realty-gold focus:border-transparent"
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 bg-realty-gold hover:bg-realty-gold/90 text-realty-900 rounded-r-md"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-realty-800 mt-10 pt-6 text-center text-xs text-realty-400">
          <p>© {new Date().getFullYear()} GODIRECT Nigeria. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/" className="hover:text-white">Privacy Policy</Link>
            <Link to="/" className="hover:text-white">Terms of Service</Link>
            <Link to="/" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
