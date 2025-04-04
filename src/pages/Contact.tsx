
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 1500);
  };
  
  const officeLocations = [
    {
      name: "Main Office",
      address: "1234 Property Lane, Real Estate City, RE 56789",
      phone: "(555) 123-4567",
      email: "info@homepulse.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed"
    },
    {
      name: "Downtown Branch",
      address: "567 Urban Avenue, Cityville, CV 12345",
      phone: "(555) 987-6543",
      email: "downtown@homepulse.com",
      hours: "Mon-Fri: 9:00 AM - 7:00 PM\nSat: 10:00 AM - 5:00 PM\nSun: Closed"
    },
    {
      name: "Suburban Office",
      address: "890 Quiet Street, Suburbtown, ST 34567",
      phone: "(555) 246-8102",
      email: "suburban@homepulse.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM\nSat: By Appointment\nSun: Closed"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | HomePulse Realty</title>
        <meta name="description" content="Get in touch with HomePulse Realty. We're here to answer your questions and help with all your real estate needs." />
      </Helmet>
      
      <section className="bg-realty-50 dark:bg-realty-800/30 py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
              Contact Us
            </h1>
            <p className="text-lg text-realty-600 dark:text-realty-300">
              Have questions or need assistance? Our team is here to help you with all your real estate needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {officeLocations.map((office, index) => (
              <div key={index} className="bg-white dark:bg-realty-800 rounded-xl shadow-md p-6 flex flex-col h-full">
                <h3 className="text-xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                  {office.name}
                </h3>
                
                <div className="space-y-4 flex-grow">
                  <div className="flex">
                    <MapPin className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-3 flex-shrink-0" />
                    <p className="text-realty-600 dark:text-realty-300">
                      {office.address}
                    </p>
                  </div>
                  
                  <div className="flex">
                    <Phone className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-3 flex-shrink-0" />
                    <p className="text-realty-600 dark:text-realty-300">
                      {office.phone}
                    </p>
                  </div>
                  
                  <div className="flex">
                    <Mail className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-3 flex-shrink-0" />
                    <p className="text-realty-600 dark:text-realty-300">
                      {office.email}
                    </p>
                  </div>
                  
                  <div className="flex">
                    <Clock className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-3 flex-shrink-0" />
                    <p className="text-realty-600 dark:text-realty-300 whitespace-pre-line">
                      {office.hours}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-6 text-realty-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-realty-600 dark:text-realty-300 mb-6">
                Fill out the form below and one of our representatives will get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-realty-900 dark:text-white">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-realty-900 dark:text-white">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-realty-900 dark:text-white">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-realty-900 dark:text-white">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-realty-900 dark:text-white">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-realty-800 hover:bg-realty-900 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div className="aspect-[4/3] bg-realty-100 dark:bg-realty-700 rounded-xl overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-realty-500 dark:text-realty-300">
                Map goes here
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-white dark:bg-realty-900 py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6 text-realty-900 dark:text-white">
              Connect With Us
            </h2>
            <p className="text-realty-600 dark:text-realty-300 mb-8">
              Follow us on social media for the latest property listings, market insights, and real estate tips.
            </p>
            
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-realty-50 dark:bg-realty-800 p-4 rounded-full hover:bg-realty-100 dark:hover:bg-realty-700 transition-colors">
                <svg className="h-6 w-6 text-realty-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href="#" className="bg-realty-50 dark:bg-realty-800 p-4 rounded-full hover:bg-realty-100 dark:hover:bg-realty-700 transition-colors">
                <svg className="h-6 w-6 text-realty-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path>
                </svg>
              </a>
              <a href="#" className="bg-realty-50 dark:bg-realty-800 p-4 rounded-full hover:bg-realty-100 dark:hover:bg-realty-700 transition-colors">
                <svg className="h-6 w-6 text-realty-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="bg-realty-50 dark:bg-realty-800 p-4 rounded-full hover:bg-realty-100 dark:hover:bg-realty-700 transition-colors">
                <svg className="h-6 w-6 text-realty-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
