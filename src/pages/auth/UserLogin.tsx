
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function UserLogin() {
  return (
    <>
      <Helmet>
        <title>User Login | GODIRECT Realty</title>
      </Helmet>
      
      <div className="container flex items-center justify-center min-h-screen py-10">
        <AuthForm
          mode="login"
          userType="user"
          title="Welcome back"
          description="Enter your credentials to access your user account"
          redirectPath="/user-login"
        />
      </div>
    </>
  );
}
