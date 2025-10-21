import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Church, Gift } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Faith-Centered",
      description: "Connect with fellow Adventists who share your values and beliefs",
    },
    {
      icon: Users,
      title: "Intentional Connections",
      description: "Meet singles who are serious about finding their life partner",
    },
    {
      icon: Church,
      title: "Adventist Community",
      description: "Build relationships within our faith community",
    },
    {
      icon: Gift,
      title: "Wedding Sponsorship",
      description: "Partial wedding sponsoring for couples who find their match",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Adventist Singles Spark
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A unique matchmaking event designed to help Adventist singles find meaningful connections 
            in a faith-based environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-none shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-hero text-white border-none shadow-medium">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg leading-relaxed mb-6">
                Adventist Singles Spark exists to create a safe, faith-filled space where young Adventist 
                adults can meet, connect, and potentially find their life partner. We believe in the importance 
                of being equally yoked and are committed to fostering relationships that honor God and build 
                strong Adventist families.
              </p>
              <p className="text-lg font-semibold">
                Join us for an unforgettable evening of connection, fun, and possibility!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;
