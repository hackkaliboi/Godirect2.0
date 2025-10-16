import { useEffect } from 'react';
import { usePWAStatus } from '@/hooks/usePWAStatus';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';

interface PWALayoutProps {
  children: React.ReactNode;
}

export const PWALayout = ({ children }: PWALayoutProps) => {
  const { isPWA } = usePWAStatus();
  const location = useLocation();

  // Apply PWA-specific styling when running as installed app
  useEffect(() => {
    if (isPWA) {
      document.body.classList.add('pwa-mode');
      // Hide browser navigation elements in PWA mode
      document.body.classList.add('pwa-navigation-hidden');
    } else {
      document.body.classList.remove('pwa-mode');
      document.body.classList.remove('pwa-navigation-hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('pwa-mode');
      document.body.classList.remove('pwa-navigation-hidden');
    };
  }, [isPWA]);

  // Determine if we should show navigation based on route and PWA status
  const shouldShowNavigation = () => {
    const noNavRoutes = ['/login', '/user-login', '/user-signup', '/admin-login', '/forgot-password', '/reset-password'];
    return !noNavRoutes.includes(location.pathname) && isPWA;
  };

  // Determine if we should show header based on route and PWA status
  const shouldShowHeader = () => {
    const noHeaderRoutes = [
      '/login', '/user-login', '/user-signup', '/admin-login', 
      '/forgot-password', '/reset-password',
      '/admin-dashboard', '/admin-dashboard/*',
      '/user-dashboard', '/user-dashboard/*'
    ];
    
    const isDashboardRoute = location.pathname.startsWith('/admin-dashboard') || 
                            location.pathname.startsWith('/user-dashboard') ||
                            location.pathname.startsWith('/dashboard');
    
    // In PWA mode, show simplified header or none for dashboard routes
    if (isPWA && isDashboardRoute) {
      return false;
    }
    
    return !noHeaderRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(route.replace('/*', ''))
    );
  };

  // Determine if we should show footer based on route and PWA status
  const shouldShowFooter = () => {
    const noFooterRoutes = [
      '/login', '/user-login', '/user-signup', '/admin-login', 
      '/forgot-password', '/reset-password',
      '/admin-dashboard', '/admin-dashboard/*',
      '/user-dashboard', '/user-dashboard/*'
    ];
    
    const isDashboardRoute = location.pathname.startsWith('/admin-dashboard') || 
                            location.pathname.startsWith('/user-dashboard') ||
                            location.pathname.startsWith('/dashboard');
    
    // In PWA mode, hide footer for dashboard routes
    if (isPWA && isDashboardRoute) {
      return false;
    }
    
    return !noFooterRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(route.replace('/*', ''))
    );
  };

  if (isPWA) {
    return (
      <div className="pwa-layout flex flex-col min-h-screen bg-gray-50">
        {/* PWA-specific header for installed app */}
        {shouldShowHeader() && (
          <header className="pwa-header bg-gradient-to-r from-realty-800 to-realty-900 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-realty-800 font-bold text-xl">GD</span>
                </div>
                <h1 className="text-xl font-heading font-bold tracking-tight">GODIRECT</h1>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.036-.687-.101-1.016A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Main content area */}
        <main className="flex-grow p-4 pb-20 bg-white">
          {children}
        </main>

        {/* PWA-specific navigation */}
        {shouldShowNavigation() && (
          <nav className="pwa-bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center py-2">
              <a href="/" className="flex flex-col items-center p-2 text-realty-800 active:text-realty-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1 font-medium">Home</span>
              </a>
              <a href="/properties" className="flex flex-col items-center p-2 text-gray-500 hover:text-realty-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs mt-1 font-medium">Properties</span>
              </a>
              <a href="/list-property" className="flex flex-col items-center p-2 text-gray-500 hover:text-realty-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs mt-1 font-medium">List</span>
              </a>
              <a href="/user-dashboard" className="flex flex-col items-center p-2 text-gray-500 hover:text-realty-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1 font-medium">Account</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    );
  }

  // Regular web layout
  return (
    <div className="web-layout">
      <Header />
      {children}
      <Footer />
    </div>
  );
};