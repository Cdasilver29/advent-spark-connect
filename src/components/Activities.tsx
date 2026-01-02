import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import sabbathSelfieImage from "@/assets/sabbath-selfie.jpg";
import boardGamesImage from "@/assets/board-games.jpg";
import characterChallengeImage from "@/assets/character-challenge.jpg";
import visionBoardImage from "@/assets/vision-board.jpg";
import faithGamesImage from "@/assets/faith-games.jpg";
import praiseWorshipImage from "@/assets/praise-worship.jpg";
import roundtableImage from "@/assets/roundtable-discussion.jpg";
import fellowshipDinnerImage from "@/assets/fellowship-dinner.jpg";

interface Activity {
  title: string;
  goal: string;
  description: string;
  conversationPrompt?: string;
  instructions?: string[];
  materials: string[];
  duration: string;
  groupSize: string;
  image: string;
}

const Activities = () => {
  const activities: Activity[] = [
    {
      title: "The Sabbath Selfie Icebreaker",
      goal: "Meet 3 new people instantly and share a favorite Sabbath memory",
      description: "A warm, faith-centered way to break the ice and celebrate our shared heritage of Sabbath keeping.",
      conversationPrompt: "Share your most memorable Sabbath experience - whether it was a special sunset vespers, a nature walk, a potluck blessing, or a moment when God spoke to your heart during the Sabbath hours.",
      materials: [
        "Name tags with church/district",
        "Smartphones for group selfies",
        "Conversation starter cards",
        "Gentle background instrumental hymns"
      ],
      duration: "20 minutes",
      groupSize: "Groups of 3-4",
      image: sabbathSelfieImage,
    },
    {
      title: "Board Games & Purposeful Conversation",
      goal: "Structured discussion on character and alignment through engaging games",
      description: "Enjoy wholesome board games while engaging in meaningful conversations that reveal character, values, and communication styles.",
      instructions: [
        "Rotate tables every 15 minutes for variety",
        "Each game includes character-revealing discussion questions",
        "Pictionary uses Bible stories and SDA heritage themes",
        "Jenga blocks have conversation starters written on them",
        "Focus on listening, respect, and gracious competition"
      ],
      materials: [
        "Pictionary (Bible/SDA themed cards)",
        "Jenga with faith questions",
        "Monopoly or Kenya @50",
        "Conversation question cards",
        "4-6 game stations"
      ],
      duration: "45 minutes",
      groupSize: "4-6 per table",
      image: boardGamesImage,
    },
    {
      title: "Character & Values Challenge",
      goal: "Team problem-solving to reveal teamwork skills and godly character",
      description: "Engage in collaborative challenges that showcase leadership, patience, communication, and Christ-like character under pressure.",
      instructions: [
        "Teams receive a scenario requiring biblical wisdom",
        "Example: 'Your church has limited funds - prioritize these 5 ministries and explain why'",
        "Observe how members lead, listen, and resolve differences",
        "Debrief focuses on what each person learned about themselves",
        "Judges look for humility, collaboration, and biblical reasoning"
      ],
      materials: [
        "Scenario cards with moral dilemmas",
        "Flip charts and markers",
        "Timer for each challenge",
        "Scoring rubric for facilitators",
        "Reflection worksheets"
      ],
      duration: "30 minutes",
      groupSize: "Teams of 5-6",
      image: characterChallengeImage,
    },
    {
      title: "My Mission Field Vision Board",
      goal: "Share personal ministry calling and life goals with potential partners",
      description: "Create or present vision boards that reveal your calling, ministry aspirations, and how you see God using you in His work.",
      conversationPrompt: "Share your 'My Mission Field' vision: Where has God placed you to serve? What ministry burns in your heart? How do you envision your future family serving the Lord together?",
      materials: [
        "Pre-made vision board templates",
        "Magazines with appropriate images",
        "Colored markers and stickers",
        "Scripture cards for inspiration",
        "Presentation area with easels"
      ],
      duration: "35 minutes",
      groupSize: "Individual + sharing circles of 6",
      image: visionBoardImage,
    },
    {
      title: "Faith & Fellowship Games",
      goal: "Lighthearted, low-pressure fun reinforcing shared Adventist heritage",
      description: "Enjoy Bible trivia, SDA history challenges, and heritage games that celebrate our faith while building connections through laughter.",
      instructions: [
        "Bible Trivia Relay: Teams race to answer questions",
        "SDA Heritage Bingo: Mark off pioneers, events, institutions",
        "Hymn Humming Challenge: Guess the hymn from humming",
        "'Name That Prophet' charades",
        "Winners receive small, meaningful prizes (devotional books, bookmarks)"
      ],
      materials: [
        "Bible trivia question cards",
        "SDA Heritage Bingo cards",
        "SDA Hymnal for reference",
        "Buzzers or bells for teams",
        "Small prizes (devotionals, bookmarks)"
      ],
      duration: "40 minutes",
      groupSize: "Teams of 4-5",
      image: faithGamesImage,
    },
    {
      title: "Praise & Testimony Hour",
      goal: "Spiritual uplift through sacred music and personal testimonies",
      description: "End the event with a powerful time of praise, worship, and testimony sharing that draws hearts closer to God and each other.",
      instructions: [
        "Solo song performances (pre-registered)",
        "Group hymn singing (classics from the hymnal)",
        "New connections duet: Newly met pairs sing together",
        "3-minute testimony slots for volunteers",
        "Close with prayer and commitment song"
      ],
      materials: [
        "Quality sound system with microphones",
        "SDA Hymnal (physical and projected)",
        "Piano/keyboard accompaniment",
        "Testimony sign-up sheet",
        "Song lyric projector"
      ],
      duration: "45 minutes",
      groupSize: "Full group",
      image: praiseWorshipImage,
    },
    {
      title: "Purposeful Speed Networking",
      goal: "Deep, intentional one-on-one conversations to discover compatibility",
      description: "Structured 5-minute conversations with guided questions that go beyond surface-level to explore faith, values, and life vision.",
      instructions: [
        "Begin each round with a moment of silent prayer",
        "Use guided question cards (not casual small talk)",
        "Questions progress: Faith journey → Ministry involvement → Life goals → Family vision",
        "Note cards for recording impressions and prayer requests",
        "Bell signals rotation every 5 minutes"
      ],
      materials: [
        "Numbered tables for rotation",
        "Guided question cards (4 levels)",
        "Personal note cards",
        "Timer with gentle bell",
        "Name tags with interests listed"
      ],
      duration: "50 minutes (10 rounds)",
      groupSize: "One-on-one pairs",
      image: roundtableImage,
    },
    {
      title: "Fellowship Dinner & Networking",
      goal: "Build community through shared vegetarian meal and continued connection",
      description: "Enjoy a blessed vegetarian potluck-style dinner while continuing meaningful conversations in a relaxed, family atmosphere.",
      instructions: [
        "Begin with corporate prayer of thanksgiving",
        "Assigned 'connection tables' mix participants",
        "Table hosts facilitate continued conversation",
        "Share favorite family recipes and health tips",
        "Exchange contact information with dinner companions"
      ],
      materials: [
        "Vegetarian catering or potluck coordination",
        "Table assignments/seating chart",
        "Conversation cards for dinner tables",
        "Contact exchange cards",
        "Background instrumental sacred music"
      ],
      duration: "60 minutes",
      groupSize: "Tables of 8",
      image: fellowshipDinnerImage,
    },
  ];

  return (
    <section id="activities" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-none shadow-soft hover:shadow-strong transition-all group"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-white/90 text-sm">{activity.goal}</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
                
                {activity.conversationPrompt && (
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">Conversation Prompt:</p>
                        <p className="text-sm text-muted-foreground italic">"{activity.conversationPrompt}"</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activity.instructions && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground text-sm mb-2">Activity Instructions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {activity.instructions.map((instruction, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-semibold text-foreground text-sm mb-2">Materials Needed:</p>
                  <ul className="text-sm text-muted-foreground grid grid-cols-1 gap-1">
                    {activity.materials.map((material, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-secondary">✓</span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{activity.groupSize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-hero text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Our Commitment to Adventist Values</h3>
              <p className="text-white/90 leading-relaxed">
                Every activity is designed to honor Christ, uphold Adventist principles, and create 
                an atmosphere where singles can connect authentically. We intentionally avoid secular 
                entertainment, inappropriate music, and activities that don't align with our faith. 
                Our goal is purposeful fellowship that could lead to equally yoked partnerships.
              </p>
              <p className="mt-4 font-semibold text-accent">
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
