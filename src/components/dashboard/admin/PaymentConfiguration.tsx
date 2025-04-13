
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, CreditCard, Wallet, Coins, Landmark, Plus, Settings, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function PaymentConfiguration() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMethod, setEditMethod] = useState(null);
  const [formValues, setFormValues] = useState({
    display_name: '',
    description: '',
    is_active: true,
    configuration: {}
  });

  // Icons mapping
  const iconMapping = {
    'Building': <Building className="h-5 w-5" />,
    'CreditCard': <CreditCard className="h-5 w-5" />,
    'Wallet': <Wallet className="h-5 w-5" />,
    'Coins': <Coins className="h-5 w-5" />,
    'Landmark': <Landmark className="h-5 w-5" />
  };

  // Fetch payment methods
  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .order('display_name');
        
        if (error) throw error;
        setPaymentMethods(data || []);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPaymentMethods();
  }, []);

  // Toggle payment method active status
  const togglePaymentMethodStatus = async (id, currentStatus) => {
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
  const handleEdit = (method) => {
    setEditMethod(method);
    setFormValues({
      display_name: method.display_name,
      description: method.description || '',
      is_active: method.is_active,
      configuration: method.configuration || {}
    });
  };

  // Handle form changes
  const handleFormChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save payment method changes
  const savePaymentMethod = async () => {
    if (!editMethod) return;
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          display_name: formValues.display_name,
          description: formValues.description,
          is_active: formValues.is_active,
          configuration: formValues.configuration,
          updated_at: new Date().toISOString()
        })
        .eq('id', editMethod.id);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(methods => 
        methods.map(method => 
          method.id === editMethod.id ? { ...method, ...formValues } : method
        )
      );
      
      setEditMethod(null);
      toast.success('Payment method updated');
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader 
        title="Payment Configuration" 
        subtitle="Manage and configure accepted payment methods"
      />

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Enable or disable payment methods and configure their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading payment methods...</p>
            </div>
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
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formValues.description} 
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                checked={formValues.is_active} 
                onCheckedChange={(checked) => handleFormChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            
            {/* Payment method specific configuration fields could be added here */}
            <div className="pt-2">
              <Label>Method Configuration</Label>
              <Card className="mt-2 p-4 bg-muted/50">
                <pre className="text-xs">{JSON.stringify(formValues.configuration, null, 2)}</pre>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMethod(null)}>
              Cancel
            </Button>
            <Button onClick={savePaymentMethod}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
