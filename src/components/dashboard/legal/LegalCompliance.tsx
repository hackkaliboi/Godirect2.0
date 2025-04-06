
import React, { useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  FileCheck,
  Scales,
  FileQuestion,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

export function LegalCompliance() {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Legal & Compliance"
        subtitle="Manage legal documents, contracts, and compliance requirements"
        actionLabel="Upload Document"
        actionIcon={<Upload className="h-4 w-4" />}
        dateFilter={true}
      />
      
      <div className="flex gap-4 items-center mb-6">
        <Input 
          placeholder="Search documents..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="max-w-md"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <DashboardTabs
        variant="pills"
        tabs={[
          {
            value: "documents",
            label: "Document Approval",
            content: <DocumentApproval />
          },
          {
            value: "tax",
            label: "Tax Reporting",
            content: <TaxReporting />
          },
          {
            value: "contracts",
            label: "Contract Templates",
            content: <ContractTemplates />
          },
          {
            value: "disputes",
            label: "Dispute Resolution",
            content: <DisputeResolution />
          }
        ]}
      />
    </div>
  );
}

function DocumentApproval() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Approval System</CardTitle>
        <CardDescription>Review and approve property-related documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                title: "Paradise Heights Title Deed",
                type: "Title Deed",
                submittedBy: "Sarah Johnson",
                date: "Apr 5, 2025",
                status: "Pending"
              },
              {
                title: "Blue Ocean Apartments Purchase Agreement",
                type: "Purchase Agreement",
                submittedBy: "Michael Chen",
                date: "Apr 4, 2025",
                status: "Under Review"
              },
              {
                title: "Green Valley Land Deed",
                type: "Title Deed",
                submittedBy: "Amara Okafor",
                date: "Apr 3, 2025",
                status: "Approved"
              },
              {
                title: "Riverside Estate Tax Clearance",
                type: "Tax Document",
                submittedBy: "David Wilson",
                date: "Apr 2, 2025",
                status: "Rejected"
              },
              {
                title: "Platinum Towers Survey Plan",
                type: "Survey Plan",
                submittedBy: "Chioma Eze",
                date: "Apr 1, 2025",
                status: "Approved"
              }
            ].map((doc, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.submittedBy}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <Badge variant={
                    doc.status === "Approved" ? "default" :
                    doc.status === "Under Review" ? "outline" :
                    doc.status === "Pending" ? "secondary" : "destructive"
                  }>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {(doc.status === "Pending" || doc.status === "Under Review") && (
                      <Button size="sm">Review</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 5 of 24 documents
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function TaxReporting() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Tax Reports</CardTitle>
          <CardDescription>Generated tax reports and filings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Q1 VAT Return",
                  period: "Jan-Mar 2025",
                  generatedOn: "Apr 5, 2025",
                  status: "Filed"
                },
                {
                  name: "Income Tax Statement",
                  period: "FY 2024-2025",
                  generatedOn: "Apr 2, 2025",
                  status: "Ready to File"
                },
                {
                  name: "Property Transfer Tax",
                  period: "Mar 2025",
                  generatedOn: "Apr 1, 2025",
                  status: "Filed"
                },
                {
                  name: "Withholding Tax Summary",
                  period: "Q1 2025",
                  generatedOn: "Mar 31, 2025",
                  status: "Draft"
                },
                {
                  name: "Capital Gains Tax Report",
                  period: "FY 2024-2025",
                  generatedOn: "Mar 28, 2025",
                  status: "Filed"
                }
              ].map((report, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>{report.generatedOn}</TableCell>
                  <TableCell>
                    <Badge variant={
                      report.status === "Filed" ? "default" :
                      report.status === "Ready to File" ? "outline" : "secondary"
                    }>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Previous</Button>
          <Button>Generate New Report</Button>
          <Button variant="outline">Next</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Calendar</CardTitle>
          <CardDescription>Upcoming tax deadlines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              name: "VAT Filing",
              deadline: "Apr 21, 2025",
              daysLeft: 15,
              priority: "high"
            },
            {
              name: "Property Tax Payment",
              deadline: "May 15, 2025",
              daysLeft: 39,
              priority: "medium"
            },
            {
              name: "Annual Tax Return",
              deadline: "Jun 30, 2025",
              daysLeft: 85,
              priority: "low"
            },
            {
              name: "Withholding Tax Filing",
              deadline: "Apr 30, 2025",
              daysLeft: 24,
              priority: "medium"
            }
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <div className="font-medium">{task.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {task.deadline}
                </div>
              </div>
              <div className="text-right">
                <div className={
                  task.daysLeft < 20
                    ? "text-red-500 font-medium"
                    : task.daysLeft < 40
                    ? "text-amber-500 font-medium"
                    : "text-green-500 font-medium"
                }>
                  {task.daysLeft} days left
                </div>
                <Badge variant="outline" className="mt-1">
                  {task.priority === "high" ? "High Priority" : 
                   task.priority === "medium" ? "Medium Priority" : "Low Priority"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add Tax Deadline</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function ContractTemplates() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Contract Templates</CardTitle>
          <CardDescription>Manage legal contract templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Standard Sale Agreement",
                  type: "Sales Contract",
                  lastModified: "Apr 4, 2025",
                  status: "Active"
                },
                {
                  name: "Rental Agreement",
                  type: "Lease Contract",
                  lastModified: "Apr 2, 2025",
                  status: "Active"
                },
                {
                  name: "Property Management Contract",
                  type: "Service Agreement",
                  lastModified: "Mar 28, 2025",
                  status: "Active"
                },
                {
                  name: "Joint Venture Agreement",
                  type: "Partnership Contract",
                  lastModified: "Mar 20, 2025",
                  status: "Draft"
                },
                {
                  name: "Exclusive Agency Agreement",
                  type: "Agency Contract",
                  lastModified: "Mar 15, 2025",
                  status: "Under Review"
                }
              ].map((template, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.type}</TableCell>
                  <TableCell>{template.lastModified}</TableCell>
                  <TableCell>
                    <Badge variant={
                      template.status === "Active" ? "default" :
                      template.status === "Draft" ? "secondary" : "outline"
                    }>
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Use</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Previous</Button>
          <Button>Create Template</Button>
          <Button variant="outline">Next</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal Clauses Library</CardTitle>
          <CardDescription>Reusable legal clauses for contracts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-4">
            <Input placeholder="Search clauses..." className="w-full" />
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Payment Terms",
                description: "Standard payment schedule and penalties",
                category: "Financial"
              },
              {
                title: "Termination Clause",
                description: "Conditions for contract termination",
                category: "General"
              },
              {
                title: "Force Majeure",
                description: "Unforeseen circumstances provisions",
                category: "Legal"
              },
              {
                title: "Property Inspection",
                description: "Terms for property inspection process",
                category: "Property"
              },
              {
                title: "Dispute Resolution",
                description: "Process for resolving contractual disputes",
                category: "Legal"
              }
            ].map((clause, i) => (
              <div key={i} className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
                <div className="font-medium">{clause.title}</div>
                <div className="text-sm text-muted-foreground">{clause.description}</div>
                <Badge variant="outline" className="mt-2">{clause.category}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add New Clause</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function DisputeResolution() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Dispute Resolution Tracker</CardTitle>
          <CardDescription>Track and manage property related disputes</CardDescription>
        </div>
        <Button>New Case</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Parties Involved</TableHead>
              <TableHead>Filed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "DR-2025-042",
                subject: "Boundary Dispute - Pleasant Garden Estate",
                parties: "John Smith vs. James Williams",
                date: "Apr 5, 2025",
                status: "Open",
                priority: "High"
              },
              {
                id: "DR-2025-041",
                subject: "Contract Breach - Blue Ocean Apartments",
                parties: "Ocean View Ltd. vs. Sarah Johnson",
                date: "Apr 3, 2025",
                status: "Under Investigation",
                priority: "Medium"
              },
              {
                id: "DR-2025-040",
                subject: "Payment Dispute - Emerald Heights",
                parties: "Michael Chen vs. Emerald Properties",
                date: "Apr 1, 2025",
                status: "Mediation",
                priority: "Medium"
              },
              {
                id: "DR-2025-039",
                subject: "Property Damage Claim - Sunset Villa",
                parties: "David Wilson vs. Golden Homes Ltd.",
                date: "Mar 28, 2025",
                status: "Resolved",
                priority: "Low"
              },
              {
                id: "DR-2025-038",
                subject: "Title Dispute - Riverside Estate",
                parties: "Riverside Ltd. vs. Green Valley Corp",
                date: "Mar 25, 2025",
                status: "Legal Action",
                priority: "Critical"
              }
            ].map((dispute, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{dispute.id}</TableCell>
                <TableCell>{dispute.subject}</TableCell>
                <TableCell>{dispute.parties}</TableCell>
                <TableCell>{dispute.date}</TableCell>
                <TableCell>
                  <Badge variant={
                    dispute.status === "Resolved" ? "default" :
                    dispute.status === "Open" ? "secondary" :
                    dispute.status === "Legal Action" ? "destructive" : "outline"
                  }>
                    {dispute.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    dispute.priority === "Critical" ? "destructive" :
                    dispute.priority === "High" ? "secondary" :
                    "outline"
                  }>
                    {dispute.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {dispute.status !== "Resolved" && (
                      <Button size="sm">Update</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            View History
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
