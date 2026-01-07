import Navigation from "@/components/Navigation";
import Tickets from "@/components/Tickets";
import EventFlyers from "@/components/EventFlyers";
import Footer from "@/components/Footer";
import { Heart, Sparkles, Calendar, Clock, MapPin } from "lucide-react";

const TicketsPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-gradient-hero text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 opacity-10">
            <Heart className="w-32 h-32" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10">
            <Heart className="w-24 h-24" />
          </div>
          <div className="absolute top-1/2 left-1/4 opacity-5">
            <Sparkles className="w-40 h-40" />
          </div>
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-secondary fill-secondary/30" />
              <span className="text-secondary font-semibold uppercase tracking-wider text-sm">
                Equally Yoked Fellowship
              </span>
              <Heart className="w-6 h-6 text-secondary fill-secondary/30" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Adventist Singles Spark
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Where faith meets love in meaningful connections
            </p>
            
            {/* Event Details */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span>Sunday, February 2, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                <span>1:00 PM - 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            
            {/* Bible Verse */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg py-4 px-6 max-w-xl mx-auto">
              <p className="italic text-white/90">
                "He who finds a wife finds a good thing and obtains favor from the Lord"
              </p>
              <p className="text-secondary font-semibold mt-1">— Proverbs 18:22</p>
            </div>
          </div>
        </div>
      </section>

      <Tickets />
      <EventFlyers />
      <Footer />
    </div>
  );
};

export default TicketsPage;
