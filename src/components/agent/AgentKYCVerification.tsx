import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { agentSecurityApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Shield,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  User,
  Building,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Lock,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KYCFormData {
  personal_info: {
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
  };
  contact_info: {
    email: string;
    phone: string;
    alternative_phone: string;
  };
  addresses: {
    residential: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
    office: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
  };
  professional_info: {
    license_number: string;
    license_expiry: string;
    certification: string;
    experience_years: number;
    specializations: string[];
  };
  identity_documents: {
    type: string;
    number: string;
    expiry_date: string;
    front_image: File | null;
    back_image: File | null;
  };
  professional_documents: {
    license_document: File | null;
    certificate_document: File | null;
  };
  financial_info: {
    bank_account_number: string;
    bank_name: string;
    bank_code: string;
    account_holder_name: string;
    tax_id: string;
  };
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
}

const AgentKYCVerification = () => {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<KYCFormData>({
    personal_info: {
      first_name: "",
      last_name: "",
      middle_name: "",
      date_of_birth: "",
      gender: "",
      nationality: "",
    },
    contact_info: {
      email: "",
      phone: "",
      alternative_phone: "",
    },
    addresses: {
      residential: {
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
      office: {
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
    },
    professional_info: {
      license_number: "",
      license_expiry: "",
      certification: "",
      experience_years: 0,
      specializations: [],
    },
    identity_documents: {
      type: "",
      number: "",
      expiry_date: "",
      front_image: null,
      back_image: null,
    },
    professional_documents: {
      license_document: null,
      certificate_document: null,
    },
    financial_info: {
      bank_account_number: "",
      bank_name: "",
      bank_code: "",
      account_holder_name: "",
      tax_id: "",
    },
    emergency_contact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });

  const kycSteps = [
    { id: 0, title: "Personal Information", icon: User, description: "Basic personal details" },
    { id: 1, title: "Contact & Address", icon: MapPin, description: "Contact information and addresses" },
    { id: 2, title: "Professional Details", icon: Briefcase, description: "License and certifications" },
    { id: 3, title: "Identity Documents", icon: FileText, description: "Government-issued ID" },
    { id: 4, title: "Financial Information", icon: CreditCard, description: "Banking details for commissions" },
    { id: 5, title: "Emergency Contact", icon: Phone, description: "Emergency contact information" },
    { id: 6, title: "Review & Submit", icon: CheckCircle, description: "Final review and submission" },
  ];

  const specializations = [
    "Residential Sales",
    "Commercial Sales",
    "Property Management",
    "Investment Properties",
    "Luxury Homes",
    "First-Time Buyers",
    "Rental Properties",
    "Land Development",
  ];

  useEffect(() => {
    fetchKYCStatus();
  }, [user]);

  const fetchKYCStatus = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const status = await agentSecurityApi.getKYCStatus(user.id);
      setKycStatus(status);
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      toast.error("Failed to fetch verification status");
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "under_review":
        return "bg-blue-500";
      case "rejected":
        return "bg-red-500";
      case "suspended":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return CheckCircle;
      case "pending":
        return AlertTriangle;
      case "under_review":
        return Eye;
      case "rejected":
        return XCircle;
      case "suspended":
        return Lock;
      default:
        return AlertTriangle;
    }
  };

  const calculateProgress = () => {
    const totalSteps = kycSteps.length - 1; // Excluding review step
    return (currentStep / totalSteps) * 100;
  };

  const handleInputChange = (section: keyof KYCFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: keyof KYCFormData, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (section: keyof KYCFormData, field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: file
      }
    }));
  };

  const validateCurrentStep = () => {
    // Add validation logic for each step
    switch (currentStep) {
      case 0: // Personal Information
        return formData.personal_info.first_name && 
               formData.personal_info.last_name && 
               formData.personal_info.date_of_birth &&
               formData.personal_info.gender &&
               formData.personal_info.nationality;
      
      case 1: // Contact & Address
        return formData.contact_info.email && 
               formData.contact_info.phone &&
               formData.addresses.residential.street &&
               formData.addresses.residential.city &&
               formData.addresses.residential.state;
               
      case 2: // Professional Details
        return formData.professional_info.license_number &&
               formData.professional_info.license_expiry &&
               formData.professional_info.experience_years > 0;
               
      case 3: // Identity Documents
        return formData.identity_documents.type &&
               formData.identity_documents.number &&
               formData.identity_documents.expiry_date &&
               formData.identity_documents.front_image;
               
      case 4: // Financial Information
        return formData.financial_info.bank_account_number &&
               formData.financial_info.bank_name &&
               formData.financial_info.account_holder_name;
               
      case 5: // Emergency Contact
        return formData.emergency_contact.name &&
               formData.emergency_contact.relationship &&
               formData.emergency_contact.phone;
               
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, kycSteps.length - 1));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const submitKYC = async () => {
    try {
      setSubmitting(true);
      const result = await agentSecurityApi.submitKYC(formData);
      
      if (result.success) {
        toast.success("KYC information submitted successfully! You'll receive an email once verification is complete.");
        await fetchKYCStatus();
      } else {
        toast.error("Failed to submit KYC information");
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("An error occurred while submitting your information: " + (error.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading verification status...</div>
        </div>
      </div>
    );
  }

  if (kycStatus?.verification_status === "verified") {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Verification Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your agent profile has been fully verified and all features are now available.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Commission Tracking</h3>
                <p className="text-sm text-gray-600">Earn and track commissions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Lead Management</h3>
                <p className="text-sm text-gray-600">Receive and manage leads</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-sm text-gray-600">Process secure transactions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getVerificationIcon(kycStatus?.verification_status || "pending");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getVerificationStatusColor(kycStatus?.verification_status || "pending")}`}>
            <StatusIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Agent Verification (KYC)
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Complete your Know Your Customer (KYC) verification to unlock all agent features including 
          commission tracking, payment processing, and lead management.
        </p>
        
        {kycStatus?.verification_status && (
          <Badge 
            className={`mt-4 ${getVerificationStatusColor(kycStatus.verification_status)} text-white`}
          >
            {kycStatus.verification_status.replace('_', ' ').toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Current Restrictions */}
      {!kycStatus?.can_process_payments && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Account Restrictions</AlertTitle>
          <AlertDescription>
            Until your verification is complete, you have limited access to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Maximum {kycStatus?.max_monthly_leads || 10} leads per month</li>
              <li>Commission payments held for {kycStatus?.commission_hold_period_days || 30} days</li>
              <li>Limited payment processing capabilities</li>
              <li>No direct client payment handling</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* KYC Form */}
      {kycStatus?.verification_status !== "verified" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Complete Your Verification</span>
              <span className="text-sm font-normal">
                Step {currentStep + 1} of {kycSteps.length}
              </span>
            </CardTitle>
            <Progress value={calculateProgress()} className="w-full" />
          </CardHeader>
          <CardContent>
            {/* Step Navigation */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto">
              {kycSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex flex-col items-center space-y-2 cursor-pointer transition-colors min-w-0 flex-1",
                      isActive && "text-primary",
                      isCompleted && "text-green-600"
                    )}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                        isActive && "border-primary bg-primary text-white",
                        isCompleted && "border-green-600 bg-green-600 text-white",
                        !isActive && !isCompleted && "border-gray-300"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium truncate">{step.title}</p>
                      <p className="text-xs text-gray-500 truncate">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.personal_info.first_name}
                        onChange={(e) => handleInputChange("personal_info", "first_name", e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.personal_info.last_name}
                        onChange={(e) => handleInputChange("personal_info", "last_name", e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.personal_info.middle_name}
                        onChange={(e) => handleInputChange("personal_info", "middle_name", e.target.value)}
                        placeholder="Enter your middle name (optional)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.personal_info.date_of_birth}
                        onChange={(e) => handleInputChange("personal_info", "date_of_birth", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.personal_info.gender}
                        onValueChange={(value) => handleInputChange("personal_info", "gender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Input
                        id="nationality"
                        value={formData.personal_info.nationality}
                        onChange={(e) => handleInputChange("personal_info", "nationality", e.target.value)}
                        placeholder="Enter your nationality"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Contact Information & Addresses
                  </h3>
                  
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.contact_info.email}
                          onChange={(e) => handleInputChange("contact_info", "email", e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Primary Phone *</Label>
                        <Input
                          id="phone"
                          value={formData.contact_info.phone}
                          onChange={(e) => handleInputChange("contact_info", "phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="altPhone">Alternative Phone</Label>
                        <Input
                          id="altPhone"
                          value={formData.contact_info.alternative_phone}
                          onChange={(e) => handleInputChange("contact_info", "alternative_phone", e.target.value)}
                          placeholder="+1 (555) 987-6543"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Residential Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="resStreet">Street Address *</Label>
                        <Input
                          id="resStreet"
                          value={formData.addresses.residential.street}
                          onChange={(e) => handleNestedInputChange("addresses", "residential", "street", e.target.value)}
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resCity">City *</Label>
                        <Input
                          id="resCity"
                          value={formData.addresses.residential.city}
                          onChange={(e) => handleNestedInputChange("addresses", "residential", "city", e.target.value)}
                          placeholder="New York"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resState">State/Province *</Label>
                        <Input
                          id="resState"
                          value={formData.addresses.residential.state}
                          onChange={(e) => handleNestedInputChange("addresses", "residential", "state", e.target.value)}
                          placeholder="NY"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resCountry">Country</Label>
                        <Input
                          id="resCountry"
                          value={formData.addresses.residential.country}
                          onChange={(e) => handleNestedInputChange("addresses", "residential", "country", e.target.value)}
                          placeholder="United States"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resPostal">Postal Code</Label>
                        <Input
                          id="resPostal"
                          value={formData.addresses.residential.postal_code}
                          onChange={(e) => handleNestedInputChange("addresses", "residential", "postal_code", e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Office Address */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Office Address (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="offStreet">Street Address</Label>
                        <Input
                          id="offStreet"
                          value={formData.addresses.office.street}
                          onChange={(e) => handleNestedInputChange("addresses", "office", "street", e.target.value)}
                          placeholder="456 Business Ave"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="offCity">City</Label>
                        <Input
                          id="offCity"
                          value={formData.addresses.office.city}
                          onChange={(e) => handleNestedInputChange("addresses", "office", "city", e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="offState">State/Province</Label>
                        <Input
                          id="offState"
                          value={formData.addresses.office.state}
                          onChange={(e) => handleNestedInputChange("addresses", "office", "state", e.target.value)}
                          placeholder="NY"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="offCountry">Country</Label>
                        <Input
                          id="offCountry"
                          value={formData.addresses.office.country}
                          onChange={(e) => handleNestedInputChange("addresses", "office", "country", e.target.value)}
                          placeholder="United States"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="offPostal">Postal Code</Label>
                        <Input
                          id="offPostal"
                          value={formData.addresses.office.postal_code}
                          onChange={(e) => handleNestedInputChange("addresses", "office", "postal_code", e.target.value)}
                          placeholder="10002"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="licenseNumber">Real Estate License Number *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.professional_info.license_number}
                        onChange={(e) => handleInputChange("professional_info", "license_number", e.target.value)}
                        placeholder="Enter your license number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="licenseExpiry">License Expiry Date *</Label>
                      <Input
                        id="licenseExpiry"
                        type="date"
                        value={formData.professional_info.license_expiry}
                        onChange={(e) => handleInputChange("professional_info", "license_expiry", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="certification">Professional Certification</Label>
                      <Input
                        id="certification"
                        value={formData.professional_info.certification}
                        onChange={(e) => handleInputChange("professional_info", "certification", e.target.value)}
                        placeholder="e.g., CRE, CCIM, GRI"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experienceYears">Years of Experience *</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.professional_info.experience_years}
                        onChange={(e) => handleInputChange("professional_info", "experience_years", parseInt(e.target.value) || 0)}
                        placeholder="Enter years of experience"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Specialization Areas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {specializations.map((spec) => {
                        const isSelected = formData.professional_info.specializations.includes(spec);
                        return (
                          <div
                            key={spec}
                            className={cn(
                              "p-3 border rounded-lg cursor-pointer transition-colors text-sm text-center",
                              isSelected 
                                ? "bg-primary text-white border-primary" 
                                : "border-gray-200 hover:border-primary"
                            )}
                            onClick={() => {
                              const current = formData.professional_info.specializations;
                              const updated = isSelected
                                ? current.filter(s => s !== spec)
                                : [...current, spec];
                              handleInputChange("professional_info", "specializations", updated);
                            }}
                          >
                            {spec}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {formData.professional_info.specializations.length} areas
                    </p>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Identity Documents
                  </h3>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Document Security</AlertTitle>
                    <AlertDescription>
                      All document uploads are encrypted and securely stored. Only authorized personnel can access your documents for verification purposes.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="identityType">Identity Document Type *</Label>
                      <Select
                        value={formData.identity_documents.type}
                        onValueChange={(value) => handleInputChange("identity_documents", "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national_id">National ID Card</SelectItem>
                          <SelectItem value="passport">International Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="identityNumber">Document Number *</Label>
                      <Input
                        id="identityNumber"
                        value={formData.identity_documents.number}
                        onChange={(e) => handleInputChange("identity_documents", "number", e.target.value)}
                        placeholder="Enter document number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="identityExpiry">Expiry Date *</Label>
                      <Input
                        id="identityExpiry"
                        type="date"
                        value={formData.identity_documents.expiry_date}
                        onChange={(e) => handleInputChange("identity_documents", "expiry_date", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frontImage">Front Side Image *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload front side</p>
                        <Input
                          id="frontImage"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("identity_documents", "front_image", file);
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('frontImage')?.click()}
                        >
                          Choose File
                        </Button>
                        {formData.identity_documents.front_image && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.identity_documents.front_image.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="backImage">Back Side Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload back side (if applicable)</p>
                        <Input
                          id="backImage"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("identity_documents", "back_image", file);
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('backImage')?.click()}
                        >
                          Choose File
                        </Button>
                        {formData.identity_documents.back_image && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.identity_documents.back_image.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Document Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ensure documents are clear and readable</li>
                      <li>• All information must be visible and not obscured</li>
                      <li>• Documents must be current and not expired</li>
                      <li>• Accepted formats: JPG, PNG, PDF (max 5MB each)</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Financial Information
                  </h3>
                  
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertTitle>Commission Payments</AlertTitle>
                    <AlertDescription>
                      This banking information will be used for commission payments. All financial data is encrypted and securely stored.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        value={formData.financial_info.bank_name}
                        onChange={(e) => handleInputChange("financial_info", "bank_name", e.target.value)}
                        placeholder="Enter your bank name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={formData.financial_info.bank_account_number}
                        onChange={(e) => handleInputChange("financial_info", "bank_account_number", e.target.value)}
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                      <Input
                        id="accountHolderName"
                        value={formData.financial_info.account_holder_name}
                        onChange={(e) => handleInputChange("financial_info", "account_holder_name", e.target.value)}
                        placeholder="Name as shown on bank account"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bankCode">Bank Code / Routing Number</Label>
                      <Input
                        id="bankCode"
                        value={formData.financial_info.bank_code}
                        onChange={(e) => handleInputChange("financial_info", "bank_code", e.target.value)}
                        placeholder="Bank routing/sort code"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="taxId">Tax Identification Number</Label>
                      <Input
                        id="taxId"
                        value={formData.financial_info.tax_id}
                        onChange={(e) => handleInputChange("financial_info", "tax_id", e.target.value)}
                        placeholder="SSN, EIN, or Tax ID (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Commission payments will be processed to this account</li>
                      <li>• Verify all information is correct to avoid payment delays</li>
                      <li>• Account must be in your name and active</li>
                      <li>• International accounts may require additional verification</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contact
                  </h3>
                  
                  <p className="text-gray-600">
                    Provide emergency contact information for security and account recovery purposes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Full Name *</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergency_contact.name}
                        onChange={(e) => handleInputChange("emergency_contact", "name", e.target.value)}
                        placeholder="Emergency contact full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship *</Label>
                      <Select
                        value={formData.emergency_contact.relationship}
                        onValueChange={(value) => handleInputChange("emergency_contact", "relationship", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="colleague">Colleague</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number *</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergency_contact.phone}
                        onChange={(e) => handleInputChange("emergency_contact", "phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyEmail">Email Address</Label>
                      <Input
                        id="emergencyEmail"
                        type="email"
                        value={formData.emergency_contact.email}
                        onChange={(e) => handleInputChange("emergency_contact", "email", e.target.value)}
                        placeholder="contact@example.com (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Privacy Notice</h4>
                    <p className="text-sm text-gray-700">
                      Emergency contact information is kept confidential and will only be used in case of account security issues, 
                      verification needs, or genuine emergencies related to your agent activities.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Additional steps would continue here following the same pattern... */}
              
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review & Submit
                  </h3>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Data Security</AlertTitle>
                    <AlertDescription>
                      All submitted information is encrypted and stored securely. Your data will only be 
                      used for verification purposes and compliance with regulatory requirements.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">What happens next?</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Your documents will be reviewed by our security team</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Background verification will be conducted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>You'll receive email updates on verification progress</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Full agent features will be unlocked upon approval</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              {currentStep < kycSteps.length - 1 ? (
                <Button onClick={nextStep} disabled={!validateCurrentStep()}>
                  Next
                </Button>
              ) : (
                <Button onClick={submitKYC} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentKYCVerification;
