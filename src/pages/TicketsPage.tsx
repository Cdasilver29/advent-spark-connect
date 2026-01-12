import Navigation from "@/components/Navigation";
import Tickets from "@/components/Tickets";
import EventFlyers from "@/components/EventFlyers";
import Footer from "@/components/Footer";
import { Heart, Sparkles, Calendar, Clock, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import eventFlyer from "@/assets/event-flyer-february.jpg";

const TicketsPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      
      {/* Hero Banner */}
      <section className="relative py-16 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 opacity-10">
            <Heart className="w-32 h-32" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10">
            <Heart className="w-24 h-24" />
          </div>
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Event Flyer Image */}
              <div className="order-2 md:order-1">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 max-w-sm mx-auto">
                  <img
                    src={eventFlyer}
                    alt="Adventist Singles Spark - February Event"
                    className="w-full h-auto"
                  />
                  <a 
                    href={eventFlyer} 
                    download="adventist-singles-spark-flyer.jpg"
                    className="absolute bottom-4 right-4"
                  >
                    <Button size="sm" variant="secondary" className="shadow-lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              </div>
              
              {/* Event Info */}
              <div className="order-1 md:order-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Heart className="w-5 h-5 text-secondary fill-secondary/30" />
                  <span className="text-secondary font-semibold uppercase tracking-wider text-sm">
                    Equally Yoked Fellowship
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Adventist Singles Spark
                </h1>
                
                <p className="text-lg text-white/90 mb-6">
                  Where faith meets love in meaningful connections
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span>Sunday, February 2, 2026</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span>1:00 PM - 7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-4 inline-block">
                  <p className="italic text-white/90 text-sm">
                    "He who finds a wife finds a good thing"
                  </p>
                  <p className="text-secondary font-semibold text-sm">— Proverbs 18:22</p>
                </div>
                
                <div className="mt-6">
                  <Button 
                    size="lg" 
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
                    onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Your Tickets
                  </Button>
                </div>
              </div>
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
