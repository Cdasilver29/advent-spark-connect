import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Church, Gift, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const About = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Heart,
      title: "Faith-Centered",
      description: "Connect with fellow Adventists who share your values and beliefs",
      expandedContent: {
        title: "What Seventh-day Adventists Believe About Faith",
        content: [
          "**The Bible as Authority**: Seventh-day Adventists accept the Bible as the only source of our beliefs. We consider our movement to be the result of the Protestant conviction \"Sola Scriptura\" — the Bible as the only standard of faith and practice for Christians.",
          "**Salvation Through Grace**: We believe that salvation comes only through grace by faith in Jesus Christ. It cannot be earned through good works, though genuine faith will naturally produce good works as its fruit (Ephesians 2:8-10).",
          "**The Trinity**: Adventists believe in one God — Father, Son, and Holy Spirit — a unity of three co-eternal Persons who work together in perfect harmony for the salvation of humanity.",
          "**Jesus Christ**: We believe Jesus is fully God and fully human, who lived a sinless life, died as a sacrifice for our sins, rose bodily from the grave, and ascended to heaven where He ministers on our behalf.",
        ],
      },
    },
    {
      icon: Users,
      title: "Intentional Connections",
      description: "Meet singles who are serious about finding their life partner",
      expandedContent: {
        title: "SDA Beliefs on Marriage & Relationships",
        content: [
          "**Equally Yoked**: Based on 2 Corinthians 6:14, Adventists believe marriage should be between two believers who share the same faith. This creates spiritual unity and helps both partners grow closer to God together.",
          "**Marriage as Sacred**: Marriage was established by God in Eden and is intended to be a lifelong covenant between a man and a woman. It reflects the relationship between Christ and His church (Ephesians 5:25-33).",
          "**Family Worship**: Adventist families are encouraged to maintain daily family worship, including Bible study and prayer, to strengthen spiritual bonds and pass faith to the next generation.",
          "**Preparation for Marriage**: We believe couples should seek premarital counseling and take time to know each other's spiritual commitments, values, and life goals before marriage.",
        ],
      },
    },
    {
      icon: Church,
      title: "Adventist Community",
      description: "Build relationships within our faith community",
      expandedContent: {
        title: "Core Seventh-day Adventist Beliefs",
        content: [
          "**The Sabbath**: Adventists observe the seventh-day Sabbath (Saturday) as a day of rest and worship, from Friday sunset to Saturday sunset, as established at Creation and commanded in the Ten Commandments (Genesis 2:1-3, Exodus 20:8-11).",
          "**The Second Coming**: We believe in the literal, personal, visible return of Jesus Christ. The second coming is the blessed hope of the church and the grand climax of the gospel. \"Adventist\" comes from our emphasis on Christ's advent or return.",
          "**Health Message**: Adventists follow health principles including a predominantly plant-based diet. Many are vegetarian, and all abstain from unclean meats, alcohol, tobacco, and harmful substances. Our bodies are temples of the Holy Spirit (1 Corinthians 6:19-20).",
          "**The Remnant Church**: We believe God has called out a remnant church to proclaim the three angels' messages of Revelation 14 — calling people to worship the Creator, announcing Babylon's fall, and warning against false worship.",
          "**The Sanctuary**: We believe in Christ's ministry in the heavenly sanctuary, where He intercedes for us. Since 1844, He has been conducting a work of judgment that will culminate in His return.",
        ],
      },
    },
    {
      icon: Gift,
      title: "Wedding Sponsorship",
      description: "Partial wedding sponsoring for couples who find their match",
      expandedContent: {
        title: "SDA Wedding & Stewardship Principles",
        content: [
          "**Christian Weddings**: Adventist weddings are Christ-centered ceremonies that honor God. They typically take place in Adventist churches and are conducted by ordained ministers, focusing on the sacred covenant being made before God.",
          "**Stewardship**: Adventists believe we are stewards of all God has given us — time, talents, and finances. This includes being wise with wedding expenses and starting marriage on solid financial ground.",
          "**Tithe & Offerings**: Returning a faithful tithe (10% of income) and giving offerings is an act of worship and acknowledgment that God owns everything. Couples are encouraged to establish this practice in their new home.",
          "**Simple Living**: Rather than elaborate, expensive weddings, Adventists are encouraged to focus on the spiritual meaning of the ceremony and use resources wisely to begin their new life together.",
          "**Community Support**: The church community plays an important role in supporting new couples through fellowship, mentoring, and encouragement as they build their new family unit.",
        ],
      },
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
              className={cn(
                "border-none shadow-soft hover:shadow-medium transition-all cursor-pointer",
                expandedIndex === index && "ring-2 ring-primary shadow-medium"
              )}
              onClick={() => toggleExpanded(index)}
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-3">{feature.description}</p>
                <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
                  <span>Learn more</span>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expanded Content */}
        {expandedIndex !== null && (
          <Card className="mb-16 border-primary/20 bg-background animate-in slide-in-from-top-4 duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                {features[expandedIndex].expandedContent.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {features[expandedIndex].expandedContent.content.map((item, idx) => {
                  const [title, ...rest] = item.split(": ");
                  const content = rest.join(": ");
                  return (
                    <div key={idx} className="space-y-2">
                      <h4 className="font-semibold text-foreground">
                        {title.replace(/\*\*/g, "")}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

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
