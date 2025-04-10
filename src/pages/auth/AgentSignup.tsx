
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AgentSignup() {
  return (
    <>
      <Helmet>
        <title>Agent Sign Up | GODIRECT Realty</title>
      </Helmet>
      
      <div className="container flex items-center justify-center min-h-screen py-10">
        <AuthForm
          mode="signup"
          userType="agent"
          title="Become an Agent"
          description="Create your agent account to join the GODIRECT team"
          redirectPath="/agent-login"
        />
      </div>
    </>
  );
}
