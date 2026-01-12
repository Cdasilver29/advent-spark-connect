import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, MapPin, Calendar, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EventDetailsData {
  event_date: string;
  event_time: string;
  venue: string;
  dress_code: string;
}

const EventProgram = () => {
  const [isGenerating, setIsGenerating] = useState(false);
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
      .maybeSingle();

    if (data) {
      setEventData(data);
    }
  };

  const programContent = `
ADVENTIST SINGLES SPARK
═══════════════════════════════════════════
"Equally Yoked" - 2 Corinthians 6:14
Purposeful Fellowship • Networking • Meaningful Connections

═══════════════════════════════════════════
EVENT DETAILS
═══════════════════════════════════════════
📅 Date: ${eventData.event_date}
🕐 Time: ${eventData.event_time}
📍 Venue: ${eventData.venue}
👔 Dress Code: ${eventData.dress_code}

═══════════════════════════════════════════
EVENT PROGRAM
═══════════════════════════════════════════

1:00 PM - 1:30 PM | PRAYER & WELCOME
─────────────────────────────────────────
• Opening devotion and prayer
• Name tag collection
• Welcome refreshments
• Fellowship in a spirit of unity

1:30 PM - 1:50 PM | SABBATH SELFIE ICEBREAKER
─────────────────────────────────────────
• Meet 3 new people
• Share your favorite Sabbath memory
• Group selfies with new friends
• Conversation starter cards

2:00 PM - 2:50 PM | PURPOSEFUL SPEED NETWORKING
─────────────────────────────────────────
• 10 rounds of 5-minute conversations
• Guided faith-focused questions
• Question progression:
  - Faith journey
  - Ministry involvement
  - Life goals
  - Family vision
• Note cards for recording impressions

3:00 PM - 3:45 PM | BOARD GAMES & CONVERSATION
─────────────────────────────────────────
• Rotate tables every 15 minutes
• Games include:
  - Pictionary (Bible/SDA themed)
  - Jenga with faith questions
  - Kenya @50 or Monopoly
• Character-revealing discussions

3:45 PM - 4:00 PM | TEA BREAK
─────────────────────────────────────────
• Light refreshments
• Free networking time

4:00 PM - 4:30 PM | CHARACTER & VALUES CHALLENGE
─────────────────────────────────────────
• Team scenarios requiring biblical wisdom
• Observe leadership and collaboration
• Focus on humility and godly character
• Group reflection and debrief

4:30 PM - 5:00 PM | VISION BOARD SHARING
─────────────────────────────────────────
• Present your "Mission Field" vision
• Share ministry calling and life goals
• Small group discussions (6 per circle)
• How you envision family serving the Lord

5:00 PM - 5:45 PM | PRAISE & TESTIMONY HOUR
─────────────────────────────────────────
• Solo song performances
• Group hymn singing (SDA Hymnal)
• New connections duet opportunity
• 3-minute testimony slots
• Closing prayer and commitment song

5:45 PM - 6:00 PM | MATCH EXCHANGE & DEPARTURE
─────────────────────────────────────────
• Submit connection preferences
• Receive contact info for mutual matches
• Closing announcements
• Prayer for God's blessing on new connections

═══════════════════════════════════════════
FAITH & FELLOWSHIP GAMES CORNER
(Available throughout the event)
═══════════════════════════════════════════
• Bible Trivia Relay
• SDA Heritage Bingo
• Hymn Humming Challenge
• "Name That Prophet" Charades
• Small prizes: devotionals & bookmarks

═══════════════════════════════════════════
IMPORTANT REMINDERS
═══════════════════════════════════════════

✓ Arrive on time for prayer opening
✓ Bring your ticket/confirmation
✓ Wear your name tag throughout
✓ Participate with an open heart
✓ Respect all participants
✓ No photography without consent
✓ Keep conversations faith-focused

═══════════════════════════════════════════
OUR COMMITMENT TO ADVENTIST VALUES
═══════════════════════════════════════════

Every activity honors Christ and upholds
Adventist principles. We intentionally avoid
secular entertainment and inappropriate music.
Our goal is purposeful fellowship leading to
equally yoked partnerships.

"Be ye not unequally yoked together
with unbelievers" - 2 Corinthians 6:14

═══════════════════════════════════════════
CONTACT INFORMATION
═══════════════════════════════════════════

For inquiries: Contact event organizers
Website: Adventist Singles Spark

May God bless your connections!
═══════════════════════════════════════════
`;

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Create blob and download
    const blob = new Blob([programContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Adventist-Singles-Spark-Program.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Adventist Singles Spark - Event Program</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                white-space: pre-wrap; 
                padding: 20px;
                line-height: 1.4;
                max-width: 800px;
                margin: 0 auto;
              }
              @media print {
                body { font-size: 11pt; }
              }
            </style>
          </head>
          <body>${programContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <section id="program" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Event Agenda
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Download Event Program
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Save the complete event agenda to your phone or print it for reference
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Program Preview Card */}
          <Card className="border-none shadow-strong overflow-hidden">
            <CardHeader className="bg-gradient-hero text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Event Program Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{eventData.event_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-muted-foreground">{eventData.event_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Venue</p>
                    <p className="text-muted-foreground">{eventData.venue}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Program Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete event timeline</li>
                  <li>• All 8 activity descriptions</li>
                  <li>• Faith & Fellowship games info</li>
                  <li>• Important reminders</li>
                  <li>• Adventist values statement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Download Actions Card */}
          <Card className="border-none shadow-strong">
            <CardHeader>
              <CardTitle>Get Your Copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  onClick={handleDownload} 
                  className="w-full h-14 text-lg"
                  disabled={isGenerating}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isGenerating ? "Generating..." : "Download Program (TXT)"}
                </Button>
                
                <Button 
                  onClick={handlePrint} 
                  variant="outline" 
                  className="w-full h-14 text-lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Print Program
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Save to Phone</p>
                    <p className="text-xs text-muted-foreground">
                      Download and access offline during the event
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                The program file can be opened on any device and printed at home or office
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EventProgram;
