import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Image, Calendar } from "lucide-react";

interface EventFlyer {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
  event_date: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const EventFlyers = () => {
  const [flyers, setFlyers] = useState<EventFlyer[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [selectedFlyer, setSelectedFlyer] = useState<EventFlyer | null>(null);

  useEffect(() => {
    fetchFlyers();
    fetchSocialLinks();
  }, []);

  const fetchFlyers = async () => {
    const { data } = await supabase
      .from("event_flyers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) {
      setFlyers(data);
    }
  };

  const fetchSocialLinks = async () => {
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true);

    if (data) {
      setSocialLinks(data);
    }
  };

  if (flyers.length === 0 && socialLinks.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Check out our latest event flyers and photo galleries
          </p>
        </div>

        {/* Flyers Grid */}
        {flyers.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Image className="w-6 h-6 text-primary" />
              Event Flyers
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flyers.map((flyer) => (
                <Card
                  key={flyer.id}
                  className="overflow-hidden border-none shadow-soft hover:shadow-medium transition-all cursor-pointer group"
                  onClick={() => setSelectedFlyer(flyer)}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={flyer.image_url}
                      alt={flyer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-1">{flyer.title}</h4>
                    {flyer.event_date && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {flyer.event_date}
                      </p>
                    )}
                    {flyer.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {flyer.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox for selected flyer */}
        {selectedFlyer && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFlyer(null)}
          >
            <div className="max-w-4xl max-h-[90vh] overflow-auto">
              <img
                src={selectedFlyer.image_url}
                alt={selectedFlyer.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold text-white">{selectedFlyer.title}</h3>
                {selectedFlyer.event_date && (
                  <p className="text-white/80">{selectedFlyer.event_date}</p>
                )}
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFlyer(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Social Links for Event Photos */}
        {socialLinks.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-primary" />
              Event Photo Galleries
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="border-none shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{link.platform}</h4>
                        <p className="text-sm text-muted-foreground">View Photos</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventFlyers;
