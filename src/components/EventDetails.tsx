import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Info } from "lucide-react";

interface EventDetailsData {
  event_date: string;
  event_time: string;
  venue: string;
  dress_code: string;
}

const EventDetails = () => {
  const [eventData, setEventData] = useState<EventDetailsData>({
    event_date: "Coming Soon",
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

  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: eventData.event_date,
      description: "Mark your calendars!",
    },
    {
      icon: Clock,
      label: "Time",
      value: eventData.event_time,
      description: "Afternoon of connection",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: eventData.venue,
      description: "Premium location",
    },
    {
      icon: Info,
      label: "Dress Code",
      value: eventData.dress_code,
      description: "Look your best!",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Event Details
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about joining us for this special evening
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {details.map((detail, index) => (
            <Card 
              key={index}
              className="border-none shadow-soft hover:shadow-medium transition-all text-center"
            >
              <CardContent className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                  <detail.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {detail.label}
                </h3>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {detail.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {detail.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto bg-muted/50 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-6">What to Expect</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                <span><strong className="text-foreground">Check-in & Welcome:</strong> Arrive, receive your name tag, and enjoy welcome refreshments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                <span><strong className="text-foreground">Ice Breaker Activities:</strong> Start the evening with fun games to ease any nervousness</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                <span><strong className="text-foreground">Speed Dating Rounds:</strong> Engage in meaningful conversations with multiple participants</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                <span><strong className="text-foreground">Group Activities:</strong> Participate in team building and social dancing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                <span><strong className="text-foreground">Match Exchange:</strong> Submit your preferences and receive contact info for mutual matches</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EventDetails;
