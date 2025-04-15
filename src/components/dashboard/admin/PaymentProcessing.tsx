
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Building,
  Landmark,
  Wallet,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Filter,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPriceWithCommas } from "@/utils/data";

// Format currency for display
const formatCurrency = (value: number) => {
  return `₦${formatPriceWithCommas(value)}`;
};

// Sample transaction data (would come from backend in real implementation)
const pendingTransactions = [
  {
    id: "TX-7829",
    propertyId: "P-3845",
    propertyTitle: "3 Bedroom Apartment in Lekki Phase 1",
    buyer: "John Adebayo",
    amount: 1250000,
    commission: 62500,
    paymentMethod: "bank_transfer",
    status: "pending",
    date: "2025-04-05T14:32:00"
  },
  {
    id: "TX-7830",
    propertyId: "P-4271",
    propertyTitle: "2 Bedroom Bungalow in Abuja Central",
    buyer: "Amina Ibrahim",
    amount: 980000,
    commission: 49000,
    paymentMethod: "crypto",
    status: "pending",
    date: "2025-04-06T09:15:00"
  },
  {
    id: "TX-7831",
    propertyId: "P-3921",
    propertyTitle: "Commercial Space in Victoria Island",
    buyer: "Tunde Okoye",
    amount: 3450000,
    commission: 172500,
    paymentMethod: "ussd",
    status: "pending",
    date: "2025-04-07T11:43:00"
  }
];

const completedTransactions = [
  {
    id: "TX-7825",
    propertyId: "P-3812",
    propertyTitle: "Luxury Penthouse in Ikoyi",
    buyer: "Sarah Johnson",
    amount: 4850000,
    commission: 242500,
    paymentMethod: "bank_transfer",
    status: "completed",
    date: "2025-04-03T16:24:00"
  },
  {
    id: "TX-7826",
    propertyId: "P-4102",
    propertyTitle: "Office Space in Ikeja GRA",
    buyer: "Lagos Business Solutions",
    amount: 3250000,
    commission: 162500,
    paymentMethod: "crypto",
    status: "completed",
    date: "2025-04-04T10:05:00"
  }
];

const paymentMethods = {
  bank_transfer: { label: "Bank Transfer", icon: <Building className="h-4 w-4" /> },
  ussd: { label: "USSD Payment", icon: <CreditCard className="h-4 w-4" /> },
  crypto: { label: "Cryptocurrency", icon: <Coins className="h-4 w-4" /> },
  mobile_money: { label: "Mobile Money", icon: <Wallet className="h-4 w-4" /> },
  bank_deposit: { label: "Bank Deposit", icon: <Landmark className="h-4 w-4" /> }
};

