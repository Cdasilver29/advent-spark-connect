import { useState, useEffect } from "react";
import { Heart, ArrowUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Don't show on registration page
  if (location.pathname === "/register") {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        variant="outline"
        className={`w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 ${
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>

      {/* Main Register FAB */}
      <Link to="/register">
        <Button
          size="lg"
          className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-dark shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 overflow-hidden"
          aria-label="Register for event"
        >
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ping" />
          
          {/* Icon */}
          <Heart 
            className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" 
            fill="currentColor" 
          />
          
          {/* Hover text */}
          <span 
            className={`absolute right-full mr-3 whitespace-nowrap bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            Register Now
          </span>
        </Button>
      </Link>
    </div>
  );
};

export default FloatingActionButton;
