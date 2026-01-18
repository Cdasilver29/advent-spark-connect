import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Heart, MessageCircle, Music, Utensils, Star, Sparkles, Trophy } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

// Static images for activities
import sabbathSelfieImage from "@/assets/sabbath-selfie.jpg";
import boardGamesImage from "@/assets/board-games.jpg";
import characterChallengeImage from "@/assets/character-challenge.jpg";
import visionBoardImage from "@/assets/vision-board.jpg";
import faithGamesImage from "@/assets/faith-games.jpg";
import praiseWorshipImage from "@/assets/praise-worship.jpg";
import roundtableImage from "@/assets/roundtable-discussion.jpg";
import teamBuildingImage from "@/assets/team-building.jpg";

interface Activity {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  duration: string;
  groupSize: string;
  materials: string[];
  instructions: string[];
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Music: <Music className="h-5 w-5" />,
  MessageCircle: <MessageCircle className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
};

const activities: Activity[] = [
  {
    title: "The Sabbath Selfie Icebreaker",
    description: "Break the ice with faith-centered introductions! Gather in small groups, share your name, church, and one blessing from the past week. Capture the moment with a group selfie to remember new friendships formed in Christ.",
    image: sabbathSelfieImage,
    icon: iconMap.Users,
    duration: "15-20 min",
    groupSize: "4-6 people",
    materials: [
      "Name tags with church/district",
      "Smartphones for group selfies",
      "Conversation starter cards",
      "Gentle background instrumental hymns"
    ],
    instructions: [
      "Form groups based on mixed churches/districts",
      "Each person shares: name, church, and one recent blessing",
      "Group takes a 'Sabbath Selfie' together",
      "Exchange contacts for follow-up fellowship"
    ]
  },
  {
    title: "Board Games & Purposeful Conversation",
    description: "Connect through play! Enjoy Pictionary with Bible themes, Jenga with faith questions attached to each block, or classic games while engaging in meaningful conversations about life, faith, and aspirations.",
    image: boardGamesImage,
    icon: iconMap.Heart,
    duration: "45-60 min",
    groupSize: "4-8 people",
    materials: [
      "Pictionary (Bible/SDA themed cards)",
      "Jenga with faith questions",
      "Monopoly or Kenya @50",
      "Conversation question cards",
      "4-6 game stations"
    ],
    instructions: [
      "Rotate between game stations every 15 minutes",
      "Each station has a facilitator to guide conversation",
      "Games include faith-based discussion prompts",
      "Winners receive small prizes and prayer partners"
    ]
  },
  {
    title: "Character & Values Challenge",
    description: "Put your values to the test! Teams face real-life scenarios requiring Adventist principles. Discuss, debate, and discover how biblical wisdom applies to modern relationships and life decisions.",
    image: characterChallengeImage,
    icon: iconMap.Trophy,
    duration: "30-40 min",
    groupSize: "6-8 people",
    materials: [
      "Scenario cards with moral dilemmas",
      "Flip charts and markers",
      "Timer for each challenge",
      "Scoring rubric for facilitators",
      "Reflection worksheets"
    ],
    instructions: [
      "Teams receive scenario cards with real-life dilemmas",
      "5 minutes to discuss and present their approach",
      "Other teams can offer alternative perspectives",
      "Facilitator shares biblical principles that apply"
    ]
  },
  {
    title: "My Mission Field Vision Board",
    description: "Dream together for God's kingdom! Create personal vision boards reflecting your calling, ministry goals, and the impact you want to make. Share your vision with potential partners who share similar passions.",
    image: visionBoardImage,
    icon: iconMap.Star,
    duration: "45-60 min",
    groupSize: "Individual + sharing",
    materials: [
      "Pre-made vision board templates",
      "Magazines with appropriate images",
      "Colored markers and stickers",
      "Scripture cards for inspiration",
      "Presentation area with easels"
    ],
    instructions: [
      "Reflect on personal calling and ministry vision",
      "Create vision board with goals and scripture",
      "Pair with someone who has complementary vision",
      "Pray together over each other's vision boards"
    ]
  },
  {
    title: "Faith & Fellowship Games",
    description: "Test your knowledge and build team spirit! Engage in Bible trivia, SDA heritage questions, and hymn challenges. Learn while laughing together in friendly competition that strengthens bonds.",
    image: faithGamesImage,
    icon: iconMap.BookOpen,
    duration: "30-45 min",
    groupSize: "Teams of 4-6",
    materials: [
      "Bible trivia question cards",
      "SDA Heritage Bingo cards",
      "SDA Hymnal for reference",
      "Buzzers or bells for teams",
      "Small prizes (devotionals, bookmarks)"
    ],
    instructions: [
      "Teams compete in rounds of Bible trivia",
      "Hymn recognition round (play intro, guess hymn)",
      "SDA Heritage questions about church history",
      "Final round: Speed Bible verse lookup"
    ]
  },
  {
    title: "Praise & Testimony Hour",
    description: "Lift your voices together! Join in congregational singing of beloved hymns and contemporary praise songs. Share personal testimonies of God's faithfulness and be encouraged by others' faith journeys.",
    image: praiseWorshipImage,
    icon: iconMap.Music,
    duration: "45-60 min",
    groupSize: "All participants",
    materials: [
      "Quality sound system with microphones",
      "SDA Hymnal (physical and projected)",
      "Piano/keyboard accompaniment",
      "Testimony sign-up sheet",
      "Song lyric projector"
    ],
    instructions: [
      "Open with familiar hymns for group singing",
      "Invite prepared testimonies (3-5 minutes each)",
      "Intersperse songs between testimonies",
      "Close with prayer song and group prayer"
    ]
  },
  {
    title: "Purposeful Speed Networking",
    description: "Go beyond surface conversations! Structured rounds of intentional dialogue help you discover shared values, ministry interests, and life goals. Each rotation brings new connections with depth.",
    image: roundtableImage,
    icon: iconMap.MessageCircle,
    duration: "30-40 min",
    groupSize: "Pairs rotating",
    materials: [
      "Numbered tables for rotation",
      "Guided question cards (4 levels)",
      "Personal note cards",
      "Timer with gentle bell",
      "Name tags with interests listed"
    ],
    instructions: [
      "5-minute rounds with guided questions",
      "Questions progress from light to meaningful",
      "Participants note potential prayer/ministry partners",
      "Final round: Exchange contact with favorite connection"
    ]
  },
  {
    title: "Prayer Partner Connection",
    description: "Find your spiritual support system! Be matched with prayer partners based on shared interests and prayer needs. Commit to ongoing intercession and spiritual encouragement beyond the event.",
    image: teamBuildingImage,
    icon: iconMap.Sparkles,
    duration: "20-30 min",
    groupSize: "Pairs",
    materials: [
      "Prayer request cards",
      "Partnership commitment cards",
      "Scripture promise cards",
      "Quiet prayer corners setup",
      "Gentle instrumental music"
    ],
    instructions: [
      "Fill out prayer partner preference card",
      "Facilitators match based on interests/needs",
      "Meet partner and share prayer requests",
      "Pray together and commit to ongoing partnership"
    ]
  }
];

// Export for Manager component
export const activityMaterials: Record<string, string[]> = activities.reduce((acc, activity) => {
  acc[activity.title] = activity.materials;
  return acc;
}, {} as Record<string, string[]>);

const Activities = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="activities" className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-2 text-sm bg-primary/10 border-primary/30 text-primary"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Planned Activities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            8 Engaging Activities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carefully designed activities to help you connect meaningfully while growing in faith together
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <Card 
              key={activity.title} 
              className={`overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 group transform hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Activity Image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <OptimizedImage
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Activity Icon Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <span className="text-primary">{activity.icon}</span>
                </div>
                
                {/* Duration & Group Size */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white text-xs">
                  <span className="flex items-center bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.duration}
                  </span>
                  <span className="flex items-center bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                    <Users className="h-3 w-3 mr-1" />
                    {activity.groupSize}
                  </span>
                </div>
              </div>
              
              {/* Activity Content */}
              <CardContent className="p-5">
                <h3 className="text-lg font-display font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-muted-foreground">
            All activities are designed with Adventist values at the center
          </p>
        </div>
      </div>
    </section>
  );
};

export default Activities;
