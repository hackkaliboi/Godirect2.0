
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTestimonials, Testimonial } from "@/utils/supabaseData";
import { cn } from "@/lib/utils";

// All testimonials are now fetched from Supabase

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getTestimonials = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTestimonials();
        // Use only fetched testimonials from Supabase
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getTestimonials();
  }, []);

  const handlePrev = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-realty-gold/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-realty-gold/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/4 h-64 w-64 bg-realty-gold/5 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10 py-16">
        {isLoading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                <div className="flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-gray-400/20 mr-4"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-400/20 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-400/20 rounded"></div>
                    </div>
                  </div>
                  <div className="flex mb-4 space-x-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="h-3 w-3 bg-gray-400/20 rounded-full"></div>
                    ))}
                  </div>
                  <div className="mb-4 w-full">
                    <div className="h-3 bg-gray-400/20 rounded mb-2"></div>
                    <div className="h-3 bg-gray-400/20 rounded mb-2"></div>
                    <div className="h-3 bg-gray-400/20 rounded mb-2"></div>
                    <div className="h-3 bg-gray-400/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div>
            {/* Desktop view: Multi-card carousel */}
            <div className="hidden md:block">
              <div 
                ref={testimonialsRef}
                className="grid grid-cols-3 gap-8 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 33.33}%)`,
                  gridTemplateColumns: `repeat(${testimonials.length}, minmax(0, 1fr))`,
                  width: `${testimonials.length * 33.33}%`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className={cn(
                      "bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-500",
                      "hover:bg-white/10 border border-white/5 hover:border-white/10",
                      index === currentIndex ? "scale-105 border-realty-gold/30" : "scale-100"
                    )}
                  >
                    <div className="relative">
                      {/* Quote icon */}
                      <div className="absolute -top-2 -left-2 text-realty-gold/20">
                        <Quote size={30} />
                      </div>
                      
                      <div className="pt-4">
                        <blockquote className="mb-6 text-white/90 leading-relaxed">
                          "{testimonial.testimonial}"
                        </blockquote>
                        
                        <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                        
                        <div className="flex items-center">
                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="h-14 w-14 rounded-full object-cover border-2 border-realty-gold/30 mr-4"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-realty-700 flex items-center justify-center mr-4">
                              <User className="h-6 w-6 text-realty-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-heading font-semibold text-white">
                              {testimonial.name}
                            </p>
                            <p className="text-realty-300 text-sm">{testimonial.location || ""}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop navigation */}
              <div className="flex justify-center mt-10 space-x-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="rounded-full border-realty-600 text-realty-300 hover:bg-realty-700 hover:text-white"
                  aria-label="Previous testimonials"
                  disabled={testimonials.length <= 3}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleDotClick(i * 3)}
                      className={`h-2 rounded-full transition-all ${
                        currentIndex >= i * 3 && currentIndex < (i + 1) * 3
                          ? "w-8 bg-realty-gold" 
                          : "w-2 bg-realty-700"
                      }`}
                      aria-label={`Go to testimonial group ${i + 1}`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-full border-realty-600 text-realty-300 hover:bg-realty-700 hover:text-white"
                  aria-label="Next testimonials"
                  disabled={testimonials.length <= 3}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Mobile view: Single card carousel */}
            <div className="block md:hidden">
              <div className="relative px-4">
                <div 
                  className="transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    width: `${testimonials.length * 100}%`,
                    display: "flex"
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <div 
                      key={testimonial.id} 
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/5">
                        <div className="relative">
                          {/* Quote icon */}
                          <div className="absolute -top-2 -left-2 text-realty-gold/20">
                            <Quote size={30} />
                          </div>
                          
                          <div className="pt-4">
                            <blockquote className="mb-6 text-white/90 leading-relaxed">
                              "{testimonial.testimonial}"
                            </blockquote>
                            
                            <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                            
                            <div className="flex items-center">
                              {testimonial.image ? (
                                <img
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  className="h-14 w-14 rounded-full object-cover border-2 border-realty-gold/30 mr-4"
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-full bg-realty-700 flex items-center justify-center mr-4">
                                  <User className="h-6 w-6 text-realty-300" />
                                </div>
                              )}
                              <div>
                                <p className="font-heading font-semibold text-white">
                                  {testimonial.name}
                                </p>
                                <p className="text-realty-300 text-sm">{testimonial.location || ""}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mobile navigation */}
              <div className="flex justify-center mt-8 space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="rounded-full border-realty-600 text-realty-300 hover:bg-realty-700 hover:text-white"
                  aria-label="Previous testimonial"
                  disabled={testimonials.length <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleDotClick(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentIndex 
                          ? "w-6 bg-realty-gold" 
                          : "w-2 bg-realty-700"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-full border-realty-600 text-realty-300 hover:bg-realty-700 hover:text-white"
                  aria-label="Next testimonial"
                  disabled={testimonials.length <= 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center max-w-md mx-auto">
            <p className="text-xl text-white/80">No testimonials available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
