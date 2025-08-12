import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentsApi } from "@/lib/api";
import { PaymentTransaction } from "@/types/database";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  DollarSign,
  Receipt,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  Calendar,
  Banknote,
  Shield,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface PaymentWithDetails extends PaymentTransaction {
  property_title?: string;
  property_price?: number;
  user_name?: string;
  agent_name?: string;
}

interface PaymentFormData {
  property_id: string;
  amount: number;
  payment_type: "deposit" | "full_payment" | "installment" | "commission";
  payment_method: "card" | "bank_transfer" | "ussd";
  currency: "NGN" | "USD";
  description?: string;
}

const PaymentManager = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentWithDetails[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentWithDetails | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    property_id: "",
    amount: 0,
    payment_type: "deposit",
    payment_method: "card",
    currency: "NGN",
    description: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const paymentStatuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500", icon: Clock },
    { value: "processing", label: "Processing", color: "bg-blue-500", icon: RefreshCw },
    { value: "completed", label: "Completed", color: "bg-green-500", icon: CheckCircle },
    { value: "failed", label: "Failed", color: "bg-red-500", icon: XCircle },
    { value: "refunded", label: "Refunded", color: "bg-purple-500", icon: RefreshCw },
  ];

  const paymentTypes = [
    { value: "deposit", label: "Deposit", description: "Property booking deposit" },
    { value: "full_payment", label: "Full Payment", description: "Complete property payment" },
    { value: "installment", label: "Installment", description: "Installment payment" },
    { value: "commission", label: "Commission", description: "Agent commission" },
  ];

  const paymentMethods = [
    { value: "card", label: "Card Payment", description: "Visa, MasterCard, Verve" },
    { value: "bank_transfer", label: "Bank Transfer", description: "Direct bank transfer" },
    { value: "ussd", label: "USSD", description: "Mobile banking USSD" },
  ];

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filter, searchTerm]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await paymentsApi.getUserTransactions(user.id);
      setTransactions(response);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (filter !== "all") {
      filtered = filtered.filter(t => t.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const initializePaystack = (transactionData: PaymentWithDetails) => {
    // Paystack initialization
    const handler = (window as any).PaystackPop?.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: user?.email,
      amount: transactionData.amount * 100, // Convert to kobo
      currency: transactionData.currency,
      ref: transactionData.reference,
      callback: (response: any) => {
        handlePaymentSuccess(response, transactionData.id);
      },
      onClose: () => {
        toast.error("Payment cancelled");
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      toast.error("Payment system not available");
    }
  };

  const initializeFlutterwave = (transactionData: PaymentWithDetails) => {
    // Flutterwave initialization
    (window as any).FlutterwaveCheckout({
      public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: transactionData.reference,
      amount: transactionData.amount,
      currency: transactionData.currency,
      payment_options: "card, banktransfer, ussd",
      customer: {
        email: user?.email,
        phone_number: user?.phone || "",
        name: user?.full_name || user?.email?.split("@")[0] || "",
      },
      callback: (response: any) => {
        if (response.status === "successful") {
          handlePaymentSuccess(response, transactionData.id);
        } else {
          handlePaymentFailure(transactionData.id);
        }
      },
      onclose: () => {
        toast.error("Payment cancelled");
      },
      customizations: {
        title: "Godirect Realty Payment",
        description: transactionData.description || "Property payment",
        logo: "/logo.png",
      },
    });
  };

  const processPayment = async () => {
    if (!paymentForm.property_id || !paymentForm.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Create transaction record
      const transactionData = {
        ...paymentForm,
        user_id: user?.id,
        status: "pending",
        currency: paymentForm.currency,
        gateway: "paystack", // or flutterwave based on user preference
      };

      const transaction = await paymentsApi.createTransaction(transactionData);

      // Initialize payment gateway
      if (transaction.gateway === "paystack") {
        initializePaystack(transaction);
      } else {
        initializeFlutterwave(transaction);
      }

    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (response: any, transactionId: string) => {
    try {
      await paymentsApi.updateTransaction(transactionId, {
        status: "completed",
        gateway_reference: response.reference || response.tx_ref,
        gateway_response: JSON.stringify(response),
      });

      await fetchTransactions();
      setIsPaymentDialogOpen(false);
      resetPaymentForm();
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Payment completed but failed to update record");
    }
  };

  const handlePaymentFailure = async (transactionId: string) => {
    try {
      await paymentsApi.updateTransaction(transactionId, {
        status: "failed",
      });

      await fetchTransactions();
      toast.error("Payment failed");
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const retryPayment = async (transaction: PaymentWithDetails) => {
    try {
      await paymentsApi.updateTransaction(transaction.id, {
        status: "pending",
      });

      if (transaction.gateway === "paystack") {
        initializePaystack(transaction);
      } else {
        initializeFlutterwave(transaction);
      }
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.error("Failed to retry payment");
    }
  };

  const refundPayment = async (transactionId: string) => {
    try {
      await paymentsApi.initiateRefund(transactionId);
      await fetchTransactions();
      toast.success("Refund initiated successfully");
    } catch (error) {
      console.error("Error initiating refund:", error);
      toast.error("Failed to initiate refund");
    }
  };

  const downloadReceipt = async (transactionId: string) => {
    try {
      const receipt = await paymentsApi.generateReceipt(transactionId);
      // Create download link
      const link = document.createElement("a");
      link.href = receipt.download_url;
      link.download = `receipt_${transactionId}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      property_id: "",
      amount: 0,
      payment_type: "deposit",
      payment_method: "card",
      currency: "NGN",
      description: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = paymentStatuses.find(s => s.value === status);
    const IconComponent = statusConfig?.icon || Clock;
    
    return (
      <Badge className={cn("text-white flex items-center gap-1", statusConfig?.color)}>
        <IconComponent className="h-3 w-3" />
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionStats = () => {
    const total = transactions.length;
    const completed = transactions.filter(t => t.status === "completed").length;
    const pending = transactions.filter(t => t.status === "pending").length;
    const totalAmount = transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    return { total, completed, pending, totalAmount };
  };

  const stats = getTransactionStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-realty-900 dark:text-white">
            Payment & Transaction Management
          </h1>
          <p className="text-realty-600 dark:text-realty-400">
            Manage property payments and view transaction history
          </p>
        </div>
        
        <Button
          onClick={() => setIsPaymentDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          New Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-realty-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-realty-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Transaction List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                  No transactions found
                </h3>
                <p className="text-realty-600 dark:text-realty-400 mb-4">
                  {searchTerm || filter !== "all" 
                    ? "Try adjusting your filters to see more transactions"
                    : "You don't have any transactions yet"
                  }
                </p>
                {searchTerm === "" && filter === "all" && (
                  <Button onClick={() => setIsPaymentDialogOpen(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Your First Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-realty-900 dark:text-white">
                              {transaction.property_title || "Property Payment"}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400">
                              <span>Ref: {transaction.reference}</span>
                              <span>{format(new Date(transaction.created_at), "MMM dd, yyyy")}</span>
                            </div>
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="outline">
                              {paymentTypes.find(t => t.value === transaction.type)?.label}
                            </Badge>
                            <span className="text-realty-600 dark:text-realty-400">
                              via {paymentMethods.find(m => m.value === transaction.method)?.label}
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-realty-900 dark:text-white">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>

                        {transaction.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReceipt(transaction.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        )}

                        {transaction.status === "failed" && (
                          <Button
                            size="sm"
                            onClick={() => retryPayment(transaction)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}

                        {transaction.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refundPayment(transaction.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const count = transactions.filter(t => t.method === method.value).length;
                    const percentage = transactions.length > 0 ? (count / transactions.length) * 100 : 0;
                    
                    return (
                      <div key={method.value} className="flex items-center justify-between">
                        <span className="text-sm">{method.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentTypes.map((type) => {
                    const count = transactions.filter(t => t.type === type.value).length;
                    const amount = transactions
                      .filter(t => t.type === type.value && t.status === "completed")
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    return (
                      <div key={type.value} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{type.label}</span>
                          <p className="text-xs text-realty-500">{count} transactions</p>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              New Payment
            </DialogTitle>
            <DialogDescription>
              Process a new property payment securely
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property ID *</Label>
                <Input
                  placeholder="Enter property ID"
                  value={paymentForm.property_id}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, property_id: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentForm.amount || ""}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select
                  value={paymentForm.payment_type}
                  onValueChange={(value: any) => setPaymentForm(prev => ({ ...prev, payment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-xs text-realty-500">{type.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paymentForm.payment_method}
                  onValueChange={(value: any) => setPaymentForm(prev => ({ ...prev, payment_method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div>
                          <p className="font-medium">{method.label}</p>
                          <p className="text-xs text-realty-500">{method.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={paymentForm.currency}
                onValueChange={(value: any) => setPaymentForm(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="Payment description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-300">Secure Payment</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Your payment is secured with industry-standard encryption and processed through certified payment gateways.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPaymentDialogOpen(false);
                resetPaymentForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={processPayment}
              disabled={isProcessingPayment}
              className="flex items-center gap-2"
            >
              {isProcessingPayment && <RefreshCw className="h-4 w-4 animate-spin" />}
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete transaction information and history
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedTransaction.property_title || "Property Payment"}
                  </h3>
                  <p className="text-realty-600 dark:text-realty-400">
                    Reference: {selectedTransaction.reference}
                  </p>
                </div>
                {getStatusBadge(selectedTransaction.status)}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-realty-600">Amount</Label>
                    <p className="font-semibold text-lg">
                      {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Payment Type</Label>
                    <p>{paymentTypes.find(t => t.value === selectedTransaction.type)?.label}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Payment Method</Label>
                    <p>{paymentMethods.find(m => m.value === selectedTransaction.method)?.label}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-realty-600">Date</Label>
                    <p>{format(new Date(selectedTransaction.created_at), "PPP p")}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Gateway</Label>
                    <p className="capitalize">{selectedTransaction.gateway}</p>
                  </div>

                  {selectedTransaction.gateway_reference && (
                    <div>
                      <Label className="text-sm text-realty-600">Gateway Reference</Label>
                      <p className="font-mono text-sm">{selectedTransaction.gateway_reference}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedTransaction.description && (
                <div>
                  <Label className="text-sm text-realty-600">Description</Label>
                  <p>{selectedTransaction.description}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedTransaction?.status === "completed" && (
              <Button onClick={() => downloadReceipt(selectedTransaction.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManager;
