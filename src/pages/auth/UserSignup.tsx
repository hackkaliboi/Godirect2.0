
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function UserSignup() {
  return (
    <>
      <Helmet>
        <title>User Sign Up | GODIRECT Realty</title>
      </Helmet>
      
      <div className="container flex items-center justify-center min-h-screen py-10">
        <AuthForm
          mode="signup"
          userType="user"
          title="Create a user account"
          description="Enter your information to create your GODIRECT user account"
          redirectPath="/user-login"
        />
      </div>
    </>
  );
}