const PaymentProcessing = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

  const handleVerifyPayment = (transaction: any) => {
    setSelectedTransaction(transaction);
    setVerificationDialogOpen(true);
  };

  const processPayment = async () => {
    if (!selectedTransaction) return;
    
    setProcessingPayment(true);
    
    try {
      // This would be an API call in a real implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Payment Verified",
        description: `Payment for ${selectedTransaction.propertyTitle} has been verified and processed.`,
      });
      
      setProcessingPayment(false);
      setVerificationDialogOpen(false);
      
      // In a real implementation, we would update the transaction status in the database
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "There was an error processing this payment. Please try again.",
      });
      setProcessingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderPaymentMethodDetails = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Bank Name:</span>
                <span className="text-sm">First Bank Nigeria</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium">Account Number:</span>
                <div className="flex items-center">
                  <span className="text-sm">2073825910</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => {
                    navigator.clipboard.writeText("2073825910");
                    toast({ description: "Account number copied to clipboard" });
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium">Account Name:</span>
                <span className="text-sm">GODIRECT PROPERTIES LTD</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Transaction Reference</Label>
              <Input id="reference" placeholder="Enter bank reference number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Transaction Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt">Upload Receipt (optional)</Label>
              <Input id="receipt" type="file" />
            </div>
          </div>
        );
      case "crypto":
        return (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Cryptocurrency:</span>
                <Select defaultValue="usdt">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select crypto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usdt">USDT (Tether)</SelectItem>
                    <SelectItem value="btc">BTC (Bitcoin)</SelectItem>
                    <SelectItem value="eth">ETH (Ethereum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium">Wallet Address:</span>
                <div className="flex items-center">
                  <span className="text-sm text-xs md:text-sm">0x7a54F6D72c01E3c84B0F85b5374852a336eB9b26</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => {
                    navigator.clipboard.writeText("0x7a54F6D72c01E3c84B0F85b5374852a336eB9b26");
                    toast({ description: "Wallet address copied to clipboard" });
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium">Network:</span>
                <span className="text-sm">BNB Smart Chain (BEP20)</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="txhash">Transaction Hash</Label>
              <Input id="txhash" placeholder="Enter transaction hash" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scshot">Upload Screenshot (optional)</Label>
              <Input id="scshot" type="file" />
            </div>
          </div>
        );
      case "ussd":
        return (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm mb-2">To pay with USSD:</div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Dial *737*2*5*<span className="font-semibold">AMOUNT</span># (GTBank)</li>
                <li>Follow the prompts to complete payment</li>
                <li>Enter the reference number below</li>
              </ol>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ussdref">USSD Reference</Label>
              <Input id="ussdref" placeholder="Enter USSD reference number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonenum">Phone Number Used</Label>
              <Input id="phonenum" placeholder="Enter phone number" />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-center">
            <p>Payment method details unavailable</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Processing</h2>
          <p className="text-muted-foreground mt-1">
            Process and verify property payments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="ussd">USSD Payment</SelectItem>
              <SelectItem value="crypto">Cryptocurrency</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="bank_deposit">Bank Deposit</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="gap-2" variant="outline">
            <FileText className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Pending Payments</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
              <CardDescription>
                Verify and process pending property payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.propertyTitle}</div>
                          <div className="text-xs text-muted-foreground">{transaction.buyer}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>₦{formatPriceWithCommas(transaction.amount)}</div>
                          <div className="text-xs text-muted-foreground">
                            Commission: ₦{formatPriceWithCommas(transaction.commission)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {paymentMethods[transaction.paymentMethod as keyof typeof paymentMethods]?.icon}
                          <span className="ml-2">{paymentMethods[transaction.paymentMethod as keyof typeof paymentMethods]?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleVerifyPayment(transaction)}>
                          Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pendingTransactions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No pending transactions
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Transactions</CardTitle>
              <CardDescription>
                History of processed property payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.propertyTitle}</div>
                          <div className="text-xs text-muted-foreground">{transaction.buyer}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>₦{formatPriceWithCommas(transaction.amount)}</div>
                          <div className="text-xs text-muted-foreground">
                            Commission: ₦{formatPriceWithCommas(transaction.commission)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {paymentMethods[transaction.paymentMethod as keyof typeof paymentMethods]?.icon}
                          <span className="ml-2">{paymentMethods[transaction.paymentMethod as keyof typeof paymentMethods]?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Settings</CardTitle>
              <CardDescription>
                Configure available payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <div>
                      <h4 className="font-medium">Bank Transfer</h4>
                      <p className="text-sm text-muted-foreground">Accept payments via bank transfer</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <div>
                      <h4 className="font-medium">USSD Payment</h4>
                      <p className="text-sm text-muted-foreground">Accept payments via USSD</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    <div>
                      <h4 className="font-medium">Cryptocurrency</h4>
                      <p className="text-sm text-muted-foreground">Accept crypto payments</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    <div>
                      <h4 className="font-medium">Mobile Money</h4>
                      <p className="text-sm text-muted-foreground">Accept mobile money payments</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center">
                    <Landmark className="h-5 w-5 mr-2" />
                    <div>
                      <h4 className="font-medium">Bank Deposit</h4>
                      <p className="text-sm text-muted-foreground">Accept bank deposits</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Verification Dialog */}
      <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Verify payment details for transaction {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTransaction && (
              <>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Property:</span>
                    <span className="text-sm">{selectedTransaction.propertyTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Buyer:</span>
                    <span className="text-sm">{selectedTransaction.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Amount:</span>
                    <span className="text-sm">{formatCurrency(selectedTransaction.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Commission:</span>
                    <span className="text-sm">{formatCurrency(selectedTransaction.commission)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Payment Method:</span>
                    <span className="text-sm">{paymentMethods[selectedTransaction.paymentMethod as keyof typeof paymentMethods]?.label}</span>
                  </div>
                </div>

                {renderPaymentMethodDetails(selectedTransaction.paymentMethod)}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerificationDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={processPayment} 
              disabled={processingPayment}
            >
              {processingPayment ? "Processing..." : "Verify Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentProcessing;
