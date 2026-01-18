import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroImage from "@/assets/hero-event.jpg";

const Hero = () => {
  const scrollToTickets = () => {
    document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary-dark/90" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <Heart className="w-16 h-16 text-secondary animate-scale-in" fill="currentColor" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
          Adventist Singles Spark
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="h-px w-12 bg-secondary" />
          <p className="text-xl md:text-2xl text-secondary font-semibold">
            Equally Yoked
          </p>
          <div className="h-px w-12 bg-secondary" />
        </div>
        
        <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto italic animate-slide-up" style={{ animationDelay: '0.3s' }}>
          "Do not be yoked together with unbelievers..." - 2 Corinthians 6:14
        </p>
        
        <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          Connecting Adventist hearts and creating happy lasting relationships
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            size="lg" 
            onClick={scrollToTickets}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8 py-6 shadow-strong hover:scale-105 transition-transform"
          >
            Get Your Ticket
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-6"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
