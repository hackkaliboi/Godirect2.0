
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AgentLogin() {
  return (
    <>
      <Helmet>
        <title>Agent Login | GODIRECT Realty</title>
      </Helmet>
      
      <div className="container flex items-center justify-center min-h-screen py-10">
        <AuthForm
          mode="login"
          userType="agent"
          title="Agent Portal"
          description="Enter your credentials to access the agent dashboard"
          redirectPath="/agent-login"
        />
      </div>
    </>
  );
}
