import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { leadsApi } from "@/lib/api";
import { Lead, LeadActivity } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  User,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Activity,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface LeadWithProperty extends Lead {
  property?: {
    title: string;
    address: string;
    price: number;
  };
  activities?: LeadActivity[];
}

const LeadManagement = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadWithProperty[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<LeadWithProperty | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: "call" as const,
    notes: "",
    scheduled_date: undefined as Date | undefined,
  });

  const leadStatuses = [
    { value: "new", label: "New", color: "bg-blue-500" },
    { value: "contacted", label: "Contacted", color: "bg-yellow-500" },
    { value: "qualified", label: "Qualified", color: "bg-green-500" },
    { value: "unqualified", label: "Unqualified", color: "bg-red-500" },
    { value: "converted", label: "Converted", color: "bg-purple-500" },
  ];

  const activityTypes = [
    { value: "call", label: "Phone Call", icon: Phone },
    { value: "email", label: "Email", icon: Mail },
    { value: "meeting", label: "Meeting", icon: User },
    { value: "viewing", label: "Property Viewing", icon: Eye },
    { value: "follow_up", label: "Follow Up", icon: Clock },
  ];

  useEffect(() => {
    fetchLeads();
  }, [user]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await leadsApi.getAgentLeads(user.id);
      setLeads(response);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      await leadsApi.updateLead(leadId, { status });
      await fetchLeads();
      toast.success("Lead status updated successfully");
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast.error("Failed to update lead status");
    }
  };

  const addActivity = async () => {
    if (!selectedLead || !newActivity.notes.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await leadsApi.addActivity(selectedLead.id, {
        type: newActivity.type,
        notes: newActivity.notes,
        scheduled_date: newActivity.scheduled_date?.toISOString(),
      });

      setNewActivity({
        type: "call",
        notes: "",
        scheduled_date: undefined,
      });
      setIsActivityDialogOpen(false);
      await fetchLeads();
      toast.success("Activity added successfully");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = leadStatuses.find(s => s.value === status);
    return (
      <Badge className={cn("text-white", statusConfig?.color)}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLeadStats = () => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const qualified = leads.filter(l => l.status === 'qualified').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    
    return { total, newLeads, qualified, converted };
  };

  const stats = getLeadStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-realty-900 dark:text-white">
            Lead Management
          </h1>
          <p className="text-realty-600 dark:text-realty-400">
            Manage and track your property leads
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Leads
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <User className="h-8 w-8 text-realty-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  New Leads
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.newLeads}
                </p>
              </div>
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Qualified
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.qualified}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Converted
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.converted}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-realty-400" />
              <Input
                placeholder="Search leads by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {leadStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="grid gap-4">
        {filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-realty-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                No leads found
              </h3>
              <p className="text-realty-600 dark:text-realty-400">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters to see more leads"
                  : "You don't have any leads yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-realty-900 dark:text-white">
                          {lead.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(lead.status)}
                    </div>

                    {lead.property && (
                      <div className="bg-realty-50 dark:bg-realty-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-realty-900 dark:text-white">
                              {lead.property.title}
                            </h4>
                            <div className="flex items-center text-sm text-realty-600 dark:text-realty-400 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {lead.property.address}
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-realty-800 dark:text-realty-gold">
                            {formatCurrency(lead.property.price)}
                          </div>
                        </div>
                      </div>
                    )}

                    {lead.budget_min && lead.budget_max && (
                      <div className="text-sm text-realty-600 dark:text-realty-400">
                        Budget: {formatCurrency(lead.budget_min)} - {formatCurrency(lead.budget_max)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>

                    <Select
                      value={lead.status}
                      onValueChange={(value) => updateLeadStatus(lead.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsActivityDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Activity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Lead Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Comprehensive view of lead information and activities
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-realty-600" />
                      <span>{selectedLead.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-realty-600" />
                      <span>{selectedLead.email}</span>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-realty-600" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lead Details</h3>
                  <div className="space-y-2">
                    <div>Status: {getStatusBadge(selectedLead.status)}</div>
                    <div>Source: <Badge variant="outline">{selectedLead.source}</Badge></div>
                    {selectedLead.budget_min && selectedLead.budget_max && (
                      <div>
                        Budget: {formatCurrency(selectedLead.budget_min)} - {formatCurrency(selectedLead.budget_max)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p className="text-realty-600 dark:text-realty-400 whitespace-pre-wrap">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Activities</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedLead.activities?.length ? (
                    selectedLead.activities.map((activity) => {
                      const ActivityIcon = activityTypes.find(t => t.value === activity.type)?.icon || Activity;
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-realty-50 dark:bg-realty-800 rounded-lg">
                          <ActivityIcon className="h-5 w-5 text-realty-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">
                                {activityTypes.find(t => t.value === activity.type)?.label}
                              </span>
                              <span className="text-sm text-realty-500">
                                {format(new Date(activity.created_at), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm text-realty-600 dark:text-realty-400">
                              {activity.notes}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-realty-500 text-center py-4">No activities yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              Record a new activity for this lead
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity-type">Activity Type</Label>
              <Select
                value={newActivity.type}
                onValueChange={(value: any) => setNewActivity(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-notes">Notes *</Label>
              <Textarea
                id="activity-notes"
                placeholder="Enter activity details..."
                value={newActivity.notes}
                onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Scheduled Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newActivity.scheduled_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newActivity.scheduled_date ? (
                      format(newActivity.scheduled_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newActivity.scheduled_date}
                    onSelect={(date) => setNewActivity(prev => ({ ...prev, scheduled_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActivityDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={addActivity}>
              Add Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
