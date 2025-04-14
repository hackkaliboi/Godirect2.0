import React, { useState, useEffect } from 'react';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Settings, CheckCircle2, CreditCard, Wallet, Landmark, Building, Coins, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethod {
  id: string;
  display_name: string;
  method_name: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface PaymentMethodFormValues {
  display_name: string;
  method_name: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  configuration: Record<string, any>;
}

export default function PaymentMethodSetup() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("methods");
  const [formValues, setFormValues] = useState<PaymentMethodFormValues>({
    display_name: '',
    method_name: '',
    description: '',
    is_active: true,
    icon_name: 'CreditCard',
    configuration: {}
  });

  // Icons mapping
  const iconOptions = [
    { name: 'CreditCard', component: <CreditCard className="h-5 w-5" /> },
    { name: 'Wallet', component: <Wallet className="h-5 w-5" /> },
    { name: 'Coins', component: <Coins className="h-5 w-5" /> },
    { name: 'Landmark', component: <Landmark className="h-5 w-5" /> },
    { name: 'Building', component: <Building className="h-5 w-5" /> }
  ];

  const iconMapping: Record<string, React.ReactNode> = {
    'CreditCard': <CreditCard className="h-5 w-5" />,
    'Wallet': <Wallet className="h-5 w-5" />,
    'Coins': <Coins className="h-5 w-5" />,
    'Landmark': <Landmark className="h-5 w-5" />,
    'Building': <Building className="h-5 w-5" />
  };

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('display_name');
      
      if (error) throw error;
      
      // Process the data to ensure configuration is properly typed
      const processedData: PaymentMethod[] = (data || []).map(item => ({
        ...item,
        configuration: typeof item.configuration === 'string' 
          ? JSON.parse(item.configuration) 
          : (item.configuration || {}) as Record<string, any>
      }));
      
      setPaymentMethods(processedData);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  // Toggle payment method active status
  const togglePaymentMethodStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(methods => 
        methods.map(method => 
          method.id === id ? { ...method, is_active: !currentStatus } : method
        )
      );
      
      toast.success(`Payment method ${currentStatus ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error('Error toggling payment method:', error);
      toast.error('Failed to update payment method');
    }
  };

  // Handle opening edit dialog
  const handleEdit = (method: PaymentMethod) => {
    setEditMethod(method);
    setFormValues({
      display_name: method.display_name,
      method_name: method.method_name,
      description: method.description || '',
      is_active: method.is_active,
      icon_name: method.icon_name,
      configuration: method.configuration || {}
    });
    setHasChanges(false);
  };

  // Handle opening create dialog
  const handleCreate = () => {
    setFormValues({
      display_name: '',
      method_name: '',
      description: '',
      is_active: true,
      icon_name: 'CreditCard',
      configuration: {}
    });
    setIsCreating(true);
    setHasChanges(false);
  };

  // Handle form changes
  const handleFormChange = (key: keyof PaymentMethodFormValues, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Handle configuration field changes
  const handleConfigChange = (key: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Add new configuration field
  const addConfigField = () => {
    const newConfig = { ...formValues.configuration, '': '' };
    handleFormChange('configuration', newConfig);
  };

  // Remove configuration field
  const removeConfigField = (key: string) => {
    const newConfig = { ...formValues.configuration };
    delete newConfig[key];
    handleFormChange('configuration', newConfig);
  };

  // Save payment method changes
  const savePaymentMethod = async () => {
    if (!hasChanges) {
      if (isCreating) {
        setIsCreating(false);
      } else {
        setEditMethod(null);
      }
      return;
    }

    try {
      const savingToast = toast.loading(isCreating ? 'Creating payment method...' : 'Updating payment method...');
      
      if (isCreating) {
        // Create new payment method
        const { data, error } = await supabase
          .from('payment_methods')
          .insert({
            display_name: formValues.display_name,
            method_name: formValues.method_name,
            description: formValues.description,
            icon_name: formValues.icon_name,
            is_active: formValues.is_active,
            configuration: formValues.configuration,
            method_key: formValues.method_name.toLowerCase().replace(/\s+/g, '_')
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          // Process the newly created method to ensure configuration is properly typed
          const newMethod: PaymentMethod = {
            ...data[0],
            configuration: typeof data[0].configuration === 'string' 
              ? JSON.parse(data[0].configuration) 
              : (data[0].configuration || {}) as Record<string, any>
          };
          
          setPaymentMethods(prev => [...prev, newMethod]);
          toast.dismiss(savingToast);
          toast.success('Payment method created successfully');
          setIsCreating(false);
        }
      } else if (editMethod) {
        // Update existing payment method
        const { error } = await supabase
          .from('payment_methods')
          .update({
            display_name: formValues.display_name,
            method_name: formValues.method_name,
            description: formValues.description,
            icon_name: formValues.icon_name,
            is_active: formValues.is_active,
            configuration: formValues.configuration,
            method_key: formValues.method_name.toLowerCase().replace(/\s+/g, '_'),
            updated_at: new Date().toISOString()
          })
          .eq('id', editMethod.id);
        
        if (error) throw error;
        
        // Update local state with properly typed configuration
        setPaymentMethods(methods => 
          methods.map(method => 
            method.id === editMethod.id 
              ? { 
                ...method, 
                display_name: formValues.display_name,
                method_name: formValues.method_name,
                description: formValues.description,
                icon_name: formValues.icon_name,
                is_active: formValues.is_active,
                configuration: formValues.configuration, // Already correctly typed
                method_key: formValues.method_name.toLowerCase().replace(/\s+/g, '_'),
                updated_at: new Date().toISOString()
              } 
              : method
          )
        );
        
        toast.dismiss(savingToast);
        toast.success('Payment method updated successfully');
        setEditMethod(null);
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error(`Failed to ${isCreating ? 'create' : 'update'} payment method`);
    }
  };

  // Delete payment method
  const deletePaymentMethod = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
      toast.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };

  // Configuration for specific payment methods
  const getConfigurationFields = (methodName: string) => {
    switch (methodName.toLowerCase()) {
      case 'stripe':
        return [
          { key: 'api_key', label: 'API Key', type: 'password' },
          { key: 'webhook_secret', label: 'Webhook Secret', type: 'password' },
          { key: 'success_url', label: 'Success URL', type: 'text' },
          { key: 'cancel_url', label: 'Cancel URL', type: 'text' },
        ];
      case 'paypal':
        return [
          { key: 'client_id', label: 'Client ID', type: 'text' },
          { key: 'secret', label: 'Secret', type: 'password' },
          { key: 'environment', label: 'Environment', type: 'text' },
        ];
      case 'bank transfer':
        return [
          { key: 'account_name', label: 'Account Name', type: 'text' },
          { key: 'account_number', label: 'Account Number', type: 'text' },
          { key: 'bank_name', label: 'Bank Name', type: 'text' },
          { key: 'swift_code', label: 'SWIFT/BIC Code', type: 'text' },
        ];
      case 'cash':
        return [
          { key: 'location', label: 'Payment Location', type: 'text' },
          { key: 'instructions', label: 'Instructions', type: 'textarea' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Payment Method Setup" 
        subtitle="Configure and manage payment methods for your platform"
      />

      <Tabs defaultValue="methods" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
          <TabsTrigger value="logs">Payment Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Configure and manage accepted payment methods
                </CardDescription>
              </div>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <Alert className="bg-muted">
                  <AlertDescription className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-background p-3">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 font-medium">No payment methods configured</h3>
                    <p className="text-sm text-muted-foreground">
                      Add your first payment method to start accepting payments
                    </p>
                    <Button className="mt-4" onClick={handleCreate}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded">
                              {iconMapping[method.icon_name] || <Settings className="h-5 w-5" />}
                            </div>
                            <span className="font-medium">{method.display_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {method.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={method.is_active ? "default" : "outline"}>
                            {method.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(method.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(method)}
                            >
                              Configure
                            </Button>
                            <Switch 
                              checked={method.is_active} 
                              onCheckedChange={() => togglePaymentMethodStatus(method.id, method.is_active)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance</CardTitle>
              <CardDescription>
                Ensure your payment methods meet necessary security standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Ensure all payment integrations comply with PCI-DSS requirements and local financial regulations.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Data Encryption</p>
                      <p className="text-sm text-muted-foreground">All payment data is encrypted during transmission</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Secure Storage</p>
                      <p className="text-sm text-muted-foreground">Payment information is securely stored by providers</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Global Payment Settings</CardTitle>
              <CardDescription>Configure platform-wide payment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <div className="flex mt-1.5">
                    <select 
                      id="currency" 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="NGN"
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="payment_mode">Payment Mode</Label>
                  <div className="flex gap-4 mt-1.5">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="live" 
                        name="payment_mode" 
                        className="h-4 w-4 text-primary border-gray-300" 
                        defaultChecked 
                      />
                      <Label htmlFor="live" className="ml-2">Live</Label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="test" 
                        name="payment_mode" 
                        className="h-4 w-4 text-primary border-gray-300" 
                      />
                      <Label htmlFor="test" className="ml-2">Test</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="transaction_fees">Transaction Fees</Label>
                  <div className="grid grid-cols-2 gap-4 mt-1.5">
                    <div>
                      <Label htmlFor="fee_percent" className="text-sm text-muted-foreground">Percentage</Label>
                      <div className="flex">
                        <Input 
                          id="fee_percent" 
                          type="number" 
                          min="0"
                          max="100"
                          step="0.01"
                          defaultValue="2.5"
                        />
                        <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted">
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fee_fixed" className="text-sm text-muted-foreground">Fixed Amount</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                          <span className="text-sm">₦</span>
                        </div>
                        <Input 
                          id="fee_fixed" 
                          type="number"
                          min="0" 
                          step="0.01"
                          defaultValue="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label htmlFor="auto_capture">Automatic Payment Capture</Label>
                    <p className="text-sm text-muted-foreground">Automatically capture authorized payments</p>
                  </div>
                  <Switch id="auto_capture" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label htmlFor="payment_receipts">Send Payment Receipts</Label>
                    <p className="text-sm text-muted-foreground">Email receipts to customers after payment</p>
                  </div>
                  <Switch id="payment_receipts" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Payment Logs</CardTitle>
              <CardDescription>View recent payment activities and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-muted mb-4">
                <AlertDescription className="text-center p-4">
                  Payment logs will be available in a future update
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Payment Method Dialog */}
      <Dialog open={!!editMethod} onOpenChange={(open) => !open && setEditMethod(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure Payment Method</DialogTitle>
            <DialogDescription>
              Update payment method details and configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input 
                id="display_name" 
                value={formValues.display_name} 
                onChange={(e) => handleFormChange('display_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method_name">Method Name</Label>
              <Input 
                id="method_name" 
                value={formValues.method_name} 
                onChange={(e) => handleFormChange('method_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formValues.description} 
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((icon) => (
                  <div
                    key={icon.name}
                    className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${formValues.icon_name === icon.name ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleFormChange('icon_name', icon.name)}
                  >
                    <div className="mb-1">{icon.component}</div>
                    <span className="text-xs">{icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                checked={formValues.is_active} 
                onCheckedChange={(checked) => handleFormChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Method Configuration</Label>
              <div className="space-y-2 mt-2">
                {getConfigurationFields(formValues.method_name).map((field) => (
                  <div key={field.key} className="space-y-1">
                    <Label htmlFor={field.key} className="text-sm">{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea 
                        id={field.key}
                        value={formValues.configuration[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input 
                        id={field.key}
                        type={field.type}
                        value={formValues.configuration[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                
                {Object.keys(formValues.configuration).map((key) => {
                  // Skip fields that are already defined in the standard fields
                  if (getConfigurationFields(formValues.method_name).some(f => f.key === key)) {
                    return null;
                  }
                  
                  return (
                    <div key={key} className="grid grid-cols-[1fr,auto] gap-2 items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Key"
                            value={key} 
                            onChange={(e) => {
                              const newConfig = { ...formValues.configuration };
                              const value = newConfig[key];
                              delete newConfig[key];
                              newConfig[e.target.value] = value;
                              handleFormChange('configuration', newConfig);
                            }}
                          />
                          <Input 
                            placeholder="Value"
                            value={formValues.configuration[key]} 
                            onChange={(e) => handleConfigChange(key, e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeConfigField(key)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addConfigField}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Configuration Field
              </Button>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => editMethod && deletePaymentMethod(editMethod.id)}
            >
              Delete
            </Button>
            <div>
              <Button variant="outline" onClick={() => setEditMethod(null)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={savePaymentMethod} disabled={!hasChanges}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Payment Method Dialog */}
      <Dialog open={isCreating} onOpenChange={(open) => !open && setIsCreating(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Payment Method</DialogTitle>
            <DialogDescription>
              Configure a new payment method for your platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new_display_name">Display Name</Label>
              <Input 
                id="new_display_name" 
                value={formValues.display_name} 
                placeholder="e.g. Stripe Payments"
                onChange={(e) => handleFormChange('display_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_method_name">Method Name</Label>
              <Input 
                id="new_method_name" 
                value={formValues.method_name}
                placeholder="e.g. Stripe"
                onChange={(e) => handleFormChange('method_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_description">Description</Label>
              <Textarea 
                id="new_description" 
                value={formValues.description}
                placeholder="Description of the payment method"
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((icon) => (
                  <div
                    key={icon.name}
                    className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${formValues.icon_name === icon.name ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleFormChange('icon_name', icon.name)}
                  >
                    <div className="mb-1">{icon.component}</div>
                    <span className="text-xs">{icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="new_is_active" 
                checked={formValues.is_active} 
                onCheckedChange={(checked) => handleFormChange('is_active', checked)}
              />
              <Label htmlFor="new_is_active">Active</Label>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Method Configuration</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addConfigField}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Configuration Field
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)} className="mr-2">
              Cancel
            </Button>
            <Button 
              onClick={savePaymentMethod} 
              disabled={!formValues.display_name || !formValues.method_name}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
