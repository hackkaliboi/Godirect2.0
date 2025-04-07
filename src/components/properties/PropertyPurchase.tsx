
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formatPriceWithCommas } from "@/utils/data";
import { Info } from "lucide-react";

interface PropertyPurchaseProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
}

const purchaseFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions."
  }),
});

const PropertyPurchase = ({ propertyId, propertyTitle, propertyPrice }: PropertyPurchaseProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Company commission percentage
  const commissionRate = 0.05; // 5% commission
  const commissionAmount = propertyPrice * commissionRate;
  
  const form = useForm<z.infer<typeof purchaseFormSchema>>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof purchaseFormSchema>) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Purchase Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Purchase Property</DialogTitle>
          <DialogDescription>
            Complete the form below to purchase {propertyTitle} for {formatPriceWithCommas(propertyPrice)}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/30 p-4 rounded-lg mb-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-blue-500" />
            <h4 className="font-medium">How the purchase process works:</h4>
          </div>
          <ol className="list-decimal list-inside space-y-1 ml-1">
            <li>Submit your details and our team will contact you</li>
            <li>We'll verify your identity and secure payment details</li>
            <li>Once payment is processed, the property seller will be paid</li>
            <li>We'll handle all documentation and title transfers</li>
          </ol>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Purchase Summary</h3>
              <div className="bg-muted/20 p-3 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Property Price:</span>
                  <span className="font-medium">{formatPriceWithCommas(propertyPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee:</span>
                  <span>{formatPriceWithCommas(commissionAmount)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>{formatPriceWithCommas(propertyPrice)}</span>
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
            
            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Processing..." : "Submit Purchase Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPurchase;
