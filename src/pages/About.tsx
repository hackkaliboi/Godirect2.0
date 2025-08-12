
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";

const About = () => {

  const values = [
    {
      title: "Integrity",
      description: "We uphold the highest ethical standards in all our dealings. Honesty, transparency, and fairness are the foundations of our business."
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, delivering outstanding results that exceed client expectations."
    },
    {
      title: "Client Focus",
      description: "Our clients' needs are our top priority. We listen, understand, and provide personalized solutions for each individual."
    },
    {
      title: "Innovation",
      description: "We embrace new technologies and approaches to continuously improve our services and the real estate experience."
    }
  ];

  const achievements = [
    "Best Real Estate Agency 2023",
    "Top 10 Property Management Services",
    "Excellence in Customer Service Award",
    "Sustainable Building Recognition"
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Godirect Realty</title>
        <meta name="description" content="Learn about Godirect Realty, our mission, values, and the team behind our success." />
      </Helmet>
      
      <section className="bg-realty-50 dark:bg-realty-800/30 py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 text-realty-900 dark:text-white text-center">
              About Godirect Realty
            </h1>
            <p className="text-xl text-realty-600 dark:text-realty-300 mb-12 text-center">
              Your trusted partner in finding the perfect place to call home since 2010.
            </p>
            
            <div className="aspect-video bg-white dark:bg-realty-800 rounded-xl overflow-hidden shadow-lg mb-8">
              <img 
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop" 
                alt="Godirect Realty Office" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-white dark:bg-realty-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6 text-realty-900 dark:text-white">
                Our Story
              </h2>
              <p className="text-realty-600 dark:text-realty-300 mb-4">
                Founded in 2010, Godirect Realty began with a simple mission: to transform the real estate experience by putting clients first and leveraging technology to simplify the home buying and selling process.
              </p>
              <p className="text-realty-600 dark:text-realty-300 mb-4">
                What started as a small team of passionate real estate professionals has grown into a nationwide network of experts dedicated to helping clients find their perfect home. Our journey has been marked by continuous innovation and an unwavering commitment to client satisfaction.
              </p>
              <p className="text-realty-600 dark:text-realty-300">
                Today, Godirect Realty stands as a testament to our founding principles, having facilitated thousands of successful transactions and helped countless families find the place where they truly belong.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop" 
                  alt="Office interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-lg overflow-hidden mt-6">
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop" 
                  alt="Team meeting" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-realty-800 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
              Our Mission & Vision
            </h2>
            <div className="w-16 h-1 bg-realty-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-realty-700/50 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-heading font-semibold mb-4 text-realty-gold">Our Mission</h3>
              <p className="text-realty-100">
                To empower individuals and families in their real estate journey by providing exceptional service, expert guidance, and innovative solutions that make finding, buying, selling, or renting a home a seamless and rewarding experience.
              </p>
            </div>
            
            <div className="bg-realty-700/50 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-heading font-semibold mb-4 text-realty-gold">Our Vision</h3>
              <p className="text-realty-100">
                To be the most trusted name in real estate, recognized for our integrity, expertise, and commitment to transforming the industry through client-centered practices and technological innovation that redefine the standard for real estate excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-white dark:bg-realty-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-3xl mx-auto">
              These principles guide everything we do, from how we interact with clients to the way we develop our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-realty-50 dark:bg-realty-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-heading font-semibold mb-3 text-realty-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-realty-600 dark:text-realty-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-white dark:bg-realty-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6 text-realty-900 dark:text-white">
                Awards & Recognition
              </h2>
              <p className="text-realty-600 dark:text-realty-300 mb-8">
                Our commitment to excellence has earned us recognition within the real estate industry and beyond.
              </p>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-realty-800 dark:bg-realty-gold rounded-full p-1 mr-3">
                      <Check className="h-4 w-4 text-white dark:text-realty-900" />
                    </div>
                    <span className="text-realty-900 dark:text-white">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop" 
                  alt="Award ceremony" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-realty-800 dark:bg-realty-gold text-white dark:text-realty-900 px-6 py-4 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">13+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-realty-50 dark:bg-realty-800/30 text-center">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6 text-realty-900 dark:text-white">
              Ready to Work With Us?
            </h2>
            <p className="text-lg text-realty-600 dark:text-realty-300 mb-8">
              Whether you're buying, selling, or just exploring options, our team is here to help you navigate the real estate market with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-realty-800 text-white hover:bg-realty-700 h-10 px-8"
              >
                Contact Us
              </a>
              <a 
                href="/properties" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-8"
              >
                Browse Properties
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
