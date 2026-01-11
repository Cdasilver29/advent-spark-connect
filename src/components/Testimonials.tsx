import { Card, CardContent } from "@/components/ui/card";
import { Quote, Heart, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Grace M.",
    location: "Nairobi",
    quote: "Singles Spark was a blessing! I came expecting fellowship but left with lifelong friends who share my faith. The activities were so thoughtfully designed to help us connect genuinely.",
    highlight: "Found lifelong friends",
  },
  {
    id: 2,
    name: "David K.",
    location: "Mombasa",
    quote: "As a young Adventist professional, finding like-minded singles was challenging. This event changed everything. The Christ-centered approach made all the difference.",
    highlight: "Christ-centered connections",
  },
  {
    id: 3,
    name: "Sarah N.",
    location: "Kisumu",
    quote: "I met my best friend at Singles Spark last year. The team building activities and worship sessions created such a warm, welcoming atmosphere. Can't wait for this year!",
    highlight: "Met my best friend",
  },
  {
    id: 4,
    name: "James O.",
    location: "Eldoret",
    quote: "The purposeful fellowship approach is what sets this apart. It's not just about meeting people—it's about growing together in faith while forming meaningful relationships.",
    highlight: "Purposeful fellowship",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
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

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="border-none shadow-soft hover:shadow-medium transition-all duration-300 group overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 relative">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
                  <Star className="w-3 h-3 text-secondary" fill="currentColor" />
                  {testimonial.highlight}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/90 mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
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
