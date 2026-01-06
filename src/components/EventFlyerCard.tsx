import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Heart, Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EventDetailsData {
  event_date: string;
  event_time: string;
  venue: string;
  dress_code: string;
}

const EventFlyerCard = () => {
  const [eventData, setEventData] = useState<EventDetailsData>({
    event_date: "Sunday, February 2, 2025",
    event_time: "1:00 PM - 7:00 PM",
    venue: "To Be Announced",
    dress_code: "Smart Casual",
  });

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    const { data } = await supabase
      .from("event_details")
      .select("event_date, event_time, venue, dress_code")
      .limit(1)
      .single();

    if (data) {
      setEventData(data);
    }
  };

  const handleDownload = () => {
    // Create a canvas to generate a downloadable image
    const flyerContent = document.getElementById('event-flyer-content');
    if (flyerContent) {
      // For now, just open print dialog
      window.print();
    }
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Upcoming Event
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us for a faith-filled afternoon of meaningful connections
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card 
            id="event-flyer-content"
            className="overflow-hidden border-2 border-primary/20 shadow-strong bg-gradient-to-br from-cream via-background to-secondary/5"
          >
            {/* Header with SDA branding */}
            <div className="bg-gradient-hero text-white py-6 px-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img 
                  src="https://www.adventist.org/wp-content/uploads/2019/06/adventist-symbol-tm-circle-whitebg.png"
                  alt="SDA Logo"
                  className="w-10 h-10 rounded-full bg-white p-1"
                />
                <span className="text-sm font-medium uppercase tracking-wider">Seventh-day Adventist</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Singles Spark</h3>
              <p className="text-white/90 text-lg font-semibold mt-1">Equally Yoked Fellowship</p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Hearts decoration */}
              <div className="flex justify-center gap-2 py-2">
                <Heart className="w-6 h-6 text-secondary fill-secondary/30" />
                <Heart className="w-8 h-8 text-primary fill-primary/30" />
                <Heart className="w-6 h-6 text-secondary fill-secondary/30" />
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-bold text-foreground">{eventData.event_date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-bold text-foreground">{eventData.event_time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-bold text-foreground">{eventData.venue}</p>
                  </div>
                </div>
              </div>

              {/* Bible Verse */}
              <div className="text-center py-4 border-t border-b border-primary/20">
                <p className="italic text-muted-foreground text-sm">
                  "He who finds a wife finds a good thing and obtains favor from the Lord"
                </p>
                <p className="text-primary font-semibold text-sm mt-1">— Proverbs 18:22</p>
              </div>

              {/* What's Included */}
              <div className="space-y-2">
                <h4 className="font-semibold text-center text-foreground">What to Expect</h4>
                <ul className="text-sm text-muted-foreground space-y-1 text-center">
                  <li>✓ Speed Networking & Icebreakers</li>
                  <li>✓ Faith-Based Team Activities</li>
                  <li>✓ Vision Board Sharing</li>
                  <li>✓ Praise & Worship</li>
                  <li>✓ Match Coordination</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-hero hover:opacity-90 text-white font-bold py-6"
                  onClick={() => window.location.href = '/register'}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Register Now
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  sdaspark.lovable.app
                </p>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="bg-muted/50 py-3 px-6 text-center">
              <p className="text-xs text-muted-foreground">
                Dress Code: {eventData.dress_code} • Ages 21+
              </p>
            </div>
          </Card>

          {/* Download/Share buttons */}
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Print Flyer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventFlyerCard;
