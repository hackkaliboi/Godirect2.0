import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  User, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Home,
  Calendar,
  Info
} from 'lucide-react';
import { inquiriesApi, leadsApi } from '@/lib/api';
import { CreateInquiryRequest, CreateLeadRequest } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema
const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  inquiry_type: z.enum(['general', 'price_info', 'viewing_request', 'financing_info']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
  financing_needed: z.boolean().optional(),
  additional_requirements: z.string().optional()
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface PropertyInquiryFormProps {
  propertyId: string;
  property: {
    title: string;
    price: number;
    address: string;
    agent_id?: string;
  };
  triggerButton?: React.ReactNode;
}

const PropertyInquiryForm: React.FC<PropertyInquiryFormProps> = ({ 
  propertyId, 
  property,
  triggerButton 
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      inquiry_type: 'general',
      urgency: 'medium',
      financing_needed: false
    }
  });

  const inquiryType = watch('inquiry_type');
  const urgency = watch('urgency');

  // Prefill form with user data if logged in
  React.useEffect(() => {
    if (user) {
      // You would fetch user profile data here
      setValue('name', user.email?.split('@')[0] || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: InquiryFormData) => {
    try {
      setIsSubmitting(true);

      // Create the inquiry
      const inquiryRequest: CreateInquiryRequest = {
        property_id: propertyId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        inquiry_type: data.inquiry_type,
        message: data.message,
        urgency: data.urgency
      };

      const inquiry = await inquiriesApi.createInquiry(inquiryRequest);

      // Also create a lead if this is a new contact
      if (!user) {
        const leadRequest: CreateLeadRequest = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: 'website',
          budget_min: data.budget_range ? parseFloat(data.budget_range.split('-')[0]) : undefined,
          budget_max: data.budget_range ? parseFloat(data.budget_range.split('-')[1]) : undefined,
          notes: `Property inquiry: ${property.title}\nMessage: ${data.message}\nAdditional: ${data.additional_requirements || 'None'}`,
          tags: [
            'property-inquiry', 
            data.inquiry_type,
            data.financing_needed ? 'needs-financing' : 'cash-buyer'
          ]
        };

        await leadsApi.createLead(leadRequest);
      }

      toast.success('Your inquiry has been sent successfully! Our team will contact you soon.');
      
      // Reset form and close dialog
      reset();
      setStep(1);
      setIsOpen(false);

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInquiryTypeInfo = (type: string) => {
    switch (type) {
      case 'general':
        return {
          icon: <Info className="w-4 h-4" />,
          title: 'General Inquiry',
          description: 'Ask any questions about this property'
        };
      case 'price_info':
        return {
          icon: <DollarSign className="w-4 h-4" />,
          title: 'Price Information',
          description: 'Get detailed pricing and negotiation info'
        };
      case 'viewing_request':
        return {
          icon: <Calendar className="w-4 h-4" />,
          title: 'Viewing Request',
          description: 'Schedule a property viewing'
        };
      case 'financing_info':
        return {
          icon: <Home className="w-4 h-4" />,
          title: 'Financing Help',
          description: 'Get assistance with mortgage and financing'
        };
      default:
        return {
          icon: <MessageSquare className="w-4 h-4" />,
          title: 'Inquiry',
          description: 'Send your message'
        };
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const defaultTrigger = (
    <Button className="w-full bg-realty-800 hover:bg-realty-900 text-white">
      <MessageSquare className="w-4 h-4 mr-2" />
      Send Inquiry
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-realty-800" />
            Property Inquiry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Summary */}
          <Card className="bg-realty-50 dark:bg-realty-900/20 border-realty-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-realty-800 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-realty-900 dark:text-white">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {property.address}
                  </p>
                  <p className="text-lg font-bold text-realty-800 mt-2">
                    ₦{property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="pl-10"
                      {...register('name')}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="+234 800 000 0000"
                    className="pl-10"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="inquiry_type">
                  Inquiry Type <span className="text-red-500">*</span>
                </Label>
                <Select 
                  defaultValue="general" 
                  onValueChange={(value: any) => setValue('inquiry_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: 'general', label: 'General Inquiry' },
                      { value: 'price_info', label: 'Price Information' },
                      { value: 'viewing_request', label: 'Schedule Viewing' },
                      { value: 'financing_info', label: 'Financing Help' }
                    ].map(option => {
                      const info = getInquiryTypeInfo(option.value);
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {info.icon}
                            <div>
                              <div className="font-medium">{info.title}</div>
                              <div className="text-xs text-gray-500">{info.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Priority Level</Label>
                <Select 
                  defaultValue="medium" 
                  onValueChange={(value: any) => setValue('urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <Badge className="bg-green-100 text-green-800">Low - General Interest</Badge>
                    </SelectItem>
                    <SelectItem value="medium">
                      <Badge className="bg-yellow-100 text-yellow-800">Medium - Active Looking</Badge>
                    </SelectItem>
                    <SelectItem value="high">
                      <Badge className="bg-orange-100 text-orange-800">High - Serious Buyer</Badge>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <Badge className="bg-red-100 text-red-800">Urgent - Ready to Buy</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="bg-realty-800 hover:bg-realty-900"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="message">
                  Your Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your requirements, questions, or any specific details about your interest in this property..."
                  rows={4}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_range">Budget Range (Optional)</Label>
                  <Select onValueChange={(value) => setValue('budget_range', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50000000">Under ₦50M</SelectItem>
                      <SelectItem value="50000000-100000000">₦50M - ₦100M</SelectItem>
                      <SelectItem value="100000000-200000000">₦100M - ₦200M</SelectItem>
                      <SelectItem value="200000000-500000000">₦200M - ₦500M</SelectItem>
                      <SelectItem value="500000000-999999999">₦500M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeline">Purchase Timeline (Optional)</Label>
                  <Select onValueChange={(value) => setValue('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When are you looking to buy?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="6-12months">6-12 months</SelectItem>
                      <SelectItem value="over-12months">Over 12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="additional_requirements">Additional Requirements (Optional)</Label>
                <Textarea
                  id="additional_requirements"
                  placeholder="Any other specific requirements, preferences, or questions you have..."
                  rows={3}
                  {...register('additional_requirements')}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="financing_needed"
                  {...register('financing_needed')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="financing_needed" className="text-sm">
                  I need help with financing/mortgage
                </Label>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-realty-800 hover:bg-realty-900"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Form Summary */}
          {step === 2 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">What happens next?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Our team will review your inquiry within 2 hours</li>
                      <li>• You'll receive a confirmation email shortly</li>
                      <li>• An agent will contact you within 24 hours</li>
                      <li>• We'll schedule a viewing if requested</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyInquiryForm;
