
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AgentLogin() {
  return (
    <>
      <Helmet>
        <title>Agent Login | GODIRECT Realty</title>
      </Helmet>
      
      <AuthForm
        mode="login"
        userType="agent"
        title="Agent Portal"
        description="Enter your credentials to access the agent dashboard"
        redirectPath="/agent-login"
      />
    </>
  );
}
