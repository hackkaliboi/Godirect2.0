import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

interface RouteWrapperProps {
  children: ReactNode;
  includeNavigation?: boolean;
  includeFooter?: boolean;
  className?: string;
}

const RouteWrapper = ({ 
  children, 
  includeNavigation = true, 
  includeFooter = true,
  className = "" 
}: RouteWrapperProps) => {
  if (!includeNavigation && !includeFooter) {
    // For auth pages and dashboard pages without navigation
    return (
      <PageTransition className={className}>
        {children}
      </PageTransition>
    );
  }

  // For public pages with navigation and footer
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        {includeNavigation && <Navigation />}
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
        {includeFooter && <Footer />}
      </div>
    </PageTransition>
  );
};

export default RouteWrapper;