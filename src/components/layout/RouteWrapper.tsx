import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

interface RouteWrapperProps {
  children: ReactNode;
  includeNavigation?: boolean;
  includeFooter?: boolean;
  includeAuthNavigation?: boolean; // New prop for auth pages
  className?: string;
}

const RouteWrapper = ({
  children,
  includeNavigation = true,
  includeFooter = true,
  includeAuthNavigation = false, // Default to false
  className = ""
}: RouteWrapperProps) => {
  if (!includeNavigation && !includeFooter && !includeAuthNavigation) {
    // For auth pages and dashboard pages without navigation
    return (
      <PageTransition className={className}>
        {children}
      </PageTransition>
    );
  }

  if (includeAuthNavigation) {
    // For auth pages with navigation but no footer
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className={`flex-1 ${className}`}>
            {children}
          </main>
        </div>
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