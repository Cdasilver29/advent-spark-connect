import { Card, CardContent } from "@/components/ui/card";
import speedDatingImage from "@/assets/speed-dating.jpg";
import teamBuildingImage from "@/assets/team-building.jpg";
import gamingImage from "@/assets/gaming.jpg";
import dancingImage from "@/assets/dancing.jpg";

const Activities = () => {
  const activities = [
    {
      title: "Speed Dating",
      description: "Engage in meaningful conversations with fellow singles in a structured, comfortable setting. Each session is designed to help you get to know multiple people in an evening.",
      image: speedDatingImage,
    },
    {
      title: "Team Building",
      description: "Work together on fun collaborative activities that reveal personality and character. See how you and others problem-solve, communicate, and work as a team.",
      image: teamBuildingImage,
    },
    {
      title: "Interactive Gaming",
      description: "Break the ice with fun, faith-appropriate games designed to bring out laughter and genuine connections. Games are carefully selected to encourage interaction and conversation.",
      image: gamingImage,
    },
    {
      title: "Social Dancing",
      description: "Enjoy elegant, Adventist-appropriate dancing in a sophisticated setting. Professional instructors will guide beginners through easy steps to help everyone feel comfortable.",
      image: dancingImage,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Event Activities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience a variety of engaging activities designed to help you connect authentically 
            with other singles in the Adventist way
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {activities.map((activity, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-none shadow-soft hover:shadow-strong transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <h3 className="absolute bottom-4 left-6 text-3xl font-bold text-white">
                  {activity.title}
                </h3>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
