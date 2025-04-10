
import { Helmet } from "react-helmet-async";
import AuthForm from "@/components/auth/AuthForm";

export default function AgentLogin() {
  return (
    <>
      <Helmet>
        <title>Agent Login | GODIRECT Realty</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          <AuthForm
            mode="login"
            userType="agent"
            title="Agent Portal"
            description="Enter your credentials to access the agent dashboard"
            redirectPath="/agent-login"
          />
        </div>
      </div>
    </>
  );
}
