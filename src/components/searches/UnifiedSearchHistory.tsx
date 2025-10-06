import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { savedSearchesApi, searchHistoryApi } from "@/lib/api";
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
    Clock,
    Info,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SavedSearchWithCount extends SavedSearch {
    match_count?: number;
    new_matches?: number;
}

interface SearchHistoryItem {
    id: string;
    search_query: string;
    search_filters: any;
    results_count: number;
    searched_at: string;
}

const UnifiedSearchHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"saved" | "history">("saved");
    const [savedSearches, setSavedSearches] = useState<SavedSearchWithCount[]>([]);
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
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
        alert_frequency: "daily" as "immediate" | "daily" | "weekly",
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
        { value: "immediate", label: "Instant", description: "Get notified immediately" },
        { value: "daily", label: "Daily", description: "Daily digest at 9 AM" },
        { value: "weekly", label: "Weekly", description: "Weekly summary on Mondays" },
    ];

    useEffect(() => {
        fetchAllData();
    }, [user]);

    const fetchAllData = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const [savedSearchesData, searchHistoryData] = await Promise.all([
                savedSearchesApi.getUserSavedSearches(user.id),
                searchHistoryApi.getUserSearchHistory(user.id)
            ]);

            setSavedSearches(savedSearchesData);
            setSearchHistory(searchHistoryData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch search data");
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
            location: search.search_criteria?.location || "",
            property_type: search.search_criteria?.property_type || "",
            min_price: search.search_criteria?.price_min || 0,
            max_price: search.search_criteria?.price_max || 50000000,
            min_bedrooms: search.search_criteria?.bedrooms || 0,
            max_bedrooms: search.search_criteria?.bedrooms || 10,
            min_bathrooms: 0,
            max_bathrooms: 10,
            min_sqft: 0,
            max_sqft: 10000,
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
            const searchData: any = {
                name: searchForm.name,
                search_criteria: {
                    location: searchForm.location || null,
                    property_type: searchForm.property_type || null,
                    price_min: searchForm.min_price > 0 ? searchForm.min_price : null,
                    price_max: searchForm.max_price < 50000000 ? searchForm.max_price : null,
                    bedrooms: searchForm.min_bedrooms > 0 ? searchForm.min_bedrooms : null,
                },
                alerts_enabled: searchForm.alerts_enabled,
                alert_frequency: searchForm.alert_frequency,
            };

            await savedSearchesApi.createSavedSearch(searchData);
            await fetchAllData();
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
            const updateData: any = {
                name: searchForm.name,
                search_criteria: {
                    location: searchForm.location || null,
                    property_type: searchForm.property_type || null,
                    price_min: searchForm.min_price > 0 ? searchForm.min_price : null,
                    price_max: searchForm.max_price < 50000000 ? searchForm.max_price : null,
                    bedrooms: searchForm.min_bedrooms > 0 ? searchForm.min_bedrooms : null,
                },
                alerts_enabled: searchForm.alerts_enabled,
                alert_frequency: searchForm.alert_frequency,
            };

            await savedSearchesApi.updateSavedSearch(selectedSearch.id, updateData);
            await fetchAllData();
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
            await fetchAllData();
            toast.success("Saved search deleted successfully");
        } catch (error) {
            console.error("Error deleting saved search:", error);
            toast.error("Failed to delete saved search");
        }
    };

    const toggleAlerts = async (searchId: string, enabled: boolean) => {
        try {
            await savedSearchesApi.updateSavedSearch(searchId, { alerts_enabled: enabled });
            setSavedSearches(prev =>
                prev.map(s => s.id === searchId ? { ...s, alerts_enabled: enabled } : s)
            );
            toast.success(`Alerts ${enabled ? 'enabled' : 'disabled'} for this search`);
        } catch (error) {
            console.error("Error toggling alerts:", error);
            toast.error("Failed to update alert settings");
        }
    };

    const clearSearchHistory = async () => {
        try {
            await searchHistoryApi.clearSearchHistory(user!.id);
            setSearchHistory([]);
            toast.success("Search history cleared successfully");
        } catch (error) {
            console.error("Error clearing search history:", error);
            toast.error("Failed to clear search history");
        }
    };

    const runSavedSearch = (search: SavedSearchWithCount) => {
        const params = new URLSearchParams();

        if (search.search_criteria?.location) params.set('location', search.search_criteria.location);
        if (search.search_criteria?.property_type) params.set('type', search.search_criteria.property_type);
        if (search.search_criteria?.price_min) params.set('minPrice', search.search_criteria.price_min.toString());
        if (search.search_criteria?.price_max) params.set('maxPrice', search.search_criteria.price_max.toString());
        if (search.search_criteria?.bedrooms) params.set('minBedrooms', search.search_criteria.bedrooms.toString());

        navigate(`/properties?${params.toString()}`);
    };

    const runHistorySearch = (historyItem: SearchHistoryItem) => {
        const params = new URLSearchParams();

        if (historyItem.search_query) params.set('location', historyItem.search_query);
        if (historyItem.search_filters?.property_type) params.set('type', historyItem.search_filters.property_type);
        if (historyItem.search_filters?.price_min) params.set('minPrice', historyItem.search_filters.price_min.toString());
        if (historyItem.search_filters?.price_max) params.set('maxPrice', historyItem.search_filters.price_max.toString());
        if (historyItem.search_filters?.bedrooms) params.set('minBedrooms', historyItem.search_filters.bedrooms.toString());

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

    const formatSavedSearchCriteria = (search: SavedSearchWithCount) => {
        const criteria = [];

        if (search.search_criteria?.property_type) {
            criteria.push(propertyTypes.find(t => t.value === search.search_criteria.property_type)?.label);
        }

        if (search.search_criteria?.price_min || search.search_criteria?.price_max) {
            const min = search.search_criteria.price_min ? formatCurrency(search.search_criteria.price_min) : "Any";
            const max = search.search_criteria.price_max ? formatCurrency(search.search_criteria.price_max) : "Any";
            criteria.push(`${min} - ${max}`);
        }

        if (search.search_criteria?.bedrooms) {
            criteria.push(`${search.search_criteria.bedrooms}+ beds`);
        }

        return criteria.length > 0 ? criteria.join(" • ") : "Any property";
    };

    const formatHistorySearchCriteria = (historyItem: SearchHistoryItem) => {
        const criteria = [];

        if (historyItem.search_filters?.property_type) {
            criteria.push(propertyTypes.find(t => t.value === historyItem.search_filters.property_type)?.label);
        }

        if (historyItem.search_filters?.price_min || historyItem.search_filters?.price_max) {
            const min = historyItem.search_filters.price_min ? formatCurrency(historyItem.search_filters.price_min) : "Any";
            const max = historyItem.search_filters.price_max ? formatCurrency(historyItem.search_filters.price_max) : "Any";
            criteria.push(`${min} - ${max}`);
        }

        if (historyItem.search_filters?.bedrooms) {
            criteria.push(`${historyItem.search_filters.bedrooms}+ beds`);
        }

        return criteria.length > 0 ? criteria.join(" • ") : "All properties";
    };

    const getActiveSearchCount = () => {
        return savedSearches.filter(s => s.alerts_enabled).length;
    };

    const getTotalMatches = () => {
        return savedSearches.reduce((total, s) => total + (s.match_count || 0), 0);
    };

    const getNewMatches = () => {
        return savedSearches.reduce((total, s) => total + (s.new_matches || 0), 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading search data...</div>
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
                        Search Management
                    </h1>
                    <p className="text-realty-600 dark:text-realty-400">
                        Manage your saved searches and view your search history
                    </p>
                </div>

                {activeTab === "saved" && (
                    <Button onClick={openCreateDialog} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Search
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-realty-200 dark:border-realty-700">
                <button
                    className={cn(
                        "px-4 py-2 font-medium text-sm flex items-center gap-2",
                        activeTab === "saved"
                            ? "text-realty-900 dark:text-white border-b-2 border-realty-900 dark:border-white"
                            : "text-realty-500 dark:text-realty-400 hover:text-realty-700 dark:hover:text-realty-300"
                    )}
                    onClick={() => setActiveTab("saved")}
                >
                    <Search className="h-4 w-4" />
                    Saved Searches
                </button>
                <button
                    className={cn(
                        "px-4 py-2 font-medium text-sm flex items-center gap-2",
                        activeTab === "history"
                            ? "text-realty-900 dark:text-white border-b-2 border-realty-900 dark:border-white"
                            : "text-realty-500 dark:text-realty-400 hover:text-realty-700 dark:hover:text-realty-300"
                    )}
                    onClick={() => setActiveTab("history")}
                >
                    <Clock className="h-4 w-4" />
                    Search History
                </button>
            </div>

            {/* Stats Cards - Only for Saved Searches */}
            {activeTab === "saved" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                                        Total Searches
                                    </p>
                                    <p className="text-2xl font-bold text-realty-900 dark:text-white">
                                        {savedSearches.length}
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
            )}

            {/* Information about the difference between Saved Searches and Search History */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                What's the difference?
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                <span className="font-medium">Saved Searches</span> are filter criteria that you can save and re-run at any time. You can also set up alerts to notify you when new properties match your criteria.
                                <br />
                                <span className="font-medium">Search History</span> shows a record of all your past searches for reference.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Saved Searches Tab Content */}
            {activeTab === "saved" && (
                <div className="space-y-4">
                    {savedSearches.length === 0 ? (
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
                        savedSearches.map((search) => (
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
                                                        {search.search_criteria?.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                {search.search_criteria.location}
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
                                                    {formatSavedSearchCriteria(search)}
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
                                                onClick={() => runSavedSearch(search)}
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
            )}

            {/* Search History Tab Content */}
            {activeTab === "history" && (
                <div className="space-y-4">
                    {searchHistory.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Clock className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                                    No search history
                                </h3>
                                <p className="text-realty-600 dark:text-realty-400">
                                    Your property searches will be saved here for easy access
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={clearSearchHistory} className="flex items-center gap-2">
                                    <X className="h-4 w-4" />
                                    Clear History
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {searchHistory.map((historyItem) => (
                                    <Card key={historyItem.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg mb-1 truncate">
                                                        {historyItem.search_query || "All properties"}
                                                    </h3>
                                                    <div className="bg-realty-50 dark:bg-realty-800/50 rounded-lg p-3 mb-3">
                                                        <p className="text-sm font-medium text-realty-900 dark:text-white mb-1">
                                                            Search Criteria
                                                        </p>
                                                        <p className="text-sm text-realty-600 dark:text-realty-400">
                                                            {formatHistorySearchCriteria(historyItem)}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {format(new Date(historyItem.searched_at), 'MMM dd, yyyy HH:mm')}
                                                        </div>
                                                        {historyItem.results_count > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Search className="h-4 w-4" />
                                                                {historyItem.results_count} results
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2 whitespace-nowrap"
                                                    onClick={() => runHistorySearch(historyItem)}
                                                >
                                                    <Search className="h-4 w-4" />
                                                    Search Again
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

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

export default UnifiedSearchHistory;