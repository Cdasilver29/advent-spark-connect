import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  highlight: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (data && !error) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused, nextSlide]);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Stories of Connection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from Adventist singles who found meaningful connections and spiritual growth
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 shadow-medium"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 shadow-medium"
                onClick={nextSlide}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-none shadow-medium hover:shadow-strong transition-all duration-500 group overflow-hidden bg-gradient-to-br from-card via-card to-primary/5">
                    <CardContent className="p-8 md:p-12 relative">
                      {/* Decorative Quote Icons */}
                      <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <Quote className="w-20 h-20 text-primary rotate-180" />
                      </div>
                      <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <Quote className="w-20 h-20 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 text-center">
                        {/* Highlight Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-6 animate-scale-in">
                          <Star className="w-4 h-4 text-secondary" fill="currentColor" />
                          {testimonial.highlight}
                          <Star className="w-4 h-4 text-secondary" fill="currentColor" />
                        </div>

                        {/* Quote */}
                        <blockquote className="text-xl md:text-2xl text-foreground/90 mb-8 leading-relaxed font-medium italic">
                          "{testimonial.quote}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl shadow-medium">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg text-foreground">{testimonial.name}</p>
                            <p className="text-muted-foreground">{testimonial.location}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-lg text-muted-foreground italic">
            "Be completely humble and gentle; be patient, bearing with one another in love."
          </p>
          <p className="text-sm text-primary font-medium mt-2">— Ephesians 4:2</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;