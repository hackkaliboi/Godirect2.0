import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Search, PlusCircle, Edit, Trash2, Copy, Eye, CheckCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Template data
const emailTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to GoDirect Real Estate!",
    category: "User",
    lastUpdated: "2025-03-15",
    status: "active",
    content: `<p>Dear {{user.firstName}},</p>
<p>Welcome to GoDirect Real Estate! We're thrilled to have you join our platform.</p>
<p>With your new account, you can:</p>
<ul>
  <li>Browse exclusive property listings</li>
  <li>Save your favorite properties</li>
  <li>Contact agents directly</li>
  <li>Receive personalized property recommendations</li>
</ul>
<p>If you have any questions, please don't hesitate to contact our support team.</p>
<p>Best regards,<br>The GoDirect Team</p>`
  },
  {
    id: 2,
    name: "Property Listing Confirmation",
    subject: "Your Property Listing Has Been Published",
    category: "Property",
    lastUpdated: "2025-04-01",
    status: "active",
    content: `<p>Dear {{user.firstName}},</p>
<p>Your property listing <strong>{{property.title}}</strong> has been successfully published on GoDirect Real Estate.</p>
<p>Property Details:</p>
<ul>
  <li>Location: {{property.location}}</li>
  <li>Price: {{property.price}}</li>
  <li>Listing Type: {{property.listingType}}</li>
  <li>Reference ID: {{property.id}}</li>
</ul>
<p>You can view and manage your listing by logging into your dashboard.</p>
<p>Best regards,<br>The GoDirect Team</p>`
  },
  {
    id: 3,
    name: "Payment Receipt",
    subject: "Payment Receipt - GoDirect Real Estate",
    category: "Transaction",
    lastUpdated: "2025-03-20",
    status: "active",
    content: `<p>Dear {{user.firstName}},</p>
<p>Thank you for your payment. This email confirms that we have received your payment of <strong>{{payment.amount}}</strong>.</p>
<p>Transaction Details:</p>
<ul>
  <li>Transaction ID: {{payment.id}}</li>
  <li>Date: {{payment.date}}</li>
  <li>Amount: {{payment.amount}}</li>
  <li>Payment Method: {{payment.method}}</li>
  <li>Description: {{payment.description}}</li>
</ul>
<p>If you have any questions about this transaction, please contact our support team.</p>
<p>Best regards,<br>The GoDirect Team</p>`
  },
  {
    id: 4,
    name: "Password Reset",
    subject: "Password Reset Request - GoDirect Real Estate",
    category: "Security",
    lastUpdated: "2025-02-10",
    status: "active",
    content: `<p>Dear {{user.firstName}},</p>
<p>We received a request to reset your password for your GoDirect Real Estate account.</p>
<p>To reset your password, please click the link below:</p>
<p><a href="{{resetLink}}">Reset Your Password</a></p>
<p>This link will expire in 24 hours. If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
<p>Best regards,<br>The GoDirect Team</p>`
  },
  {
    id: 5,
    name: "New Inquiry Notification",
    subject: "New Property Inquiry - GoDirect Real Estate",
    category: "Notification",
    lastUpdated: "2025-04-10",
    status: "active",
    content: `<p>Dear {{agent.firstName}},</p>
<p>You have received a new inquiry about property <strong>{{property.title}}</strong>.</p>
<p>Inquiry Details:</p>
<ul>
  <li>From: {{inquirer.name}}</li>
  <li>Email: {{inquirer.email}}</li>
  <li>Phone: {{inquirer.phone}}</li>
  <li>Message: {{inquiry.message}}</li>
</ul>
<p>Please respond to this inquiry as soon as possible.</p>
<p>Best regards,<br>The GoDirect Team</p>`
  },
  {
    id: 6,
    name: "Account Verification",
    subject: "Verify Your GoDirect Real Estate Account",
    category: "Security",
    lastUpdated: "2025-01-15",
    status: "inactive",
    content: `<p>Dear {{user.firstName}},</p>
<p>Thank you for creating an account with GoDirect Real Estate. To complete your registration, please verify your email address by clicking the link below:</p>
<p><a href="{{verificationLink}}">Verify Your Email</a></p>
<p>If you did not create an account with us, please ignore this email.</p>
<p>Best regards,<br>The GoDirect Team</p>`
  }
];

