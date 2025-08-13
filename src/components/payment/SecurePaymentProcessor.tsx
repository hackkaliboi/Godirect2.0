import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentGatewayApi, agentTrackingApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  User,
  DollarSign,
  Eye,
  EyeOff,
  Building,
  Percent,
  Clock,
  FileText,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PaymentData {
  amount: number;
  currency: string;
  property_id?: string;
  description: string;
  client_email: string;
  client_name: string;
  agent_tracking_code?: string;
}

interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  is_default: boolean;
  admin_only: boolean;
  supported_currencies: string[];
  transaction_fee_percentage: number;
  fixed_fee_amount?: number;
}

const SecurePaymentProcessor = ({ 
  propertyId, 
  agentId,
  onPaymentSuccess,
  onPaymentError 
}: {
  propertyId?: string;
  agentId?: string;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: any) => void;
}) => {
  const { user, userType } = useAuth();
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>("");
  const [agentTrackingCode, setAgentTrackingCode] = useState<string>("");
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    currency: "USD",
    description: "",
    client_email: "",
    client_name: "",
  });
  const [processing, setProcessing] = useState(false);
  const [showTrackingCode, setShowTrackingCode] = useState(false);
  const [commissionPreview, setCommissionPreview] = useState<any>(null);
  const [securityVerified, setSecurityVerified] = useState(false);

  useEffect(() => {
    fetchAvailableGateways();
    generateAgentTrackingCode();
  }, [user, userType]);

  const fetchAvailableGateways = async () => {
    try {
      const gateways = await paymentGatewayApi.getAvailableGateways(userType || "user");
      setAvailableGateways(gateways);
      
      // Auto-select default gateway if available
      const defaultGateway = gateways.find(gw => gw.is_default);
      if (defaultGateway) {
        setSelectedGateway(defaultGateway.id);
      }
    } catch (error) {
      console.error("Error fetching gateways:", error);
      toast.error("Failed to load payment gateways");
    }
  };

  const generateAgentTrackingCode = async () => {
    if (!agentId) return;

    try {
      const trackingData = await agentTrackingApi.generateTrackingCode({
        agent_id: agentId,
        property_id: propertyId,
        client_email: paymentData.client_email,
        expires_in_hours: 24
      });
      
      setAgentTrackingCode(trackingData.tracking_code);
      setPaymentData(prev => ({
        ...prev,
        agent_tracking_code: trackingData.tracking_code
      }));
    } catch (error) {
      console.error("Error generating tracking code:", error);
    }
  };

  const validatePaymentData = (): boolean => {
    if (!paymentData.amount || paymentData.amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return false;
    }

    if (!paymentData.client_name.trim()) {
      toast.error("Please enter the client's name");
      return false;
    }

    if (!paymentData.client_email.trim()) {
      toast.error("Please enter the client's email");
      return false;
    }

    if (!selectedGateway) {
      toast.error("Please select a payment gateway");
      return false;
    }

    return true;
  };

  const calculateFees = () => {
    const gateway = availableGateways.find(gw => gw.id === selectedGateway);
    if (!gateway || !paymentData.amount) return { processingFee: 0, totalAmount: paymentData.amount };

    const processingFee = (paymentData.amount * gateway.transaction_fee_percentage / 100) + (gateway.fixed_fee_amount || 0);
    const totalAmount = paymentData.amount + processingFee;

    return { processingFee, totalAmount };
  };

  const previewCommission = () => {
    if (!agentId || !agentTrackingCode || !paymentData.amount) return null;

    // Mock commission calculation - replace with actual API call
    const commissionRate = 2.5; // Percentage
    const commissionAmount = (paymentData.amount * commissionRate / 100);
    
    return {
      agent_id: agentId,
      tracking_code: agentTrackingCode,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      base_amount: paymentData.amount
    };
  };

  const processPayment = async () => {
    if (!validatePaymentData()) return;

    try {
      setProcessing(true);

      // Security verification for high-value transactions
      if (paymentData.amount > 10000 && userType !== "admin") {
        toast.error("High-value transactions require admin approval");
        return;
      }

      const gateway = availableGateways.find(gw => gw.id === selectedGateway);
      if (!gateway) {
        toast.error("Selected payment gateway is not available");
        return;
      }

      // Admin-only gateway check
      if (gateway.admin_only && userType !== "admin") {
        toast.error("This payment gateway is restricted to administrators");
        return;
      }

      const paymentResult = await paymentGatewayApi.processPaymentWithTracking(
        {
          ...paymentData,
          gateway_id: selectedGateway,
          user_id: user?.id,
          property_id: propertyId
        },
        agentTrackingCode || undefined
      );

      if (paymentResult.status === "completed") {
        toast.success("Payment processed successfully!");
        
        // Show commission information if agent was involved
        if (paymentResult.commission_data) {
          toast.success(
            `Commission of $${paymentResult.commission_data.commission_amount.toFixed(2)} recorded for agent`,
            { duration: 5000 }
          );
        }

        onPaymentSuccess?.(paymentResult);
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast.error(error.message || "Payment processing failed");
      onPaymentError?.(error);
    } finally {
      setProcessing(false);
    }
  };

  const { processingFee, totalAmount } = calculateFees();
  const commission = previewCommission();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment Processing
        </CardTitle>
        <p className="text-sm text-gray-600">
          All payments are processed through admin-verified secure gateways
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Security Notice */}
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            Payment gateways are configured and managed exclusively by system administrators 
            to ensure maximum security and prevent unauthorized access.
          </AlertDescription>
        </Alert>

        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={paymentData.client_name}
                onChange={(e) => setPaymentData(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Enter client's full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={paymentData.client_email}
                onChange={(e) => setPaymentData(prev => ({ ...prev, client_email: e.target.value }))}
                placeholder="client@example.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentData.amount || ""}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={paymentData.currency}
                onValueChange={(value) => setPaymentData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                  <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Payment Description</Label>
            <Input
              id="description"
              value={paymentData.description}
              onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Property purchase, down payment, etc."
            />
          </div>
        </div>

        {/* Payment Gateway Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            Payment Gateway
          </h3>
          
          <div className="grid gap-4">
            {availableGateways.map((gateway) => (
              <div
                key={gateway.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  selectedGateway === gateway.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedGateway(gateway.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      selectedGateway === gateway.id ? "border-primary bg-primary" : "border-gray-300"
                    )} />
                    <div>
                      <p className="font-medium">{gateway.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{gateway.provider}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {gateway.admin_only && (
                      <Badge variant="outline" className="text-xs">
                        Admin Only
                      </Badge>
                    )}
                    {gateway.is_default && (
                      <Badge variant="default" className="text-xs">
                        Default
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {gateway.transaction_fee_percentage}% fee
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  Supports: {gateway.supported_currencies.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Commission Tracking */}
        {agentId && agentTrackingCode && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Agent Commission Tracking
            </h3>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertTitle>Agent Referral Detected</AlertTitle>
              <AlertDescription>
                This payment will be tracked for agent commission calculation.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Tracking Code:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded border text-sm font-mono">
                    {showTrackingCode ? agentTrackingCode : "••••-••••-••••"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTrackingCode(!showTrackingCode)}
                  >
                    {showTrackingCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {commission && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Commission Rate:</span>
                    <span>{commission.commission_rate}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Estimated Commission:</span>
                    <span>${commission.commission_amount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * Commission will be held for verification period before payout
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {paymentData.amount > 0 && selectedGateway && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Summary</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${paymentData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing Fee:</span>
                <span>${processingFee.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={processPayment}
            disabled={processing || !validatePaymentData()}
            className="flex-1"
            size="lg"
          >
            {processing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </>
            )}
          </Button>
        </div>

        {/* Security Warnings */}
        {paymentData.amount > 10000 && userType !== "admin" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>High-Value Transaction Warning</AlertTitle>
            <AlertDescription>
              Payments over $10,000 require administrator approval. Please contact your system administrator.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurePaymentProcessor;
