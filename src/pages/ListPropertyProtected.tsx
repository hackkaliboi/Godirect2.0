import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import PropertyListingForm from "@/components/properties/PropertyListingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Users, Building } from "lucide-react";

const ListPropertyProtected = () => {
    const { user, userType } = useAuth();

    return (
        <>
            <Helmet>
                <title>List Your Property | GODIRECT</title>
                <meta name="description" content="List your property with GODIRECT and reach thousands of potential buyers and renters in Nigeria." />
            </Helmet>

            {/* Header Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-realty-900 to-realty-800 text-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                            List Your Property with GODIRECT
                        </h1>
                        <p className="text-xl text-realty-200 mb-8">
                            Welcome back, {user?.email?.split('@')[0] || 'Agent'}! Ready to list a new property?
                        </p>
                    </div>
                </div>
            </section>

            {/* User Info Section */}
            <section className="py-8 bg-realty-50 dark:bg-realty-900/40">
                <div className="container-custom">
                    <Card className="border-realty-200 dark:border-realty-800">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-realty-900 dark:text-white">
                                        {userType === 'agent' ? 'Real Estate Agent' : userType === 'user' ? 'Property Owner' : 'User'} Dashboard
                                    </h2>
                                    <p className="text-realty-600 dark:text-realty-400">
                                        Signed in as: {user?.email}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" asChild>
                                        <Link to={userType === 'agent' ? "/dashboard/agent" : "/dashboard/user"}>
                                            My Dashboard
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" asChild>
                                        <Link to="/properties">
                                            Browse Properties
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Property Listing Form */}
            <PropertyListingForm />

            {/* Benefits Section */}
            <section className="py-16 bg-gradient-to-r from-realty-50 to-white dark:from-realty-900/40 dark:to-realty-900/20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
                            Why List with <span className="text-realty-gold relative inline-block">
                                <span className="relative z-10">GODIRECT</span>
                                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
                            </span>
                        </h2>
                        <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
                            We provide the tools and exposure you need to sell or rent your property faster
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-white dark:bg-realty-800 rounded-lg shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-realty-100 dark:bg-realty-700 flex items-center justify-center">
                                <Users className="h-8 w-8 text-realty-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-2">Wide Reach</h3>
                            <p className="text-realty-600 dark:text-realty-400 text-sm">
                                Access to thousands of verified buyers and renters across Nigeria
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-realty-800 rounded-lg shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-realty-100 dark:bg-realty-700 flex items-center justify-center">
                                <Building className="h-8 w-8 text-realty-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-2">Premium Exposure</h3>
                            <p className="text-realty-600 dark:text-realty-400 text-sm">
                                Featured listings get priority placement in search results
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-realty-800 rounded-lg shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-realty-100 dark:bg-realty-700 flex items-center justify-center">
                                <User className="h-8 w-8 text-realty-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-2">Expert Support</h3>
                            <p className="text-realty-600 dark:text-realty-400 text-sm">
                                Dedicated support team to help with your listing process
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-realty-800 rounded-lg shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-realty-100 dark:bg-realty-700 flex items-center justify-center">
                                <Building className="h-8 w-8 text-realty-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-2">Fast Results</h3>
                            <p className="text-realty-600 dark:text-realty-400 text-sm">
                                Properties sell 40% faster on our platform compared to traditional methods
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ListPropertyProtected;