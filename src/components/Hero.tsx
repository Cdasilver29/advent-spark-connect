import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParallax } from "@/hooks/useParallax";
import heroImage from "@/assets/hero-event.jpg";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { offsetY } = useParallax(0.3);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offsetY * 0.4}px) scale(1.1)`,
        }}
      >
        {/* Light overlay for text readability while keeping image clear */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/40 to-primary-dark/50" />
        {/* Subtle vignette for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 text-center">
        <div 
          className={`flex justify-center mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="relative">
            <Heart className="w-16 h-16 text-secondary animate-pulse" fill="currentColor" />
            <div className="absolute inset-0 w-16 h-16 bg-secondary/30 rounded-full blur-xl animate-ping" />
          </div>
        </div>
        
        <h1 
          className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Adventist Singles Spark
        </h1>
        
        <div 
          className={`flex items-center justify-center gap-2 mb-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="h-px w-12 bg-secondary" />
          <p className="text-xl md:text-2xl text-secondary font-semibold">
            Equally Yoked
          </p>
          <div className="h-px w-12 bg-secondary" />
        </div>
        
        <p 
          className={`text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto italic transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          "Do not be yoked together with unbelievers..." - 2 Corinthians 6:14
        </p>
        
        <p 
          className={`text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Connecting Adventist hearts and creating happy lasting relationships
        </p>
        
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link to="/tickets">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8 py-6 shadow-strong hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Get Your Ticket
            </Button>
          </Link>
          <Link to="/about">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-6 shadow-lg hover:scale-105 transition-all duration-300"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
