
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function UserSignup() {
  return (
    <>
      <Helmet>
        <title>User Sign Up | GODIRECT Realty</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <AuthForm
            mode="signup"
            userType="user"
            title="Create a user account"
            description="Enter your information to create your GODIRECT user account"
            redirectPath="/user-login"
          />
        </div>
      </div>
    </>
  );
}
