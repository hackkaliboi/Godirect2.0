import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Users, ArrowRight } from "lucide-react";

const ListProperty = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // If user is already logged in, redirect them to the protected version
    useEffect(() => {
        if (user) {
            navigate("/list-property-protected");
        }
    }, [user, navigate]);

    // If user is logged in, don't show the public page
    if (user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-lg text-realty-600 dark:text-realty-300">
                        Redirecting to your property listing dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>List Your Property | GODIRECT</title>
                <meta name="description" content="List your property with GODIRECT and reach thousands of potential buyers and renters in Nigeria." />
            </Helmet>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-realty-900 to-realty-800 text-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                            List Your Property with GODIRECT
                        </h1>
                        <p className="text-xl text-realty-200 mb-8">
                            Reach thousands of potential buyers and renters across Nigeria's major cities
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-realty-gold hover:bg-realty-gold/90 text-realty-900 font-medium text-lg px-8 py-3" asChild>
                                <Link to="/user-signup">Get Started as Owner</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white text-lg px-8 py-3" asChild>
                                <Link to="/agent-signup">Join as Agent</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-gradient-to-b from-white to-realty-50 dark:from-realty-900 dark:to-realty-900/90">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
                            How It <span className="text-realty-gold relative inline-block">
                                <span className="relative z-10">Works</span>
                                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
                            </span>
                        </h2>
                        <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
                            Listing your property with us is simple and straightforward
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-realty-100 dark:bg-realty-800 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-realty-900 dark:text-white">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-realty-900 dark:text-white mb-3">Create Account</h3>
                            <p className="text-realty-600 dark:text-realty-400">
                                Sign up as an agent or property owner to get started with listing your property.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-realty-100 dark:bg-realty-800 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-realty-900 dark:text-white">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-realty-900 dark:text-white mb-3">List Property</h3>
                            <p className="text-realty-600 dark:text-realty-400">
                                Provide detailed information about your property including photos, pricing, and features.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-realty-100 dark:bg-realty-800 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-realty-900 dark:text-white">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-realty-900 dark:text-white mb-3">Connect with Buyers</h3>
                            <p className="text-realty-600 dark:text-realty-400">
                                Our platform connects you with interested buyers and renters to close deals faster.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Options for Different Users */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
                            Listing <span className="text-realty-gold relative inline-block">
                                <span className="relative z-10">Options</span>
                                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
                            </span>
                        </h2>
                        <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
                            Choose the option that best fits your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* For Property Owners */}
                        <Card className="border-realty-200 dark:border-realty-800 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-realty-100 dark:bg-realty-800 flex items-center justify-center mb-4">
                                    <User className="h-6 w-6 text-realty-900 dark:text-white" />
                                </div>
                                <CardTitle className="text-xl text-realty-900 dark:text-white">Property Owners</CardTitle>
                                <CardDescription>
                                    List your property directly as an owner
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Free basic listing</span>
                                    </li>
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Reach verified buyers</span>
                                    </li>
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Property showcase</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full">
                                    <Link to="/user-signup">Sign Up as Owner</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* For Real Estate Agents */}
                        <Card className="border-realty-200 dark:border-realty-800 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-realty-100 dark:bg-realty-800 flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-realty-900 dark:text-white" />
                                </div>
                                <CardTitle className="text-xl text-realty-900 dark:text-white">Real Estate Agents</CardTitle>
                                <CardDescription>
                                    List multiple properties as a licensed agent
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Professional dashboard</span>
                                    </li>
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Lead management tools</span>
                                    </li>
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Commission tracking</span>
                                    </li>
                                </ul>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/agent-signup">Sign Up as Agent</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* For Existing Users */}
                        <Card className="border-realty-200 dark:border-realty-800 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-realty-100 dark:bg-realty-800 flex items-center justify-center mb-4">
                                    <Building className="h-6 w-6 text-realty-900 dark:text-white" />
                                </div>
                                <CardTitle className="text-xl text-realty-900 dark:text-white">Existing Users</CardTitle>
                                <CardDescription>
                                    Already have an account? Sign in to list a property
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Quick property listing</span>
                                    </li>
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Access to dashboard</span>
                                    </li>
                                    <li className="flex items-center">
                                        <ArrowRight className="h-4 w-4 text-realty-gold mr-2" />
                                        <span className="text-sm">Performance analytics</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full bg-realty-gold hover:bg-realty-gold/90 text-realty-900">
                                    <Link to="/login">Sign In to List Property</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

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
                                <ArrowRight className="h-8 w-8 text-realty-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-2">Fast Results</h3>
                            <p className="text-realty-600 dark:text-realty-400 text-sm">
                                Properties sell 40% faster on our platform compared to traditional methods
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-realty-900 text-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Ready to List Your Property?
                        </h2>
                        <p className="text-realty-200 text-lg mb-8">
                            Join thousands of property owners and agents who have successfully listed their properties with us
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-realty-gold hover:bg-realty-gold/90 text-realty-900 font-medium" asChild>
                                <Link to="/agent-signup">List as Agent</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white" asChild>
                                <Link to="/user-signup">List as Owner</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ListProperty;