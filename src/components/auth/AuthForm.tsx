
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
import { Eye, EyeOff } from "lucide-react";

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
    <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-slate-950">
      <CardHeader className="space-y-1 pb-6">
        <Link to="/" className="flex items-center space-x-2 mb-4">
          <div className="h-10 w-10 bg-realty-900 dark:bg-realty-gold rounded-md flex items-center justify-center">
            <span className="text-white dark:text-realty-900 font-bold text-lg">GD</span>
          </div>
          <span className="text-2xl font-heading font-semibold text-realty-900 dark:text-white">
            GODIRECT
          </span>
        </Link>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {mode === "login" ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Email address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your email address" 
                        type="email" 
                        className="h-12 text-base" 
                        {...field} 
                      />
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
                    <FormLabel className="text-base font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Your password" 
                          type={showPassword ? "text" : "password"}
                          className="h-12 text-base pr-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 w-12 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 
                            <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                            <Eye className="h-5 w-5 text-muted-foreground" />
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
                className="w-full h-12 text-base font-medium bg-realty-800 hover:bg-realty-900 dark:bg-realty-gold dark:text-realty-900 dark:hover:bg-realty-gold/90" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your first name" className="h-12 text-base" {...field} />
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
                      <FormLabel className="text-base font-medium">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your last name" className="h-12 text-base" {...field} />
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
                    <FormLabel className="text-base font-medium">Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" type="email" className="h-12 text-base" {...field} />
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
                    <FormLabel className="text-base font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" type="tel" className="h-12 text-base" {...field} />
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
                    <FormLabel className="text-base font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Create a password" 
                          type={showPassword ? "text" : "password"} 
                          className="h-12 text-base pr-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 w-12 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 
                            <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                            <Eye className="h-5 w-5 text-muted-foreground" />
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
                    <FormLabel className="text-base font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Confirm your password" 
                          type={showConfirmPassword ? "text" : "password"} 
                          className="h-12 text-base pr-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 w-12 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? 
                            <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                            <Eye className="h-5 w-5 text-muted-foreground" />
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
                className="w-full h-12 text-base font-medium bg-realty-800 hover:bg-realty-900 dark:bg-realty-gold dark:text-realty-900 dark:hover:bg-realty-gold/90" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-center w-full pb-6">
          <p className="text-base text-muted-foreground">
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
  );
}
