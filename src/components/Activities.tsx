import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Heart, MessageCircle, Music, Utensils, Star, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/OptimizedImage";

// Fallback static images for activities without uploaded images
import sabbathSelfieImage from "@/assets/sabbath-selfie.jpg";
import boardGamesImage from "@/assets/board-games.jpg";
import characterChallengeImage from "@/assets/character-challenge.jpg";
import visionBoardImage from "@/assets/vision-board.jpg";
import faithGamesImage from "@/assets/faith-games.jpg";
import praiseWorshipImage from "@/assets/praise-worship.jpg";
import roundtableImage from "@/assets/roundtable-discussion.jpg";
import teamBuildingImage from "@/assets/team-building.jpg";

interface Activity {
  id: string;
  title: string;
  description: string;
  image_url: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Heart,
  MessageCircle,
  Music,
  Utensils,
  BookOpen,
  Star,
  Sparkles,
  Clock,
  Trophy,
};

// Fallback images by title keyword
const fallbackImages: Record<string, string> = {
  "sabbath": sabbathSelfieImage,
  "board": boardGamesImage,
  "character": characterChallengeImage,
  "vision": visionBoardImage,
  "faith": faithGamesImage,
  "praise": praiseWorshipImage,
  "worship": praiseWorshipImage,
  "network": roundtableImage,
  "speed": roundtableImage,
  "prayer": teamBuildingImage,
  "team": teamBuildingImage,
};

const getFallbackImage = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  for (const [keyword, image] of Object.entries(fallbackImages)) {
    if (lowerTitle.includes(keyword)) {
      return image;
    }
  }
  return sabbathSelfieImage;
};

// Materials data exported for Manager dashboard
export const activityMaterials: Record<string, string[]> = {
  "The Sabbath Selfie Icebreaker": [
    "Name tags with church/district",
    "Smartphones for group selfies",
    "Conversation starter cards",
    "Gentle background instrumental hymns"
  ],
  "Board Games & Purposeful Conversation": [
    "Pictionary (Bible/SDA themed cards)",
    "Jenga with faith questions",
    "Monopoly or Kenya @50",
    "Conversation question cards",
    "4-6 game stations"
  ],
  "Character & Values Challenge": [
    "Scenario cards with moral dilemmas",
    "Flip charts and markers",
    "Timer for each challenge",
    "Scoring rubric for facilitators",
    "Reflection worksheets"
  ],
  "My Mission Field Vision Board": [
    "Pre-made vision board templates",
    "Magazines with appropriate images",
    "Colored markers and stickers",
    "Scripture cards for inspiration",
    "Presentation area with easels"
  ],
  "Faith & Fellowship Games": [
    "Bible trivia question cards",
    "SDA Heritage Bingo cards",
    "SDA Hymnal for reference",
    "Buzzers or bells for teams",
    "Small prizes (devotionals, bookmarks)"
  ],
  "Praise & Testimony Hour": [
    "Quality sound system with microphones",
    "SDA Hymnal (physical and projected)",
    "Piano/keyboard accompaniment",
    "Testimony sign-up sheet",
    "Song lyric projector"
  ],
  "Purposeful Speed Networking": [
    "Numbered tables for rotation",
    "Guided question cards (4 levels)",
    "Personal note cards",
    "Timer with gentle bell",
    "Name tags with interests listed"
  ],
  "Prayer Partner Connection": [
    "Prayer request cards",
    "Partnership commitment cards",
    "Scripture promise cards",
    "Quiet prayer corners setup",
    "Gentle instrumental music"
  ],
};


const Activities = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching activities:", error);
    } else if (data) {
      setActivities(data as Activity[]);
    }
    setIsLoading(false);
  };

  const getImageSrc = (activity: Activity): string => {
    if (activity.image_url && activity.image_url !== "/placeholder.svg") {
      return activity.image_url;
    }
    return getFallbackImage(activity.title);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Users;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <section id="activities" className="py-20 bg-background overflow-hidden">
      <div className="container px-4">
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary animate-pulse">
            Christ-Centered Activities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Event Activities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Purposeful fellowship, networking, and meaningful connections through 
            faith-affirming activities aligned with Adventist values
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {activities.map((activity, index) => (
              <Card 
                key={activity.id} 
                className={`overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 group transform hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <OptimizedImage
                    src={getImageSrc(activity)}
                    alt={activity.title}
                    fallbackSrc={getFallbackImage(activity.title)}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/80">
                        {getIcon(activity.icon)}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300 line-clamp-2">
                      {activity.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4 md:p-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Activities coming soon...</p>
          </div>
        )}

        <div 
          className={`mt-16 max-w-4xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="bg-gradient-hero text-white overflow-hidden">
            <CardContent className="p-6 md:p-8 text-center relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
              <h3 className="text-xl md:text-2xl font-bold mb-4 relative z-10">Our Commitment to Adventist Values</h3>
              <p className="text-white/90 leading-relaxed relative z-10 text-sm md:text-base">
                Every activity is designed to honor Christ, uphold Adventist principles, and create 
                an atmosphere where singles can connect authentically. We intentionally avoid secular 
                entertainment, inappropriate music, and activities that don't align with our faith. 
                Our goal is purposeful fellowship that could lead to equally yoked partnerships.
              </p>
              <p className="mt-4 font-semibold text-accent relative z-10 text-sm md:text-base">
                "Be ye not unequally yoked together with unbelievers" — 2 Corinthians 6:14
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Activities;