export default function EmailTemplates() {
  const [templates, setTemplates] = useState(emailTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    subject: "",
    category: "User",
    status: "active",
    content: ""
  });

  // Filter templates based on search query and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || template.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle template edit
  const handleEditTemplate = () => {
    const updatedTemplates = templates.map(template => 
      template.id === selectedTemplate.id ? 
      { ...template, 
        name: editFormData.name, 
        subject: editFormData.subject, 
        category: editFormData.category, 
        status: editFormData.status, 
        content: editFormData.content,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : template
    );
    
    setTemplates(updatedTemplates);
    setIsEditDialogOpen(false);
  };

  // Handle template creation
  const handleCreateTemplate = () => {
    const newTemplate = {
      id: Math.max(...templates.map(t => t.id)) + 1,
      name: editFormData.name,
      subject: editFormData.subject,
      category: editFormData.category,
      status: editFormData.status,
      content: editFormData.content,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setTemplates([...templates, newTemplate]);
    setIsNewTemplateDialogOpen(false);
  };

  // Handle template deletion
  const handleDeleteTemplate = () => {
    const updatedTemplates = templates.filter(template => template.id !== selectedTemplate.id);
    setTemplates(updatedTemplates);
    setIsDeleteDialogOpen(false);
  };

  // Initialize edit form with template data
  const initializeEditForm = (template) => {
    setSelectedTemplate(template);
    setEditFormData({
      name: template.name,
      subject: template.subject,
      category: template.category,
      status: template.status,
      content: template.content
    });
    setIsEditDialogOpen(true);
  };

  // Initialize new template form
  const initializeNewTemplateForm = () => {
    setEditFormData({
      name: "",
      subject: "",
      category: "User",
      status: "active",
      content: "<p>Enter your email content here...</p>"
    });
    setIsNewTemplateDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Email Templates"
        subtitle="Manage and customize system email templates"
        actionLabel="Back to System Config"
        actionIcon={<ArrowLeft className="h-4 w-4" />}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize emails sent to users, agents, and administrators
              </CardDescription>
            </div>
            <Button onClick={initializeNewTemplateForm}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search templates..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Property">Property</SelectItem>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{template.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell>{template.lastUpdated}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={template.status === "active" ? "default" : "secondary"}
                            className={template.status === "active" ? 
                              "bg-green-100 text-green-800 hover:bg-green-100" : 
                              "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                          >
                            {template.status === "active" ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Active
                              </span>
                            ) : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => initializeEditForm(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No templates found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Template Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              This is how the email will appear to recipients
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject</Label>
              <div className="p-2 border rounded-md bg-muted/20">
                {selectedTemplate?.subject}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Content</Label>
              <div className="border rounded-md p-4 bg-white">
                <div 
                  className="prose prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }}
                />
              </div>
            </div>
            
            <div className="bg-muted/10 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Placeholders like {{"{{"}}user.firstName{{"}}"}} will be replaced with actual data when the email is sent.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                setIsPreviewDialogOpen(false);
                initializeEditForm(selectedTemplate);
              }}
            >
              <Edit className="h-4 w-4" /> Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Make changes to the email template
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={editFormData.category} 
                  onValueChange={(value) => setEditFormData({...editFormData, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Property">Property</SelectItem>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input 
                id="subject" 
                value={editFormData.subject} 
                onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Email Content</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status" className="text-sm">Active</Label>
                  <Switch 
                    id="status" 
                    checked={editFormData.status === "active"}
                    onCheckedChange={(checked) => 
                      setEditFormData({...editFormData, status: checked ? "active" : "inactive"})
                    }
                  />
                </div>
              </div>
              <Textarea 
                id="content" 
                value={editFormData.content} 
                onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML tags and placeholders like {{"{{"}}user.firstName{{"}}"}} in your template.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTemplate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Template Dialog */}
      <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Email Template</DialogTitle>
            <DialogDescription>
              Create a new email template for the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Template Name</Label>
                <Input 
                  id="new-name" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  placeholder="e.g. Property Sold Notification"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-category">Category</Label>
                <Select 
                  value={editFormData.category} 
                  onValueChange={(value) => setEditFormData({...editFormData, category: value})}
                >
                  <SelectTrigger id="new-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Property">Property</SelectItem>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-subject">Email Subject</Label>
              <Input 
                id="new-subject" 
                value={editFormData.subject} 
                onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})}
                placeholder="e.g. Your Property Has Been Sold!"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-content">Email Content</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="new-status" className="text-sm">Active</Label>
                  <Switch 
                    id="new-status" 
                    checked={editFormData.status === "active"}
                    onCheckedChange={(checked) => 
                      setEditFormData({...editFormData, status: checked ? "active" : "inactive"})
                    }
                  />
                </div>
              </div>
              <Textarea 
                id="new-content" 
                value={editFormData.content} 
                onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML tags and placeholders like {{"{{"}}user.firstName{{"}}"}} in your template.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTemplateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTemplate}
              disabled={!editFormData.name || !editFormData.subject || !editFormData.content}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{selectedTemplate?.name}" template.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
