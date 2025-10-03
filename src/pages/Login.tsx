import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false).optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    try {
      console.log("🔐 Starting login process for:", values.email);

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        console.error("❌ Authentication failed:", authError.message);
        throw authError;
      }

      if (!authData.user) {
        console.error("❌ No user data returned from authentication");
        throw new Error("Authentication failed - no user data");
      }

      console.log("✅ Authentication successful for user:", authData.user.id);

      // Fetch user profile to determine user type
      console.log("📋 Fetching user profile...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, full_name')
        .eq('id', authData.user.id)
        .single();

      // Log the raw profile data for debugging
      console.log("🔍 Raw profile data:", profile);
      console.log("❌ Profile error (if any):", profileError);

      if (profileError) {
        console.error("❌ Profile fetch failed:", profileError.message);
        // Default to user dashboard if profile fetch fails
        console.log("⚠️ Defaulting to user dashboard due to profile fetch failure");
        toast({
          variant: "destructive",
          title: "Profile fetch failed",
          description: "Could not retrieve your profile. Defaulting to user dashboard.",
        });
        navigate("/dashboard/user");
        return;
      }

      console.log("✅ Profile fetched successfully:", profile);
      console.log("👤 User type:", profile.user_type);

      // Redirect based on user type
      let redirectPath = "/dashboard/user"; // default

      switch (profile.user_type) {
        case 'admin':
          redirectPath = "/dashboard/admin";
          console.log("🔄 Redirecting to admin dashboard");
          break;
        case 'agent':
          redirectPath = "/dashboard/agent";
          console.log("🔄 Redirecting to agent dashboard");
          break;
        case 'user':
        default:
          redirectPath = "/dashboard/user";
          console.log("🔄 Redirecting to user dashboard");
          break;
      }

      toast({
        title: "Login successful!",
        description: `Welcome back, ${profile.full_name || values.email}!`,
      });

      console.log("🎯 Final redirect path:", redirectPath);
      navigate(redirectPath);

    } catch (error: any) {
      console.error("❌ Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | GODIRECT Realty</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-10 px-4">
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
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                    control={form.control}
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
          </CardContent>
          <CardFooter className="pt-0">
            <div className="text-center w-full pb-6">
              <p className="text-base text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-realty-600 hover:text-realty-800 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;