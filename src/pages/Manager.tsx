import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, MapPin, Shirt, Upload, Trash2, ExternalLink, Image, Link as LinkIcon, LogOut, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EventDetails {
  id: string;
  event_date: string;
  event_time: string;
  venue: string;
  dress_code: string;
}

interface EventFlyer {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
  is_active: boolean;
  event_date: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  is_active: boolean;
}

interface TicketInventory {
  id: string;
  ticket_type: string;
  sold_quantity: number;
  max_quantity: number;
}

const Manager = () => {
  const { user, isLoading, isManager, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [flyers, setFlyers] = useState<EventFlyer[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [ticketInventory, setTicketInventory] = useState<TicketInventory[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [newFlyer, setNewFlyer] = useState({ title: "", description: "", event_date: "" });
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [newLink, setNewLink] = useState({ platform: "", url: "" });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    // Fetch event details
    const { data: eventData } = await supabase
      .from("event_details")
      .select("*")
      .limit(1)
      .single();
    
    if (eventData) {
      setEventDetails(eventData);
    }

    // Fetch flyers (managers can see all)
    const { data: flyersData } = await supabase
      .from("event_flyers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (flyersData) {
      setFlyers(flyersData);
    }

    // Fetch social links
    const { data: linksData } = await supabase
      .from("social_links")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (linksData) {
      setSocialLinks(linksData);
    }

    // Fetch ticket inventory
    const { data: ticketData } = await supabase
      .from("ticket_inventory")
      .select("*");
    
    if (ticketData) {
      setTicketInventory(ticketData);
    }
  };

  const handleUpdateEventDetails = async () => {
    if (!eventDetails || !isManager) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from("event_details")
      .update({
        event_date: eventDetails.event_date,
        event_time: eventDetails.event_time,
        venue: eventDetails.venue,
        dress_code: eventDetails.dress_code,
        updated_at: new Date().toISOString(),
        updated_by: user?.id,
      })
      .eq("id", eventDetails.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update event details. Make sure you have manager permissions.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Event details updated successfully.",
      });
    }
    setIsSaving(false);
  };

  const handleUploadFlyer = async () => {
    if (!flyerFile || !newFlyer.title || !isManager) return;

    setIsUploading(true);
    const fileExt = flyerFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("flyers")
      .upload(fileName, flyerFile);

    if (uploadError) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload flyer image. Make sure you have manager permissions.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("flyers")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("event_flyers")
      .insert({
        title: newFlyer.title,
        description: newFlyer.description || null,
        event_date: newFlyer.event_date || null,
        image_url: publicUrl,
        created_by: user?.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save flyer. Make sure you have manager permissions.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Flyer uploaded successfully.",
      });
      setNewFlyer({ title: "", description: "", event_date: "" });
      setFlyerFile(null);
      fetchData();
    }
    setIsUploading(false);
  };

  const handleDeleteFlyer = async (id: string, imageUrl: string) => {
    if (!isManager) return;
    
    const fileName = imageUrl.split("/").pop();
    if (fileName) {
      await supabase.storage.from("flyers").remove([fileName]);
    }

    const { error } = await supabase
      .from("event_flyers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete flyer.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Flyer deleted successfully.",
      });
      fetchData();
    }
  };

  const handleToggleFlyerActive = async (id: string, isActive: boolean) => {
    if (!isManager) return;
    
    const { error } = await supabase
      .from("event_flyers")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (!error) {
      fetchData();
    }
  };

  const handleAddSocialLink = async () => {
    if (!newLink.platform || !newLink.url || !isManager) return;

    const { error } = await supabase
      .from("social_links")
      .insert({
        platform: newLink.platform,
        url: newLink.url,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add social link. Make sure you have manager permissions.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Social link added successfully.",
      });
      setNewLink({ platform: "", url: "" });
      fetchData();
    }
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!isManager) return;
    
    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id);

    if (!error) {
      toast({
        title: "Deleted",
        description: "Social link deleted.",
      });
      fetchData();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-xl font-bold">Manager Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8">
        {!isManager && (
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              You are logged in but don't have manager permissions. Contact an admin to get manager access.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="event" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="flyers">Flyers</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          {/* Event Details Tab */}
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Update the event information displayed on the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventDetails && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event_date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Date
                        </Label>
                        <Input
                          id="event_date"
                          value={eventDetails.event_date}
                          onChange={(e) => setEventDetails({ ...eventDetails, event_date: e.target.value })}
                          placeholder="e.g., March 15, 2025"
                          disabled={!isManager}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event_time" className="flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Time
                        </Label>
                        <Input
                          id="event_time"
                          value={eventDetails.event_time}
                          onChange={(e) => setEventDetails({ ...eventDetails, event_time: e.target.value })}
                          placeholder="e.g., 1:00 PM - 7:00 PM"
                          disabled={!isManager}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venue" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Venue
                        </Label>
                        <Input
                          id="venue"
                          value={eventDetails.venue}
                          onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
                          placeholder="e.g., Nairobi Event Center"
                          disabled={!isManager}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dress_code" className="flex items-center gap-2">
                          <Shirt className="w-4 h-4" /> Dress Code
                        </Label>
                        <Input
                          id="dress_code"
                          value={eventDetails.dress_code}
                          onChange={(e) => setEventDetails({ ...eventDetails, dress_code: e.target.value })}
                          placeholder="e.g., Smart Casual"
                          disabled={!isManager}
                        />
                      </div>
                    </div>
                    <Button onClick={handleUpdateEventDetails} disabled={isSaving || !isManager}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flyers Tab */}
          <TabsContent value="flyers">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" /> Upload New Flyer
                  </CardTitle>
                  <CardDescription>Add event flyers for upcoming events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flyer_title">Flyer Title</Label>
                      <Input
                        id="flyer_title"
                        value={newFlyer.title}
                        onChange={(e) => setNewFlyer({ ...newFlyer, title: e.target.value })}
                        placeholder="e.g., Singles Spark March 2025"
                        disabled={!isManager}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flyer_date">Event Date (optional)</Label>
                      <Input
                        id="flyer_date"
                        value={newFlyer.event_date}
                        onChange={(e) => setNewFlyer({ ...newFlyer, event_date: e.target.value })}
                        placeholder="e.g., March 15, 2025"
                        disabled={!isManager}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flyer_description">Description (optional)</Label>
                    <Input
                      id="flyer_description"
                      value={newFlyer.description}
                      onChange={(e) => setNewFlyer({ ...newFlyer, description: e.target.value })}
                      placeholder="Brief description of the event"
                      disabled={!isManager}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flyer_image">Flyer Image</Label>
                    <Input
                      id="flyer_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFlyerFile(e.target.files?.[0] || null)}
                      disabled={!isManager}
                    />
                  </div>
                  <Button onClick={handleUploadFlyer} disabled={isUploading || !flyerFile || !newFlyer.title || !isManager}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Flyer"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Flyers</CardTitle>
                </CardHeader>
                <CardContent>
                  {flyers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No flyers uploaded yet</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {flyers.map((flyer) => (
                        <div key={flyer.id} className="border rounded-lg overflow-hidden">
                          <img
                            src={flyer.image_url}
                            alt={flyer.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3 space-y-2">
                            <h4 className="font-semibold">{flyer.title}</h4>
                            {flyer.event_date && (
                              <p className="text-sm text-muted-foreground">{flyer.event_date}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={flyer.is_active ? "secondary" : "outline"}
                                onClick={() => handleToggleFlyerActive(flyer.id, flyer.is_active)}
                                disabled={!isManager}
                              >
                                {flyer.is_active ? "Active" : "Inactive"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteFlyer(flyer.id, flyer.image_url)}
                                disabled={!isManager}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" /> Add Social Link
                  </CardTitle>
                  <CardDescription>Add links to event photos on social media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform Name</Label>
                      <Input
                        id="platform"
                        value={newLink.platform}
                        onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                        placeholder="e.g., Instagram, Facebook, Google Photos"
                        disabled={!isManager}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">Link URL</Label>
                      <Input
                        id="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        placeholder="https://..."
                        disabled={!isManager}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddSocialLink} disabled={!newLink.platform || !newLink.url || !isManager}>
                    Add Link
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Links</CardTitle>
                </CardHeader>
                <CardContent>
                  {socialLinks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No social links added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {socialLinks.map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{link.platform}</h4>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              {link.url.substring(0, 40)}...
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSocialLink(link.id)}
                            disabled={!isManager}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Inventory</CardTitle>
                <CardDescription>View early bird ticket sales status</CardDescription>
              </CardHeader>
              <CardContent>
                {ticketInventory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No ticket inventory data</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {ticketInventory.map((ticket) => (
                      <div key={ticket.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold capitalize mb-2">
                          {ticket.ticket_type.replace(/_/g, " ")}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sold:</span>
                            <span className="font-medium">{ticket.sold_quantity} / {ticket.max_quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining:</span>
                            <span className="font-medium">{ticket.max_quantity - ticket.sold_quantity}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${(ticket.sold_quantity / ticket.max_quantity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Manager;
