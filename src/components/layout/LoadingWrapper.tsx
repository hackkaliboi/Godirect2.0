import { useState, useEffect, ReactNode } from "react";
import { SiteLoader } from "@/components/ui/loader";

interface LoadingWrapperProps {
  children: ReactNode;
  initialLoading?: boolean;
  loadingDelay?: number;
}

export function LoadingWrapper({ 
  children, 
  initialLoading = true, 
  loadingDelay = 1500 
}: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, loadingDelay);

      return () => clearTimeout(timer);
    }
  }, [initialLoading, loadingDelay]);

  if (isLoading) {
    return <SiteLoader isLoading={true} />;
  }

  return <>{children}</>;
}

// Hook for manual loading state control
export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading
  };
}
