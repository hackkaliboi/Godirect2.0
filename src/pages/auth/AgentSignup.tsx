
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AgentSignup() {
  return (
    <>
      <Helmet>
        <title>Agent Sign Up | GODIRECT Realty</title>
      </Helmet>
      
      <AuthForm
        mode="signup"
        userType="agent"
        title="Become an Agent"
        description="Create your agent account to join the GODIRECT team"
        redirectPath="/agent-login"
      />
    </>
  );
}
