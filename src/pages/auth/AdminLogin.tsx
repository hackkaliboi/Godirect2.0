
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AdminLogin() {
  return (
    <>
      <Helmet>
        <title>Admin Login | GODIRECT Realty</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <AuthForm
            mode="login"
            userType="admin"
            title="Admin Portal"
            description="Enter your credentials to access the admin dashboard"
            redirectPath="/admin-login"
          />
        </div>
      </div>
    </>
  );
}
