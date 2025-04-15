
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  FileText,
  Search,
  FileCheck,
  Scale,
  FileQuestion,
  Download,
  Upload,
  Eye,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileUp,
  FilePlus,
  FileEdit,
  Filter,
  Plus
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Define interfaces for our data model
interface ComplianceDocument {
  id: string;
  title: string;
  status: string;
  lastUpdated: string;
  version: string;
  category: string;
  description: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: string;
  expiryDate?: string;
  tags?: string[];
  requiresSignature?: boolean;
  signedBy?: string[];
  relatedDocuments?: string[];
}

interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
}

interface ComplianceAudit {
  id: string;
  title: string;
  type: string;
  scheduledDate: string;
  status: string;
  assignedTo?: string;
  notes?: string;
  relatedDocuments?: string[];
  findings?: AuditFinding[];
}

interface AuditFinding {
  id: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  dueDate?: string;
}

interface DocumentUploadState {
  file: File | null;
  title: string;
  category: string;
  description: string;
  tags: string;
  expiryDate: string;
  requiresSignature: boolean;
  progress: number;
  uploading: boolean;
}

export default function LegalCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<ComplianceDocument | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [uploadState, setUploadState] = useState<DocumentUploadState>({
    file: null,
    title: "",
    category: "",
    description: "",
    tags: "",
    expiryDate: "",
    requiresSignature: false,
    progress: 0,
    uploading: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch compliance documents from legal_documents table
  const { data: complianceDocuments, isLoading, refetch } = useQuery({
    queryKey: ["compliance-documents", selectedCategory, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("legal_documents")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Apply filters if selected
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      
      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching compliance documents:", error);
        throw error;
      }
      
      // Transform data to fit the ComplianceDocument interface
      if (data && data.length > 0) {
        return data.map(doc => ({
          id: doc.id,
          title: doc.title || "Untitled Document",
          status: doc.status || "active",
          lastUpdated: doc.updated_at || doc.created_at,
          version: doc.version || "1.0",
          category: doc.category || "Legal",
          description: doc.description || "No description available.",
          fileUrl: doc.file_url,
          fileType: doc.file_type,
          fileSize: doc.file_size,
          uploadedBy: doc.uploaded_by,
          expiryDate: doc.expiry_date,
          tags: doc.tags,
          requiresSignature: doc.requires_signature,
          signedBy: doc.signed_by,
          relatedDocuments: doc.related_documents
        })) as ComplianceDocument[];
      }
      
      // If no documents exist, create initial documents
      if (!data || data.length === 0) {
        const initialDocuments = [
          {
            id: crypto.randomUUID(),
            title: "Privacy Policy",
            status: "active",
            version: "1.0",
            category: "Privacy",
            description: "Our policy regarding the collection, use, and protection of user data.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ["privacy", "data protection"],
            requires_signature: true
          },
          {
            id: crypto.randomUUID(),
            title: "Terms of Service",
            status: "active",
            version: "1.0",
            category: "Legal",
            description: "The terms and conditions for using our platform.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ["terms", "conditions"],
            requires_signature: true
          },
          {
            id: crypto.randomUUID(),
            title: "Anti-Money Laundering Policy",
            status: "active",
            version: "1.0",
            category: "Compliance",
            description: "Our policies and procedures to prevent money laundering activities.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ["aml", "compliance"],
            requires_signature: false
          },
          {
            id: crypto.randomUUID(),
            title: "Data Retention Policy",
            status: "active",
            version: "1.0",
            category: "Privacy",
            description: "Guidelines on how long we retain different types of user data.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ["data", "retention"],
            requires_signature: false
          },
          {
            id: crypto.randomUUID(),
            title: "GDPR Compliance",
            status: "active",
            version: "1.0",
            category: "Compliance",
            description: "Our measures to comply with the General Data Protection Regulation.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ["gdpr", "compliance", "privacy"],
            requires_signature: false
          }
        ];
        
        // Insert initial documents
        for (const doc of initialDocuments) {
          await supabase.from("legal_documents").insert(doc);
        }
        
        // Fetch the newly created documents
        const { data: newData } = await supabase
          .from("legal_documents")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (newData) {
          return newData.map(doc => ({
            id: doc.id,
            title: doc.title || "Untitled Document",
            status: doc.status || "active",
            lastUpdated: doc.updated_at || doc.created_at,
            version: doc.version || "1.0",
            category: doc.category || "Legal",
            description: doc.description || "No description available.",
            fileUrl: doc.file_url,
            fileType: doc.file_type,
            fileSize: doc.file_size,
            uploadedBy: doc.uploaded_by,
            expiryDate: doc.expiry_date,
            tags: doc.tags,
            requiresSignature: doc.requires_signature,
            signedBy: doc.signed_by,
            relatedDocuments: doc.related_documents
          })) as ComplianceDocument[];
        }
      }
      
      return [];
    }
  });
  
  // Fetch document categories
  const { data: documentCategories } = useQuery({
    queryKey: ["document-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_documents")
        .select("category")
        .order("category");

      if (error) {
        console.error("Error fetching document categories:", error);
        throw error;
      }
      
      // Count documents by category
      const categories = data?.reduce((acc, doc) => {
        const category = doc.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = { count: 0, name: category };
        }
        acc[category].count++;
        return acc;
      }, {} as Record<string, { count: number, name: string }>);
      
      // Transform to array
      return Object.entries(categories || {}).map(([id, { name, count }]) => ({
        id,
        name,
        documentCount: count
      })) as DocumentCategory[];
    }
  });
  
  // Fetch compliance audits
  const { data: complianceAudits, isLoading: isLoadingAudits } = useQuery({
    queryKey: ["compliance-audits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_audits")
        .select("*")
        .order("scheduled_date", { ascending: false });

      if (error) {
        console.error("Error fetching compliance audits:", error);
        return [];
      }
      
      if (data && data.length > 0) {
        return data.map(audit => ({
          id: audit.id,
          title: audit.title,
          type: audit.type,
          scheduledDate: audit.scheduled_date,
          status: audit.status,
          assignedTo: audit.assigned_to,
          notes: audit.notes,
          relatedDocuments: audit.related_documents,
          findings: audit.findings
        })) as ComplianceAudit[];
      }
      
      // Return empty array if no audits exist
      return [];
    }
  });

  // Handle document search
  const filteredDocuments = complianceDocuments?.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "Legal compliance documents have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh compliance documents",
        variant: "destructive",
      });
      console.error("Error refreshing documents:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Legal & Compliance</h1>
        <p className="text-muted-foreground">
          Manage legal documents, compliance reports, and regulatory adherence
        </p>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Compliance Documents</TabsTrigger>
          <TabsTrigger value="reporting">Compliance Reporting</TabsTrigger>
          <TabsTrigger value="audits">Compliance Audits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Upload Legal Document</DialogTitle>
                    <DialogDescription>
                      Add a new legal or compliance document to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Document Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter document title"
                        value={uploadState.title}
                        onChange={(e) => setUploadState(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={uploadState.category}
                        onValueChange={(value) => setUploadState(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Legal">Legal</SelectItem>
                          <SelectItem value="Privacy">Privacy</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                          <SelectItem value="Reports">Reports</SelectItem>
                          <SelectItem value="Contracts">Contracts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter document description"
                        value={uploadState.description}
                        onChange={(e) => setUploadState(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="privacy, compliance, legal"
                        value={uploadState.tags}
                        onChange={(e) => setUploadState(prev => ({ ...prev, tags: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry Date (if applicable)</Label>
                      <Input
                        id="expiry"
                        type="date"
                        value={uploadState.expiryDate}
                        onChange={(e) => setUploadState(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="requires-signature"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={uploadState.requiresSignature}
                        onChange={(e) => setUploadState(prev => ({ ...prev, requiresSignature: e.target.checked }))}
                      />
                      <Label htmlFor="requires-signature">Requires Signature</Label>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="file">Document File</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                      </div>
                      {uploadState.file && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {uploadState.file.name} ({Math.round(uploadState.file.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                    {uploadState.uploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadState.progress}%</span>
                        </div>
                        <Progress value={uploadState.progress} />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setUploadState({
                        file: null,
                        title: "",
                        category: "",
                        description: "",
                        tags: "",
                        expiryDate: "",
                        requiresSignature: false,
                        progress: 0,
                        uploading: false
                      });
                    }}>Cancel</Button>
                    <Button onClick={uploadDocument} disabled={uploadState.uploading || !uploadState.file || !uploadState.title}>
                      {uploadState.uploading ? "Uploading..." : "Upload Document"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>Manage and review legal and compliance documents</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="divide-y divide-border">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="p-4">
                        <Skeleton className="h-5 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))
                  ) : filteredDocuments && filteredDocuments.length > 0 ? (
                    filteredDocuments.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Version {doc.version} • Last Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {doc.description}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{doc.category}</Badge>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>{doc.title}</DialogTitle>
                                  <DialogDescription>
                                    Version {doc.version} • Last Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">{doc.category}</Badge>
                                    <Badge variant="outline" className={getStatusColor(doc.status)}>{doc.status}</Badge>
                                    {doc.tags?.map(tag => (
                                      <Badge key={tag} variant="outline">{tag}</Badge>
                                    ))}
                                  </div>
                                  
                                  <div className="border rounded-md p-4 bg-muted/20">
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                                  </div>
                                  
                                  {doc.fileUrl ? (
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Document Preview</h4>
                                      {doc.fileType?.includes('image') ? (
                                        <div className="border rounded-md overflow-hidden">
                                          <img src={doc.fileUrl} alt={doc.title} className="max-w-full h-auto" />
                                        </div>
                                      ) : doc.fileType?.includes('pdf') ? (
                                        <div className="border rounded-md h-[400px] overflow-hidden">
                                          <iframe src={doc.fileUrl} className="w-full h-full" title={doc.title}></iframe>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center border rounded-md p-8">
                                          <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                                          <p className="text-muted-foreground">Preview not available for this file type</p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="border rounded-md p-4 bg-muted/20 text-center">
                                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                      <p className="text-muted-foreground">No file attached to this document</p>
                                    </div>
                                  )}
                                  
                                  {doc.requiresSignature && (
                                    <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
                                      <div className="flex items-center gap-2 text-yellow-800">
                                        <AlertTriangle className="h-5 w-5" />
                                        <h4 className="font-medium">Signature Required</h4>
                                      </div>
                                      {doc.signedBy && doc.signedBy.length > 0 ? (
                                        <div className="mt-2">
                                          <p className="text-sm text-yellow-700">Signed by: {doc.signedBy.join(', ')}</p>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-yellow-700 mt-2">This document requires signature but has not been signed yet.</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  {doc.fileUrl && (
                                    <a href={doc.fileUrl} download target="_blank" rel="noopener noreferrer">
                                      <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                      </Button>
                                    </a>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the document "{doc.title}". This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteDocument(doc.id)}>Delete</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No documents found. Try adjusting your search or add a new document.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reporting</CardTitle>
              <CardDescription>Generate and manage compliance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="report_type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Report Type
                  </label>
                  <Select defaultValue="gdpr">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gdpr">GDPR Compliance</SelectItem>
                      <SelectItem value="ccpa">CCPA Compliance</SelectItem>
                      <SelectItem value="iso27001">ISO 27001 Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="report_year" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Year
                  </label>
                  <Select defaultValue="2023">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>View recently generated compliance reports</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">GDPR Compliance Report</div>
                      <div className="text-sm text-muted-foreground">Generated on March 15, 2023</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">CCPA Compliance Report</div>
                      <div className="text-sm text-muted-foreground">Generated on February 28, 2023</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">ISO 27001 Compliance Report</div>
                      <div className="text-sm text-muted-foreground">Generated on January 20, 2023</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audits" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Audits</CardTitle>
              <CardDescription>Schedule and manage compliance audits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="audit_type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Audit Type
                  </label>
                  <Select defaultValue="security">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security">Security Audit</SelectItem>
                      <SelectItem value="privacy">Privacy Audit</SelectItem>
                      <SelectItem value="financial">Financial Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="audit_date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Scheduled Date
                  </label>
                  <Input type="date" id="audit_date" className="w-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="audit_notes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Additional Notes
                </label>
                <Input type="text" id="audit_notes" className="w-full" placeholder="Enter any additional notes" />
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Scale className="mr-2 h-4 w-4" />
                  Schedule Audit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Audits</CardTitle>
              <CardDescription>View scheduled compliance audits</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Security Audit</div>
                      <div className="text-sm text-muted-foreground">Scheduled for April 22, 2023</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Privacy Audit</div>
                      <div className="text-sm text-muted-foreground">Scheduled for May 10, 2023</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
