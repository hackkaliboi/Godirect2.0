
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  RefreshCw
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for our data model
interface ComplianceDocument {
  id: number;
  title: string;
  status: string;
  lastUpdated: string;
  version: string;
  category: string;
  description: string;
}

export default function LegalCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Fetch compliance documents from activity_log (repurposing this table for legal documents)
  const { data: complianceDocuments, isLoading, refetch } = useQuery({
    queryKey: ["compliance-documents"],
    queryFn: async () => {
      // Fetch from activity_log and transform data to fit our needs
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("activity_type", "document")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching compliance documents:", error);
        throw error;
      }
      
      // Transform data to fit the ComplianceDocument interface
      // Or use mock data if none exists
      if (data && data.length > 0) {
        return data.map((doc, index) => ({
          id: index + 1,
          title: doc.description || "Untitled Document",
          status: doc.reference_table || "active",
          lastUpdated: doc.created_at || new Date().toISOString(),
          version: "1.0",
          category: doc.reference_id ? "Legal" : "Privacy",
          description: doc.description || "No description available."
        })) as ComplianceDocument[];
      }
      
      // Return mock data if no documents exist
      return [
        {
          id: 1,
          title: "Privacy Policy",
          status: "active",
          lastUpdated: "2023-01-15",
          version: "2.0",
          category: "Privacy",
          description: "Our policy regarding the collection, use, and protection of user data."
        },
        {
          id: 2,
          title: "Terms of Service",
          status: "active",
          lastUpdated: "2023-02-20",
          version: "3.1",
          category: "Legal",
          description: "The terms and conditions for using our platform."
        },
        {
          id: 3,
          title: "Cookie Policy",
          status: "pending",
          lastUpdated: "2023-03-10",
          version: "1.5",
          category: "Privacy",
          description: "Information about the cookies we use and how users can manage them."
        },
        {
          id: 4,
          title: "Compliance Report 2022",
          status: "archived",
          lastUpdated: "2022-12-31",
          version: "1.0",
          category: "Reports",
          description: "Annual report on our compliance with industry regulations."
        },
        {
          id: 5,
          title: "GDPR Compliance",
          status: "active",
          lastUpdated: "2023-04-05",
          version: "2.3",
          category: "Privacy",
          description: "Our measures to comply with the General Data Protection Regulation."
        }
      ];
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
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Add Document
              </Button>
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
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
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
