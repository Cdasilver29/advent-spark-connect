import { useState, useEffect } from "react";
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
import teamBuildingImage from "@/assets/team-building.jpg";

interface Activity {
  title: string;
  goal: string;
  description: string;
  conversationPrompt?: string;
  instructions?: string[];
  duration: string;
  groupSize: string;
  image: string;
}

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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const activities: Activity[] = [
    {
      title: "The Sabbath Selfie Icebreaker",
      goal: "Meet 3 new people instantly and share a favorite Sabbath memory",
      description: "A warm, faith-centered way to break the ice and celebrate our shared heritage of Sabbath keeping.",
      conversationPrompt: "Share your most memorable Sabbath experience - whether it was a special sunset vespers, a nature walk, a potluck blessing, or a moment when God spoke to your heart during the Sabbath hours.",
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
      duration: "30 minutes",
      groupSize: "Teams of 5-6",
      image: characterChallengeImage,
    },
    {
      title: "My Mission Field Vision Board",
      goal: "Share personal ministry calling and life goals with potential partners",
      description: "Create or present vision boards that reveal your calling, ministry aspirations, and how you see God using you in His work.",
      conversationPrompt: "Share your 'My Mission Field' vision: Where has God placed you to serve? What ministry burns in your heart? How do you envision your future family serving the Lord together?",
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
      duration: "50 minutes (10 rounds)",
      groupSize: "One-on-one pairs",
      image: roundtableImage,
    },
    {
      title: "Prayer Partner Connection",
      goal: "Form meaningful prayer partnerships for continued spiritual support",
      description: "A sacred time to connect with a prayer partner, share prayer requests, and commit to lifting each other up in prayer beyond the event.",
      instructions: [
        "Prayerfully select a prayer partner from new connections",
        "Share 3 specific prayer requests with each other",
        "Exchange contact information for ongoing prayer support",
        "Pray together for each other's requests and future",
        "Sign a prayer partnership commitment card"
      ],
      duration: "25 minutes",
      groupSize: "Pairs",
      image: teamBuildingImage,
    },
  ];

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

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-500 group transform hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform duration-300">
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
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg transform transition-all duration-300 hover:translate-x-1">
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
                        <li key={i} className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                          <span className="text-primary">•</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
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

        <div 
          className={`mt-16 max-w-4xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="bg-gradient-hero text-white overflow-hidden">
            <CardContent className="p-8 text-center relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Our Commitment to Adventist Values</h3>
              <p className="text-white/90 leading-relaxed relative z-10">
                Every activity is designed to honor Christ, uphold Adventist principles, and create 
                an atmosphere where singles can connect authentically. We intentionally avoid secular 
                entertainment, inappropriate music, and activities that don't align with our faith. 
                Our goal is purposeful fellowship that could lead to equally yoked partnerships.
              </p>
              <p className="mt-4 font-semibold text-accent relative z-10">
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
