import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  DollarSign,
  Receipt,
  Copy,
  FileText,
  CheckCircle,
  Clock,
  Building,
  User,
  Hash,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface CommissionTransaction {
  id: string;
  transaction_reference: string;
  property_id: string;
  property_title: string;
  client_name: string;
  commission_amount: number;
  commission_rate: number;
  property_value: number;
  transaction_type: "sale" | "rental" | "lease";
  status: "pending" | "processing" | "completed" | "paid";
  created_at: string;
  expected_payment_date?: string;
  notes?: string;
}

interface NewTransactionForm {
  property_id: string;
  property_title: string;
  client_name: string;
  commission_rate: number;
  property_value: number;
  transaction_type: "sale" | "rental" | "lease";
  expected_payment_date: string;
  notes: string;
}

export default function AgentCommissionTracker() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NewTransactionForm>({
    property_id: "",
    property_title: "",
    client_name: "",
    commission_rate: 5,
    property_value: 0,
    transaction_type: "sale",
    expected_payment_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch transactions from Supabase - commission type transactions for this agent
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          property:properties(title)
        `)
        .eq('agent_id', user.id)
        .eq('type', 'commission')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load commission transactions');
        return;
      }

      // Transform the data to match our interface
      const transformedTransactions: CommissionTransaction[] = (data || []).map(transaction => ({
        id: transaction.id,
        transaction_reference: transaction.reference,
        property_id: transaction.property_id || '',
        property_title: transaction.property?.title || 'Property Transaction',
        client_name: transaction.description || 'Client', // Use description as client name for now
        commission_amount: transaction.amount,
        commission_rate: 5, // Default rate - this could be stored in metadata
        property_value: transaction.amount * 20, // Estimate based on 5% commission
        transaction_type: 'sale' as const,
        status: transaction.status as CommissionTransaction['status'],
        created_at: transaction.created_at,
        expected_payment_date: transaction.completed_at,
        notes: transaction.description
      }));

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const generateTransactionReference = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `TXN-${year}${month}-${timestamp}`;
  };

  const calculateCommission = (value: number, rate: number): number => {
    return (value * rate) / 100;
  };

  const handleCreateTransaction = async () => {
    if (!formData.property_title || !formData.client_name || formData.property_value <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const transactionReference = generateTransactionReference();
      const commissionAmount = calculateCommission(formData.property_value, formData.commission_rate);
      
      // Create commission transaction in Supabase
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          reference: transactionReference,
          agent_id: user.id,
          property_id: formData.property_id || null,
          type: 'commission',
          amount: commissionAmount,
          currency: 'NGN',
          status: 'pending',
          description: `Commission for ${formData.property_title} - Client: ${formData.client_name}`,
          metadata: {
            property_title: formData.property_title,
            client_name: formData.client_name,
            commission_rate: formData.commission_rate,
            property_value: formData.property_value,
            transaction_type: formData.transaction_type,
            expected_payment_date: formData.expected_payment_date,
            notes: formData.notes
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        toast.error('Failed to create commission transaction');
        return;
      }

      // Refresh the transactions list
      await fetchTransactions();
      
      setIsDialogOpen(false);
      resetForm();
      toast.success(`Transaction ${transactionReference} created successfully!`);
    } catch (error) {
      console.error('Error in handleCreateTransaction:', error);
      toast.error('Failed to create transaction');
    }
  };

  const resetForm = () => {
    setFormData({
      property_id: "",
      property_title: "",
      client_name: "",
      commission_rate: 5,
      property_value: 0,
      transaction_type: "sale",
      expected_payment_date: "",
      notes: "",
    });
  };

  const copyTransactionReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success("Transaction reference copied to clipboard!");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Pending", icon: Clock },
      processing: { color: "bg-blue-500", label: "Processing", icon: Clock },
      completed: { color: "bg-green-500", label: "Completed", icon: CheckCircle },
      paid: { color: "bg-emerald-500", label: "Paid", icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || Clock;

    return (
      <Badge className={cn("text-white flex items-center gap-1", config?.color)}>
        <IconComponent className="h-3 w-3" />
        {config?.label || status}
      </Badge>
    );
  };

  const getTotalCommissions = () => {
    return transactions.reduce((total, t) => total + t.commission_amount, 0);
  };

  const getPendingCommissions = () => {
    return transactions
      .filter(t => t.status === "pending" || t.status === "processing")
      .reduce((total, t) => total + t.commission_amount, 0);
  };

  const getPaidCommissions = () => {
    return transactions
      .filter(t => t.status === "paid")
      .reduce((total, t) => total + t.commission_amount, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading commission data...</div>
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
            Commission Tracker
          </h1>
          <p className="text-realty-600 dark:text-realty-400">
            Track your commission transactions and generate unique references
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Commissions
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {formatPrice(getTotalCommissions())}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-realty-600" />
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
                  {formatPrice(getPendingCommissions())}
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
                  Paid
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(getPaidCommissions())}
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
                  Transactions
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {transactions.length}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-realty-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                No transactions yet
              </h3>
              <p className="text-realty-600 dark:text-realty-400 mb-4">
                Create your first commission transaction to get started
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-realty-900 dark:text-white">
                              {transaction.property_title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400">
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {transaction.transaction_reference}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {transaction.client_name}
                              </span>
                              <span>{format(new Date(transaction.created_at), "MMM dd, yyyy")}</span>
                            </div>
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-realty-600 dark:text-realty-400">Property Value:</span>
                            <p className="font-medium">{formatPrice(transaction.property_value)}</p>
                          </div>
                          <div>
                            <span className="text-realty-600 dark:text-realty-400">Rate:</span>
                            <p className="font-medium">{transaction.commission_rate}%</p>
                          </div>
                          <div>
                            <span className="text-realty-600 dark:text-realty-400">Commission:</span>
                            <p className="font-semibold text-green-600">
                              {formatPrice(transaction.commission_amount)}
                            </p>
                          </div>
                        </div>

                        {transaction.expected_payment_date && (
                          <div className="text-sm">
                            <span className="text-realty-600 dark:text-realty-400">Expected Payment:</span>
                            <span className="ml-2">
                              {format(new Date(transaction.expected_payment_date), "MMM dd, yyyy")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyTransactionReference(transaction.transaction_reference)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Ref
                        </Button>
                        
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {transaction.transaction_type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create Commission Transaction
            </DialogTitle>
            <DialogDescription>
              Generate a unique transaction reference for your commission
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Title *</Label>
                <Input
                  placeholder="Enter property title"
                  value={formData.property_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, property_title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  placeholder="Enter client name"
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Property Value *</Label>
                <Input
                  type="number"
                  placeholder="Enter property value"
                  value={formData.property_value || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    property_value: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Commission Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Commission rate"
                  value={formData.commission_rate || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    commission_rate: parseFloat(e.target.value) || 5 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                  value={formData.transaction_type}
                  onValueChange={(value: any) => setFormData(prev => ({ 
                    ...prev, 
                    transaction_type: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rental">Rental</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Payment Date</Label>
                <Input
                  type="date"
                  value={formData.expected_payment_date}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    expected_payment_date: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Commission Amount</Label>
                <Input
                  readOnly
                  value={formatPrice(calculateCommission(formData.property_value, formData.commission_rate))}
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                placeholder="Additional notes about this transaction"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTransaction}>
              <FileText className="mr-2 h-4 w-4" />
              Create Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
