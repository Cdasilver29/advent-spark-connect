import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, GripVertical, Eye, EyeOff, Plus, Save, X } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  image_url: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  "Users", "Heart", "MessageCircle", "Music", "Utensils", 
  "BookOpen", "Star", "Sparkles", "Clock", "Trophy"
];

const ActivitiesManager = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  // New activity form state
  const [showNewForm, setShowNewForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    icon: "Users"
  });
  const [newActivityFile, setNewActivityFile] = useState<File | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch activities.",
        variant: "destructive",
      });
    } else if (data) {
      setActivities(data as Activity[]);
    }
    setIsLoading(false);
  };

  const handleUpdateActivity = async (activity: Activity) => {
    setIsSaving(true);
    const { error } = await supabase
      .from("activities")
      .update({
        title: activity.title,
        description: activity.description,
        icon: activity.icon,
        display_order: activity.display_order,
        is_active: activity.is_active,
      })
      .eq("id", activity.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update activity.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Activity updated successfully.",
      });
      setEditingId(null);
    }
    setIsSaving(false);
  };

  const handleUploadImage = async (activityId: string, file: File) => {
    setUploadingId(activityId);
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${activityId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("activities")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image.",
        variant: "destructive",
      });
      setUploadingId(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("activities")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("activities")
      .update({ image_url: publicUrl })
      .eq("id", activityId);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to update activity image.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
      fetchActivities();
    }
    setUploadingId(null);
  };

  const handleToggleActive = async (activity: Activity) => {
    const { error } = await supabase
      .from("activities")
      .update({ is_active: !activity.is_active })
      .eq("id", activity.id);

    if (!error) {
      setActivities(prev =>
        prev.map(a => a.id === activity.id ? { ...a, is_active: !a.is_active } : a)
      );
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete activity.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Activity deleted successfully.",
      });
      fetchActivities();
    }
  };

  const handleCreateActivity = async () => {
    if (!newActivity.title || !newActivity.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    let imageUrl = "/placeholder.svg";

    // Upload image if provided
    if (newActivityFile) {
      const fileExt = newActivityFile.name.split(".").pop();
      const fileName = `new-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("activities")
        .upload(fileName, newActivityFile);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("activities")
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const { error } = await supabase
      .from("activities")
      .insert({
        title: newActivity.title,
        description: newActivity.description,
        icon: newActivity.icon,
        image_url: imageUrl,
        display_order: activities.length + 1,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create activity.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Activity created successfully.",
      });
      setNewActivity({ title: "", description: "", icon: "Users" });
      setNewActivityFile(null);
      setShowNewForm(false);
      fetchActivities();
    }
    setIsSaving(false);
  };

  const updateActivityField = (id: string, field: keyof Activity, value: string | number | boolean) => {
    setActivities(prev =>
      prev.map(a => a.id === id ? { ...a, [field]: value } : a)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activities Manager</h2>
          <p className="text-muted-foreground">Update activity images and descriptions</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showNewForm ? "Cancel" : "Add Activity"}
        </Button>
      </div>

      {/* New Activity Form */}
      {showNewForm && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>New Activity</CardTitle>
            <CardDescription>Add a new activity to the list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">Title *</Label>
                <Input
                  id="new-title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="Activity title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon</Label>
                <Select
                  value={newActivity.icon}
                  onValueChange={(value) => setNewActivity({ ...newActivity, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Description *</Label>
              <Textarea
                id="new-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Activity description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-image">Image</Label>
              <Input
                id="new-image"
                type="file"
                accept="image/*"
                onChange={(e) => setNewActivityFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleCreateActivity} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Creating..." : "Create Activity"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className={!activity.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image Section */}
                <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(activity.id, file);
                      }}
                      disabled={uploadingId === activity.id}
                    />
                  </label>
                  {uploadingId === activity.id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-white text-xs animate-pulse">Uploading...</div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    {editingId === activity.id ? (
                      <Input
                        value={activity.title}
                        onChange={(e) => updateActivityField(activity.id, "title", e.target.value)}
                        className="font-semibold"
                      />
                    ) : (
                      <h3 className="font-semibold text-lg truncate">{activity.title}</h3>
                    )}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(activity)}
                        title={activity.is_active ? "Deactivate" : "Activate"}
                      >
                        {activity.is_active ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {editingId === activity.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={activity.description}
                        onChange={(e) => updateActivityField(activity.id, "description", e.target.value)}
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <Select
                          value={activity.icon}
                          onValueChange={(value) => updateActivityField(activity.id, "icon", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={activity.display_order}
                          onChange={(e) => updateActivityField(activity.id, "display_order", parseInt(e.target.value))}
                          className="w-20"
                          placeholder="Order"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateActivity(activity)}
                          disabled={isSaving}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            fetchActivities();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">Icon: {activity.icon}</span>
                        <span className="text-xs text-muted-foreground">Order: {activity.display_order}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setEditingId(activity.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No activities found. Click "Add Activity" to create one.
        </div>
      )}
    </div>
  );
};

export default ActivitiesManager;
