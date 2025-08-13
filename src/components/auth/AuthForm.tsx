
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false).optional(),
});

const signupFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions."
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthFormProps = {
  mode: "login" | "signup";
  userType: "admin" | "agent" | "user";
  title: string;
  description: string;
  redirectPath: string;
};

export default function AuthForm({ 
  mode, 
  userType, 
  title, 
  description, 
  redirectPath 
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Login successful!",
        description: `Welcome back to GODIRECT.`,
      });
      
      // Redirect based on userType
      if (userType === "admin") {
        navigate("/dashboard/admin");
      } else if (userType === "agent") {
        navigate("/dashboard/agent");
      } else {
        navigate("/dashboard/user");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Please check your credentials and try again.";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    setIsLoading(true);
    try {
      // First, sign up the user with metadata that the trigger will use
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
            role: userType,
            user_type: userType, // Also pass as user_type for consistency
            full_name: `${values.firstName} ${values.lastName}`,
          }
        },
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Since email confirmation is disabled, automatically sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (signInError) {
        // If sign in fails, it might be because email confirmation is still required
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account, then try logging in.",
        });
        navigate(redirectPath);
        return;
      }
      
      // If user signed in successfully, ensure profile exists and is complete
      if (signInData.user) {
        try {
          // Check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signInData.user.id)
            .single();
          
          // If no profile exists, create one manually
          if (!profileData && profileError?.code === 'PGRST116') {
            console.log('Profile not found, creating manually...');
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: signInData.user.id,
                email: values.email,
                full_name: `${values.firstName} ${values.lastName}`,
                phone: values.phone,
                user_type: userType,
                status: 'active'
              });
            
            if (createError) {
              console.warn('Could not create profile manually:', createError);
            }
          }
          
          // Also create default user settings
          const defaultSettings = [
            {
              user_id: signInData.user.id,
              setting_key: 'theme',
              setting_value: 'light',
              category: 'appearance'
            },
            {
              user_id: signInData.user.id,
              setting_key: 'notifications_enabled',
              setting_value: 'true',
              category: 'notifications'
            }
          ];
          
          await supabase
            .from('user_settings')
            .upsert(defaultSettings, { onConflict: 'user_id,setting_key' });
          
        } catch (profileSetupError) {
          console.warn('Error setting up user profile:', profileSetupError);
          // Don't fail the signup process for profile setup errors
        }
      }
      
      // Success - user is signed up and logged in
      toast({
        title: "Account created successfully!",
        description: "Welcome to GODIRECT. You're now logged in and your profile has been set up.",
      });
      
      // Redirect to dashboard based on user type
      if (userType === "admin") {
        navigate("/dashboard/admin");
      } else if (userType === "agent") {
        navigate("/dashboard/agent");
      } else {
        navigate("/dashboard/user");
      }

    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "There was a problem creating your account. Please try again.";
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Left Side - Animations */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-20 w-20 h-20 bg-white/5 rounded-full animate-bounce [animation-delay:1s]" />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping [animation-delay:2s]" />
          <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-pulse [animation-delay:3s]" />
          <div className="absolute top-1/2 left-10 w-12 h-12 bg-white/10 rounded-full animate-bounce [animation-delay:4s]" />
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white/20 rotate-45 animate-spin [animation-duration:8s]" />
          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/15 rotate-12 animate-spin [animation-duration:12s] [animation-direction:reverse]" />
          <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-white/25 rotate-45 animate-pulse [animation-delay:1.5s]" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 max-w-md text-center px-8">
          {/* Animated logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-bold text-3xl">GD</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping" />
              <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-xl animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
            Welcome to <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">GODIRECT</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 animate-fade-in-up [animation-delay:0.2s]">
            {mode === "login" 
              ? "Sign in to access your real estate management platform" 
              : "Join thousands of professionals managing their real estate business with us"}
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-4 animate-fade-in-up [animation-delay:0.4s]">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 transform hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white/90">Professional Property Management</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 transform hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.5s]" />
              <span className="text-white/90">Advanced Analytics & Reporting</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 transform hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:1s]" />
              <span className="text-white/90">Seamless Client Communication</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative min-h-screen lg:min-h-0">
        {/* Mobile background for small screens */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        
        <Card className={cn(
          "w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm relative overflow-hidden",
          "transform transition-all duration-700 hover:shadow-3xl lg:hover:-translate-y-2"
        )}>
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary animate-gradient-x" />
          
          <CardHeader className="space-y-4 pb-6 relative px-4 sm:px-6">
            {/* Mobile logo for small screens */}
            <div className="lg:hidden flex justify-center mb-6">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-white font-bold text-lg sm:text-xl">GD</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping" />
                </div>
                <span className="text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  GODIRECT
                </span>
              </Link>
            </div>
            
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground px-2">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6">
        {mode === "login" ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 sm:space-y-5">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Email address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Your email address" 
                          type="email" 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Your password" 
                          type={showPassword ? "text" : "password"}
                          className="h-10 sm:h-12 text-sm sm:text-base pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-10 sm:h-12 w-10 sm:w-12 p-0 hover:bg-primary/10 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" /> : 
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                  control={loginForm.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-realty-600 hover:text-realty-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Button 
                type="submit" 
                className={cn(
                  "w-full h-10 sm:h-12 text-sm sm:text-base font-medium relative overflow-hidden transition-all duration-300",
                  "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                  "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                )}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader variant="spin" size="sm" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base font-medium">First Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Your first name" 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-9 sm:pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base font-medium">Last Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Your last name" 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-9 sm:pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Email address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Your email address" 
                          type="email" 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-9 sm:pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Your phone number" 
                          type="tel" 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-9 sm:pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Create a password" 
                          type={showPassword ? "text" : "password"} 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-9 sm:pl-10 pr-10 sm:pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-10 sm:h-12 w-10 sm:w-12 p-0 hover:bg-primary/10 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" /> : 
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Confirm your password" 
                          type={showConfirmPassword ? "text" : "password"} 
                          className="h-10 sm:h-12 text-sm sm:text-base pl-9 sm:pl-10 pr-10 sm:pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-10 sm:h-12 w-10 sm:w-12 p-0 hover:bg-primary/10 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? 
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" /> : 
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-realty-600 hover:text-realty-800 font-medium">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-realty-600 hover:text-realty-800 font-medium">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className={cn(
                  "w-full h-10 sm:h-12 text-sm sm:text-base font-medium relative overflow-hidden transition-all duration-300 group",
                  "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                  "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                )}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader variant="spin" size="sm" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="pt-0 px-4 sm:px-6">
        <div className="text-center w-full pb-4 sm:pb-6">
          <p className="text-sm sm:text-base text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Link
                  to={`${redirectPath.replace("login", "signup")}`}
                  className="text-realty-600 hover:text-realty-800 font-medium"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to={redirectPath}
                  className="text-realty-600 hover:text-realty-800 font-medium"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </CardFooter>
    </Card>
      </div>
    </div>
  );
}
