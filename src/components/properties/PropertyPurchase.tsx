
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formatPriceWithCommas } from "@/utils/data";
import { Info, Building, CreditCard, Coins, Wallet, Landmark, Copy } from "lucide-react";

interface PropertyPurchaseProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
}

const purchaseFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  paymentMethod: z.enum(["bank_transfer", "ussd", "crypto", "mobile_money", "bank_deposit"], {
    required_error: "Please select a payment method."
  }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions."
  }),
});

const PropertyPurchase = ({ propertyId, propertyTitle, propertyPrice }: PropertyPurchaseProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Company commission percentage
  const commissionRate = 0.05; // 5% commission
  const commissionAmount = propertyPrice * commissionRate;
  
  const form = useForm<z.infer<typeof purchaseFormSchema>>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      paymentMethod: "bank_transfer",
      agreeTerms: false,
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values: z.infer<typeof purchaseFormSchema>) => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setShowPaymentDetails(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to process purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Purchase submitted:", {
        property: {
          id: propertyId,
          title: propertyTitle,
          price: propertyPrice,
        },
        commission: {
          rate: commissionRate,
          amount: commissionAmount,
        },
        sellerPayout: propertyPrice - commissionAmount,
        customer: values
      });
      
      toast({
        title: "Purchase Request Submitted",
        description: "Our team will contact you shortly to complete your purchase.",
      });
      
      setIsOpen(false);
      setShowPaymentDetails(false);
      setCurrentStep(1);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setShowPaymentDetails(false);
    setCurrentStep(1);
    form.reset();
  };

  const renderPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case "bank_transfer":
        return (
          <div className="space-y-4 bg-muted/30 p-4 rounded-md mt-4">
            <h3 className="font-medium">Bank Transfer Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Bank Name:</span>
                <span>First Bank Nigeria</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Number:</span>
                <div className="flex items-center">
                  <span>2073825910</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => {
                    navigator.clipboard.writeText("2073825910");
                    toast({ description: "Account number copied to clipboard" });
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Name:</span>
                <span>GODIRECT PROPERTIES LTD</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>₦{formatPriceWithCommas(propertyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reference:</span>
                <div className="flex items-center">
                  <span>PROP-{propertyId}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => {
                    navigator.clipboard.writeText(`PROP-${propertyId}`);
                    toast({ description: "Reference copied to clipboard" });
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-sm mt-4">
              <p>After making your transfer, our team will verify your payment and contact you.</p>
            </div>
          </div>
        );
      case "ussd":
        return (
          <div className="space-y-4 bg-muted/30 p-4 rounded-md mt-4">
            <h3 className="font-medium">USSD Payment Instructions</h3>
            <div className="space-y-2 text-sm">
              <p>To make payment via USSD:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Dial *737*2*5*<span className="font-semibold">{propertyPrice}</span># (GTBank)</li>
                <li>Follow the prompts to complete your payment</li>
                <li>Use reference: PROP-{propertyId}</li>
              </ol>
            </div>
            <div className="text-sm mt-4">
              <p>After completing the USSD payment, our team will verify and contact you.</p>
            </div>
          </div>
        );
      case "crypto":
        return (
          <div className="space-y-4 bg-muted/30 p-4 rounded-md mt-4">
            <h3 className="font-medium">Cryptocurrency Payment</h3>
            <div className="space-y-2 text-sm">
              <p>You can pay with USDT (Tether), Bitcoin (BTC), or Ethereum (ETH).</p>
              <div className="mt-2">
                <div className="font-medium">USDT (BEP20) Wallet Address:</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs break-all">0x7a54F6D72c01E3c84B0F85b5374852a336eB9b26</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => {
                    navigator.clipboard.writeText("0x7a54F6D72c01E3c84B0F85b5374852a336eB9b26");
                    toast({ description: "Wallet address copied to clipboard" });
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium">BTC Wallet Address:</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => {
                    navigator.clipboard.writeText("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
                    toast({ description: "Wallet address copied to clipboard" });
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p>After sending the equivalent of ₦{formatPriceWithCommas(propertyPrice)}, please email the transaction hash to payments@godirect.com with reference: PROP-{propertyId}</p>
              </div>
            </div>
          </div>
        );
      case "mobile_money":
        return (
          <div className="space-y-4 bg-muted/30 p-4 rounded-md mt-4">
            <h3 className="font-medium">Mobile Money Instructions</h3>
            <div className="space-y-2 text-sm">
              <p>Send payment to any of these mobile money accounts:</p>
              <div className="space-y-2">
                <div>
                  <div className="font-medium">MTN MoMo:</div>
                  <div className="flex justify-between">
                    <span>Phone Number:</span>
                    <span>0803 456 7890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Name:</span>
                    <span>GODIRECT PROPERTIES</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Airtel Money:</div>
                  <div className="flex justify-between">
                    <span>Phone Number:</span>
                    <span>0802 123 4567</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Name:</span>
                    <span>GODIRECT PROPERTIES</span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p>Use reference: PROP-{propertyId} and send ₦{formatPriceWithCommas(propertyPrice)}</p>
              </div>
            </div>
          </div>
        );
      case "bank_deposit":
        return (
          <div className="space-y-4 bg-muted/30 p-4 rounded-md mt-4">
            <h3 className="font-medium">Bank Deposit Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Bank Name:</span>
                <span>First Bank Nigeria</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Number:</span>
                <span>2073825910</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Name:</span>
                <span>GODIRECT PROPERTIES LTD</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>₦{formatPriceWithCommas(propertyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Deposit Reference:</span>
                <span>PROP-{propertyId}</span>
              </div>
            </div>
            <div className="text-sm mt-4">
              <p>After making your deposit, please email the deposit slip to deposits@godirect.com or upload it through your dashboard.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Purchase Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{currentStep === 1 ? "Purchase Property" : "Payment Details"}</DialogTitle>
          <DialogDescription>
            {currentStep === 1 ? 
              `Complete the form below to purchase ${propertyTitle} for ₦${formatPriceWithCommas(propertyPrice)}.` :
              `Please complete your payment for ${propertyTitle} using your selected payment method.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === 1 && !showPaymentDetails && (
          <div className="bg-muted/30 p-4 rounded-lg mb-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-blue-500" />
              <h4 className="font-medium">How the purchase process works:</h4>
            </div>
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li>Submit your details and select a payment method</li>
              <li>Complete your payment using the provided details</li>
              <li>Our team will verify your payment and process your purchase</li>
              <li>We'll handle all documentation and title transfers</li>
            </ol>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {currentStep === 1 && !showPaymentDetails ? (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                            <FormControl>
                              <RadioGroupItem value="bank_transfer" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Bank Transfer
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                            <FormControl>
                              <RadioGroupItem value="ussd" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              USSD Payment
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                            <FormControl>
                              <RadioGroupItem value="crypto" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Coins className="mr-2 h-4 w-4" />
                              Cryptocurrency
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                            <FormControl>
                              <RadioGroupItem value="mobile_money" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Wallet className="mr-2 h-4 w-4" />
                              Mobile Money
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-3">
                            <FormControl>
                              <RadioGroupItem value="bank_deposit" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Landmark className="mr-2 h-4 w-4" />
                              Bank Deposit
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Purchase Summary</h3>
                  <div className="bg-muted/20 p-3 rounded space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Property Price:</span>
                      <span className="font-medium">₦{formatPriceWithCommas(propertyPrice)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service Fee:</span>
                      <span>₦{formatPriceWithCommas(commissionAmount)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>₦{formatPriceWithCommas(propertyPrice)}</span>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the terms and conditions of this purchase
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              renderPaymentMethodDetails()
            )}
            
            <DialogFooter className="pt-4">
              {currentStep === 1 ? (
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Proceed to Payment
                </Button>
              ) : (
                <div className="flex flex-col w-full gap-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Purchase"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="w-full"
                  >
                    Change Payment Method
                  </Button>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPurchase;
