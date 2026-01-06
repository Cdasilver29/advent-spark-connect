import Navigation from "@/components/Navigation";
import Tickets from "@/components/Tickets";
import EventFlyers from "@/components/EventFlyers";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Clock, MapPin } from "lucide-react";
import eventFlyer from "@/assets/event-flyer-february.jpg";

const TicketsPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      
      {/* Featured Event Flyer */}
      <section className="py-12 bg-gradient-subtle">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-none shadow-strong">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-[3/4] md:aspect-auto overflow-hidden">
                  <img
                    src={eventFlyer}
                    alt="Adventist Singles Spark - February Event"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center bg-gradient-hero text-white">
                  <h2 className="text-3xl font-bold mb-4">February Launch Event</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <span>Sunday, February 2nd, 2025</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span>1:00 PM - 7:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <span>Venue to be announced</span>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Join us for an unforgettable evening of faith-centered matchmaking, 
                    fun activities, and meaningful connections with fellow Adventist singles.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      size="lg" 
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Get Tickets Now
                    </Button>
                    <a 
                      href={eventFlyer} 
                      download="adventist-singles-spark-flyer.jpg"
                      className="inline-flex"
                    >
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Download Flyer
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </div>
            </Card>
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
