import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { savedSearchesApi } from "@/lib/api";
import { SavedSearch } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Bell,
  BellOff,
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Move,
  Calendar,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SavedSearchWithCount extends SavedSearch {
  match_count?: number;
  new_matches?: number;
}

const SavedSearches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearchWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<SavedSearchWithCount | null>(null);
  const [searchForm, setSearchForm] = useState({
    name: "",
    location: "",
    property_type: "",
    min_price: 0,
    max_price: 50000000,
    min_bedrooms: 0,
    max_bedrooms: 10,
    min_bathrooms: 0,
    max_bathrooms: 10,
    min_sqft: 0,
    max_sqft: 10000,
    alerts_enabled: true,
    alert_frequency: "daily" as "instant" | "daily" | "weekly",
  });

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "duplex", label: "Duplex" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" },
  ];

  const alertFrequencies = [
    { value: "instant", label: "Instant", description: "Get notified immediately" },
    { value: "daily", label: "Daily", description: "Daily digest at 9 AM" },
    { value: "weekly", label: "Weekly", description: "Weekly summary on Mondays" },
  ];

  useEffect(() => {
    fetchSavedSearches();
  }, [user]);

  const fetchSavedSearches = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await savedSearchesApi.getUserSavedSearches(user.id);
      setSearches(response);
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      toast.error("Failed to fetch saved searches");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSearchForm({
      name: "",
      location: "",
      property_type: "",
      min_price: 0,
      max_price: 50000000,
      min_bedrooms: 0,
      max_bedrooms: 10,
      min_bathrooms: 0,
      max_bathrooms: 10,
      min_sqft: 0,
      max_sqft: 10000,
      alerts_enabled: true,
      alert_frequency: "daily",
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (search: SavedSearchWithCount) => {
    setSelectedSearch(search);
    setSearchForm({
      name: search.name,
      location: search.location || "",
      property_type: search.criteria.property_type || "",
      min_price: search.criteria.min_price || 0,
      max_price: search.criteria.max_price || 50000000,
      min_bedrooms: search.criteria.min_bedrooms || 0,
      max_bedrooms: search.criteria.max_bedrooms || 10,
      min_bathrooms: search.criteria.min_bathrooms || 0,
      max_bathrooms: search.criteria.max_bathrooms || 10,
      min_sqft: search.criteria.min_sqft || 0,
      max_sqft: search.criteria.max_sqft || 10000,
      alerts_enabled: search.alerts_enabled,
      alert_frequency: search.alert_frequency,
    });
    setIsEditDialogOpen(true);
  };

  const createSearch = async () => {
    if (!searchForm.name.trim()) {
      toast.error("Please provide a name for your search");
      return;
    }

    try {
      const searchData = {
        name: searchForm.name,
        location: searchForm.location || null,
        criteria: {
          property_type: searchForm.property_type || null,
          min_price: searchForm.min_price > 0 ? searchForm.min_price : null,
          max_price: searchForm.max_price < 50000000 ? searchForm.max_price : null,
          min_bedrooms: searchForm.min_bedrooms > 0 ? searchForm.min_bedrooms : null,
          max_bedrooms: searchForm.max_bedrooms < 10 ? searchForm.max_bedrooms : null,
          min_bathrooms: searchForm.min_bathrooms > 0 ? searchForm.min_bathrooms : null,
          max_bathrooms: searchForm.max_bathrooms < 10 ? searchForm.max_bathrooms : null,
          min_sqft: searchForm.min_sqft > 0 ? searchForm.min_sqft : null,
          max_sqft: searchForm.max_sqft < 10000 ? searchForm.max_sqft : null,
        },
        alerts_enabled: searchForm.alerts_enabled,
        alert_frequency: searchForm.alert_frequency,
      };

      await savedSearchesApi.createSavedSearch(searchData);
      await fetchSavedSearches();
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Saved search created successfully");
    } catch (error) {
      console.error("Error creating saved search:", error);
      toast.error("Failed to create saved search");
    }
  };

  const updateSearch = async () => {
    if (!selectedSearch || !searchForm.name.trim()) {
      toast.error("Please provide a name for your search");
      return;
    }

    try {
      const updateData = {
        name: searchForm.name,
        location: searchForm.location || null,
        criteria: {
          property_type: searchForm.property_type || null,
          min_price: searchForm.min_price > 0 ? searchForm.min_price : null,
          max_price: searchForm.max_price < 50000000 ? searchForm.max_price : null,
          min_bedrooms: searchForm.min_bedrooms > 0 ? searchForm.min_bedrooms : null,
          max_bedrooms: searchForm.max_bedrooms < 10 ? searchForm.max_bedrooms : null,
          min_bathrooms: searchForm.min_bathrooms > 0 ? searchForm.min_bathrooms : null,
          max_bathrooms: searchForm.max_bathrooms < 10 ? searchForm.max_bathrooms : null,
          min_sqft: searchForm.min_sqft > 0 ? searchForm.min_sqft : null,
          max_sqft: searchForm.max_sqft < 10000 ? searchForm.max_sqft : null,
        },
        alerts_enabled: searchForm.alerts_enabled,
        alert_frequency: searchForm.alert_frequency,
      };

      await savedSearchesApi.updateSavedSearch(selectedSearch.id, updateData);
      await fetchSavedSearches();
      setIsEditDialogOpen(false);
      setSelectedSearch(null);
      resetForm();
      toast.success("Saved search updated successfully");
    } catch (error) {
      console.error("Error updating saved search:", error);
      toast.error("Failed to update saved search");
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      await savedSearchesApi.deleteSavedSearch(searchId);
      await fetchSavedSearches();
      toast.success("Saved search deleted successfully");
    } catch (error) {
      console.error("Error deleting saved search:", error);
      toast.error("Failed to delete saved search");
    }
  };

  const toggleAlerts = async (searchId: string, enabled: boolean) => {
    try {
      await savedSearchesApi.updateSavedSearch(searchId, { alerts_enabled: enabled });
      setSearches(prev =>
        prev.map(s => s.id === searchId ? { ...s, alerts_enabled: enabled } : s)
      );
      toast.success(`Alerts ${enabled ? 'enabled' : 'disabled'} for this search`);
    } catch (error) {
      console.error("Error toggling alerts:", error);
      toast.error("Failed to update alert settings");
    }
  };

  const runSearch = (search: SavedSearchWithCount) => {
    const params = new URLSearchParams();
    
    if (search.location) params.set('location', search.location);
    if (search.criteria.property_type) params.set('type', search.criteria.property_type);
    if (search.criteria.min_price) params.set('minPrice', search.criteria.min_price.toString());
    if (search.criteria.max_price) params.set('maxPrice', search.criteria.max_price.toString());
    if (search.criteria.min_bedrooms) params.set('minBedrooms', search.criteria.min_bedrooms.toString());
    if (search.criteria.max_bedrooms) params.set('maxBedrooms', search.criteria.max_bedrooms.toString());
    if (search.criteria.min_bathrooms) params.set('minBathrooms', search.criteria.min_bathrooms.toString());
    if (search.criteria.max_bathrooms) params.set('maxBathrooms', search.criteria.max_bathrooms.toString());
    if (search.criteria.min_sqft) params.set('minSqft', search.criteria.min_sqft.toString());
    if (search.criteria.max_sqft) params.set('maxSqft', search.criteria.max_sqft.toString());

    navigate(`/properties?${params.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatSearchCriteria = (search: SavedSearchWithCount) => {
    const criteria = [];
    
    if (search.criteria.property_type) {
      criteria.push(propertyTypes.find(t => t.value === search.criteria.property_type)?.label);
    }
    
    if (search.criteria.min_price || search.criteria.max_price) {
      const min = search.criteria.min_price ? formatCurrency(search.criteria.min_price) : "Any";
      const max = search.criteria.max_price ? formatCurrency(search.criteria.max_price) : "Any";
      criteria.push(`${min} - ${max}`);
    }
    
    if (search.criteria.min_bedrooms || search.criteria.max_bedrooms) {
      const min = search.criteria.min_bedrooms || "Any";
      const max = search.criteria.max_bedrooms || "Any";
      criteria.push(`${min}-${max} beds`);
    }
    
    if (search.criteria.min_bathrooms || search.criteria.max_bathrooms) {
      const min = search.criteria.min_bathrooms || "Any";
      const max = search.criteria.max_bathrooms || "Any";
      criteria.push(`${min}-${max} baths`);
    }

    return criteria.length > 0 ? criteria.join(" • ") : "Any property";
  };

  const getActiveSearchCount = () => {
    return searches.filter(s => s.alerts_enabled).length;
  };

  const getTotalMatches = () => {
    return searches.reduce((total, s) => total + (s.match_count || 0), 0);
  };

  const getNewMatches = () => {
    return searches.reduce((total, s) => total + (s.new_matches || 0), 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading saved searches...</div>
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
            Saved Searches & Alerts
          </h1>
          <p className="text-realty-600 dark:text-realty-400">
            Save your search preferences and get notified of new matches
          </p>
        </div>
        
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Search
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Searches
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {searches.length}
                </p>
              </div>
              <Search className="h-8 w-8 text-realty-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Active Alerts
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {getActiveSearchCount()}
                </p>
              </div>
              <Bell className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Matches
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {getTotalMatches()}
                </p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  New Matches
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {getNewMatches()}
                </p>
              </div>
              <Plus className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Searches List */}
      <div className="space-y-4">
        {searches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-realty-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                No saved searches yet
              </h3>
              <p className="text-realty-600 dark:text-realty-400 mb-4">
                Create your first saved search to get notified when new properties match your criteria
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          searches.map((search) => (
            <Card key={search.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-realty-900 dark:text-white">
                          {search.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400 mt-1">
                          {search.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {search.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Created {format(new Date(search.created_at), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {search.alerts_enabled ? (
                          <Badge className="bg-green-500 text-white">
                            <Bell className="h-3 w-3 mr-1" />
                            Alerts On
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <BellOff className="h-3 w-3 mr-1" />
                            Alerts Off
                          </Badge>
                        )}
                        {search.new_matches && search.new_matches > 0 && (
                          <Badge className="bg-orange-500 text-white">
                            {search.new_matches} New
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-realty-50 dark:bg-realty-800/50 rounded-lg p-3">
                      <p className="text-sm font-medium text-realty-900 dark:text-white mb-1">
                        Search Criteria
                      </p>
                      <p className="text-sm text-realty-600 dark:text-realty-400">
                        {formatSearchCriteria(search)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400">
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {search.match_count || 0} matches
                      </div>
                      {search.alerts_enabled && (
                        <div className="flex items-center gap-1">
                          <Bell className="h-4 w-4" />
                          {alertFrequencies.find(f => f.value === search.alert_frequency)?.label} alerts
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSearch(search)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Results
                    </Button>

                    <div className="flex items-center gap-1">
                      <Switch
                        checked={search.alerts_enabled}
                        onCheckedChange={(checked) => toggleAlerts(search.id, checked)}
                      />
                      <span className="text-xs text-realty-600">Alerts</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(search)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSearch(search.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Search Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Saved Search</DialogTitle>
            <DialogDescription>
              Set up your search criteria and alert preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-name">Search Name *</Label>
                <Input
                  id="search-name"
                  placeholder="e.g., 3BR Houses in Victoria Island"
                  value={searchForm.name}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Lagos, Abuja, Port Harcourt"
                  value={searchForm.location}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={searchForm.property_type}
                  onValueChange={(value) => setSearchForm(prev => ({ ...prev, property_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any property type</SelectItem>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
              <Label>Price Range</Label>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={[searchForm.min_price, searchForm.max_price]}
                    onValueChange={([min, max]) => 
                      setSearchForm(prev => ({ ...prev, min_price: min, max_price: max }))
                    }
                    max={50000000}
                    step={100000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-realty-600">
                  <span>{formatCurrency(searchForm.min_price)}</span>
                  <span>{formatCurrency(searchForm.max_price)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bedrooms */}
            <div className="space-y-4">
              <Label>Bedrooms</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-bedrooms" className="text-sm">Minimum</Label>
                  <Select
                    value={searchForm.min_bedrooms.toString()}
                    onValueChange={(value) => setSearchForm(prev => ({ ...prev, min_bedrooms: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num === 0 ? "Any" : num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max-bedrooms" className="text-sm">Maximum</Label>
                  <Select
                    value={searchForm.max_bedrooms.toString()}
                    onValueChange={(value) => setSearchForm(prev => ({ ...prev, max_bedrooms: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num === 10 ? "10+" : num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-4">
              <Label>Bathrooms</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-bathrooms" className="text-sm">Minimum</Label>
                  <Select
                    value={searchForm.min_bathrooms.toString()}
                    onValueChange={(value) => setSearchForm(prev => ({ ...prev, min_bathrooms: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num === 0 ? "Any" : num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max-bathrooms" className="text-sm">Maximum</Label>
                  <Select
                    value={searchForm.max_bathrooms.toString()}
                    onValueChange={(value) => setSearchForm(prev => ({ ...prev, max_bathrooms: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num === 10 ? "10+" : num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Alert Settings */}
            <div className="space-y-4">
              <Label>Alert Settings</Label>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="alerts-enabled">Enable Alerts</Label>
                  <p className="text-sm text-realty-600 dark:text-realty-400">
                    Get notified when new properties match your criteria
                  </p>
                </div>
                <Switch
                  id="alerts-enabled"
                  checked={searchForm.alerts_enabled}
                  onCheckedChange={(checked) => setSearchForm(prev => ({ ...prev, alerts_enabled: checked }))}
                />
              </div>

              {searchForm.alerts_enabled && (
                <div className="space-y-2">
                  <Label>Alert Frequency</Label>
                  <Select
                    value={searchForm.alert_frequency}
                    onValueChange={(value: any) => setSearchForm(prev => ({ ...prev, alert_frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alertFrequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          <div>
                            <p className="font-medium">{freq.label}</p>
                            <p className="text-xs text-realty-500">{freq.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={createSearch}>
              Create Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Search Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Saved Search</DialogTitle>
            <DialogDescription>
              Update your search criteria and alert preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Same form content as create dialog */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-search-name">Search Name *</Label>
                <Input
                  id="edit-search-name"
                  placeholder="e.g., 3BR Houses in Victoria Island"
                  value={searchForm.name}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  placeholder="e.g., Lagos, Abuja, Port Harcourt"
                  value={searchForm.location}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={searchForm.property_type}
                  onValueChange={(value) => setSearchForm(prev => ({ ...prev, property_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any property type</SelectItem>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Price Range</Label>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={[searchForm.min_price, searchForm.max_price]}
                    onValueChange={([min, max]) => 
                      setSearchForm(prev => ({ ...prev, min_price: min, max_price: max }))
                    }
                    max={50000000}
                    step={100000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-realty-600">
                  <span>{formatCurrency(searchForm.min_price)}</span>
                  <span>{formatCurrency(searchForm.max_price)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-alerts-enabled">Enable Alerts</Label>
                  <p className="text-sm text-realty-600 dark:text-realty-400">
                    Get notified when new properties match your criteria
                  </p>
                </div>
                <Switch
                  id="edit-alerts-enabled"
                  checked={searchForm.alerts_enabled}
                  onCheckedChange={(checked) => setSearchForm(prev => ({ ...prev, alerts_enabled: checked }))}
                />
              </div>

              {searchForm.alerts_enabled && (
                <div className="space-y-2">
                  <Label>Alert Frequency</Label>
                  <Select
                    value={searchForm.alert_frequency}
                    onValueChange={(value: any) => setSearchForm(prev => ({ ...prev, alert_frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alertFrequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          <div>
                            <p className="font-medium">{freq.label}</p>
                            <p className="text-xs text-realty-500">{freq.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={updateSearch}>
              Update Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedSearches;
