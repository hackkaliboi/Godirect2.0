import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dots" | "pulse" | "spin";
  className?: string;
  text?: string;
}

export function Loader({ 
  size = "md", 
  variant = "default", 
  className,
  text 
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        </div>
        {text && <span className="ml-3 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn("rounded-full bg-primary animate-pulse", sizeClasses[size])}></div>
        {text && <span className="ml-3 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === "spin") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn("border-4 border-muted border-t-primary rounded-full animate-spin", sizeClasses[size])}></div>
        {text && <span className="ml-3 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
      {text && <span className="ml-3 text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

// Site-wide loading screen component
export function SiteLoader({ isLoading = true }: { isLoading?: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated logo container */}
        <div className="relative">
          {/* Main logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-1000 animate-bounce">
            <span className="text-white font-bold text-3xl tracking-wider">GD</span>
          </div>
          
          {/* Outer ring animation */}
          <div className="absolute inset-0 rounded-2xl border-4 border-blue-400/30 animate-ping"></div>
          
          {/* Rotating ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-transparent border-t-blue-400 border-r-purple-400 animate-spin"></div>
          
          {/* Pulsing glow */}
          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-pulse"></div>
        </div>
        
        {/* Company name with typewriter effect */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wider">
            <span className="inline-block animate-pulse">G</span>
            <span className="inline-block animate-pulse [animation-delay:0.1s]">O</span>
            <span className="inline-block animate-pulse [animation-delay:0.2s]">D</span>
            <span className="inline-block animate-pulse [animation-delay:0.3s]">I</span>
            <span className="inline-block animate-pulse [animation-delay:0.4s]">R</span>
            <span className="inline-block animate-pulse [animation-delay:0.5s]">E</span>
            <span className="inline-block animate-pulse [animation-delay:0.6s]">C</span>
            <span className="inline-block animate-pulse [animation-delay:0.7s]">T</span>
          </h1>
          <p className="text-blue-200 text-sm mb-4 animate-fade-in">Real Estate Management Platform</p>
          
          {/* Enhanced loading dots */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          </div>
          <p className="text-blue-200/80 text-xs mt-3 animate-pulse">Loading your experience...</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping [animation-delay:1s]"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-ping [animation-delay:3s]"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-purple-300/30 rounded-full animate-ping [animation-delay:4s]"></div>
      </div>
    </div>
  );
}
