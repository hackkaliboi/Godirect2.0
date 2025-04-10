
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AdminLogin() {
  return (
    <>
      <Helmet>
        <title>Admin Login | GODIRECT Realty</title>
      </Helmet>
      
      <div className="container flex items-center justify-center min-h-screen py-10">
        <AuthForm
          mode="login"
          userType="admin"
          title="Admin Portal"
          description="Enter your credentials to access the admin dashboard"
          redirectPath="/admin-login"
        />
      </div>
    </>
  );
}
