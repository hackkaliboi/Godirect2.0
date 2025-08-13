import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Settings, User, Save, Camera, Shield, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import AgentKYCVerification from "@/components/agent/AgentKYCVerification";

export default function AgentProfile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Agent Profile & Verification
          </h1>
          <p className="text-muted-foreground">
            Complete your verification to unlock all agent features and commission tracking
          </p>
        </div>
      </div>

      {/* Security & Verification Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Secure Payment Processing</AlertTitle>
          <AlertDescription>
            Only admin-verified payment gateways available for maximum security.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <DollarSign className="h-4 w-4" />
          <AlertTitle>Commission Tracking</AlertTitle>
          <AlertDescription>
            Unique tracking codes generated for all agent-referred transactions.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>KYC Verification Required</AlertTitle>
          <AlertDescription>
            Complete identity verification to access full agent features.
          </AlertDescription>
        </Alert>
      </div>

      {/* KYC Verification Component */}
      <AgentKYCVerification />

      {/* Additional Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Security & Compliance Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Why KYC Verification?</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Prevent fraudulent activities and protect clients</li>
                <li>• Ensure compliance with financial regulations</li>
                <li>• Enable secure payment processing capabilities</li>
                <li>• Build trust with clients and the platform</li>
                <li>• Allow commission tracking and payouts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Security Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Admin-only payment gateway management</li>
                <li>• Unique agent tracking codes for transactions</li>
                <li>• Encrypted document storage</li>
                <li>• Background verification checks</li>
                <li>• Audit trails for all activities</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Data Protection</h4>
            <p className="text-sm text-blue-800">
              All personal and financial information is encrypted and stored securely. 
              Your data is only used for verification purposes and regulatory compliance. 
              We never share your information with unauthorized parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
