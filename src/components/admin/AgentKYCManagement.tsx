import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
    Search,
    MoreHorizontal,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Eye,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Shield,
    FileText,
    RefreshCw
} from "lucide-react";
import { adminSecurityApi } from "@/lib/api";

interface AgentKYC {
    kyc_id: string;
    agent_id: string;
    agent_name: string;
    agent_email: string;
    agent_phone?: string;
    agent_avatar?: string;
    submitted_at: string;
    verification_status: 'pending' | 'under_review' | 'verified' | 'rejected';
    documents_count: number;
    document_types: string[];
    risk_flags: string[];
    notes?: string;
}

export function AgentKYCManagement() {
    const [agents, setAgents] = useState<AgentKYC[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<AgentKYC | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const fetchPendingVerifications = async () => {
        try {
            setLoading(true);
            const pendingVerifications = await adminSecurityApi.getPendingKYCVerifications();
            setAgents(pendingVerifications);
        } catch (error) {
            console.error('Error fetching pending verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (kycId: string, decision: 'approve' | 'reject') => {
        try {
            setActionLoading(true);
            await adminSecurityApi.verifyAgentKYC(kycId, decision, decision === 'reject' ? rejectionReason : undefined);

            // Update local state
            setAgents(agents.map(agent =>
                agent.kyc_id === kycId
                    ? { ...agent, verification_status: decision === 'approve' ? 'verified' : 'rejected' }
                    : agent
            ));

            // Close dialog
            setSelectedAgent(null);
            setRejectionReason("");
        } catch (error) {
            console.error('Error verifying agent:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "verified":
                return "bg-success text-success-foreground";
            case "pending":
                return "bg-warning text-warning-foreground";
            case "under_review":
                return "bg-blue text-blue-foreground";
            case "rejected":
                return "bg-destructive text-destructive-foreground";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "verified":
                return <CheckCircle className="h-4 w-4" />;
            case "pending":
                return <AlertTriangle className="h-4 w-4" />;
            case "under_review":
                return <Eye className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertTriangle className="h-4 w-4" />;
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Agent KYC Verification
                    </CardTitle>
                    <Button onClick={fetchPendingVerifications} variant="outline">
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search agents..."
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading verification requests...</p>
                    </div>
                ) : agents.length === 0 ? (
                    <div className="text-center py-12">
                        <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Pending Verifications</h3>
                        <p className="text-muted-foreground">
                            All agent verification requests have been processed
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Documents</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Risk Flags</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agents.map((agent) => (
                                <TableRow key={agent.kyc_id}>
                                    <TableCell className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={agent.agent_avatar} />
                                            <AvatarFallback>
                                                {agent.agent_name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{agent.agent_name}</div>
                                            <div className="text-sm text-muted-foreground">{agent.agent_email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(agent.submitted_at).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(agent.submitted_at).toLocaleTimeString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span>{agent.documents_count} documents</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {getStatusIcon(agent.verification_status)}
                                            <Badge className={`ml-2 ${getStatusColor(agent.verification_status)}`}>
                                                {agent.verification_status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {agent.risk_flags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {agent.risk_flags.map((flag, index) => (
                                                    <Badge key={index} variant="destructive" className="text-xs">
                                                        {flag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => setSelectedAgent(agent)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Review Documents
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleVerification(agent.kyc_id, 'approve')}
                                                    className="text-success"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve Verification
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedAgent(agent);
                                                        setRejectionReason("");
                                                    }}
                                                    className="text-destructive"
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject Verification
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* Verification Dialog */}
            <Dialog open={!!selectedAgent} onOpenChange={(open) => {
                if (!open) {
                    setSelectedAgent(null);
                    setRejectionReason("");
                }
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Agent Verification</DialogTitle>
                        <DialogDescription>
                            Review the documents and information submitted by {selectedAgent?.agent_name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAgent && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Agent Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedAgent.agent_name}</p>
                                        <p><span className="font-medium">Email:</span> {selectedAgent.agent_email}</p>
                                        {selectedAgent.agent_phone && (
                                            <p><span className="font-medium">Phone:</span> {selectedAgent.agent_phone}</p>
                                        )}
                                        <p><span className="font-medium">Submitted:</span> {new Date(selectedAgent.submitted_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Verification Status</h4>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(selectedAgent.verification_status)}
                                        <Badge className={getStatusColor(selectedAgent.verification_status)}>
                                            {selectedAgent.verification_status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <h4 className="font-medium mt-4 mb-2">Documents Submitted</h4>
                                    <div className="space-y-2">
                                        {selectedAgent.document_types.map((type, index) => (
                                            <div key={index} className="flex items-center text-sm">
                                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <span>{type.replace('_', ' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Risk Assessment</h4>
                                {selectedAgent.risk_flags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAgent.risk_flags.map((flag, index) => (
                                            <Badge key={index} variant="destructive">{flag}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No risk flags detected</p>
                                )}
                            </div>

                            {selectedAgent.verification_status === 'rejected' && selectedAgent.notes && (
                                <div>
                                    <h4 className="font-medium mb-2">Rejection Reason</h4>
                                    <div className="bg-destructive/10 p-3 rounded text-sm">
                                        {selectedAgent.notes}
                                    </div>
                                </div>
                            )}

                            {selectedAgent.verification_status === 'pending' && (
                                <div>
                                    <h4 className="font-medium mb-2">Action Required</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="rejectionReason" className="text-sm font-medium">
                                                Rejection Reason (if rejecting)
                                            </label>
                                            <Textarea
                                                id="rejectionReason"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Enter reason for rejection..."
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedAgent(null);
                                                    setRejectionReason("");
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleVerification(selectedAgent.kyc_id, 'reject')}
                                                disabled={actionLoading || !rejectionReason.trim()}
                                            >
                                                {actionLoading ? "Processing..." : "Reject"}
                                            </Button>
                                            <Button
                                                onClick={() => handleVerification(selectedAgent.kyc_id, 'approve')}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Processing..." : "Approve"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedAgent.verification_status !== 'pending' && (
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedAgent(null);
                                            setRejectionReason("");
                                        }}
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}