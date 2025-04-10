
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { user, userType, signOut } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Agents", path: "/agents" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Determine which dashboard to link to based on user type
  const getDashboardLink = () => {
    if (userType === "admin") return "/admin-dashboard";
    if (userType === "agent") return "/agent-dashboard";
    if (userType === "user") return "/user-dashboard";
    return "/login";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-realty-900/90 backdrop-blur-md border-b border-gray-200 dark:border-realty-800">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-realty-900 dark:bg-realty-gold rounded-md flex items-center justify-center">
              <span className="text-white dark:text-realty-900 font-bold">GD</span>
            </div>
            <span className="text-xl font-heading font-semibold text-realty-900 dark:text-white">
              GODIRECT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-realty-700 dark:hover:text-realty-300",
                  location.pathname === item.path
                    ? "text-realty-900 dark:text-white font-semibold"
                    : "text-realty-600 dark:text-realty-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  asChild
                >
                  <Link to={getDashboardLink()}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-realty-800 hover:bg-realty-900 text-white"
                  asChild
                >
                  <Link to="/user-signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-realty-900 border-b border-gray-200 dark:border-realty-800 animate-fade-in">
          <div className="container-custom py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-2 py-2 text-sm font-medium rounded-md",
                    location.pathname === item.path
                      ? "text-realty-900 dark:text-white bg-muted"
                      : "text-realty-600 dark:text-realty-400"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user && (
                <Link
                  to={getDashboardLink()}
                  className="px-2 py-2 text-sm font-medium rounded-md text-realty-600 dark:text-realty-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </nav>
            <div className="pt-4 border-t border-gray-200 dark:border-realty-800 flex flex-col space-y-3">
              {user ? (
                <Button 
                  variant="outline" 
                  className="justify-center" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="justify-center" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button className="justify-center bg-realty-800 hover:bg-realty-900 text-white" asChild>
                    <Link to="/user-signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
