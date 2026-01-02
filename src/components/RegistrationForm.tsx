import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Church, Users, Heart, Utensils } from "lucide-react";
import { z } from "zod";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  churchName: z.string().min(2, "Church name is required").max(100),
  churchDistrict: z.string().min(2, "Church district/conference is required").max(100),
  ageGroup: z.string().min(1, "Please select your age group"),
  ministryInterests: z.array(z.string()).min(1, "Please select at least one ministry interest"),
  dietaryRequirements: z.array(z.string()),
  otherDietary: z.string().max(200).optional(),
  expectations: z.string().max(500).optional(),
});

const ministryOptions = [
  "Music Ministry",
  "Youth Ministry",
  "Children's Ministry",
  "Health Ministry",
  "Community Service",
  "Evangelism",
  "Sabbath School",
  "Prayer Ministry",
  "Media/Tech Ministry",
  "Family Life Ministry",
  "Literature Evangelism",
  "Hospitality Ministry",
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Nut Allergy",
  "Dairy-Free",
  "No Restrictions",
];

const RegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    churchName: "",
    churchDistrict: "",
    ageGroup: "",
    ministryInterests: [] as string[],
    dietaryRequirements: [] as string[],
    otherDietary: "",
    expectations: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMinistryToggle = (ministry: string) => {
    setFormData(prev => ({
      ...prev,
      ministryInterests: prev.ministryInterests.includes(ministry)
        ? prev.ministryInterests.filter(m => m !== ministry)
        : [...prev.ministryInterests, ministry]
    }));
  };

  const handleDietaryToggle = (dietary: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRequirements: prev.dietaryRequirements.includes(dietary)
        ? prev.dietaryRequirements.filter(d => d !== dietary)
        : [...prev.dietaryRequirements, dietary]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = registrationSchema.parse(formData);
      
      // For now, just show success - can be connected to Supabase later
      toast({
        title: "Registration Submitted!",
        description: "Thank you for registering. You'll receive a confirmation email shortly.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        churchName: "",
        churchDistrict: "",
        ageGroup: "",
        ministryInterests: [],
        dietaryRequirements: [],
        otherDietary: "",
        expectations: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form and fix the highlighted errors.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-20 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Pre-Event Registration
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Register for the Event
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete your registration to help us prepare for a meaningful experience
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-none shadow-strong">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Participant Information</CardTitle>
            <CardDescription>
              All fields marked with * are required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0712 345 678"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">Age Group *</Label>
                    <Select
                      value={formData.ageGroup}
                      onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                    >
                      <SelectTrigger className={errors.ageGroup ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select your age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="21-28">21 - 28 years</SelectItem>
                        <SelectItem value="28-40">28 - 40 years</SelectItem>
                        <SelectItem value="40+">40+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.ageGroup && <p className="text-sm text-destructive">{errors.ageGroup}</p>}
                  </div>
                </div>
              </div>

              {/* Church Affiliation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Church className="w-5 h-5 text-primary" />
                  Church Affiliation
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="churchName">Church Name *</Label>
                    <Input
                      id="churchName"
                      value={formData.churchName}
                      onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                      placeholder="e.g., Maxwell SDA Church"
                      className={errors.churchName ? "border-destructive" : ""}
                    />
                    {errors.churchName && <p className="text-sm text-destructive">{errors.churchName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchDistrict">District/Conference *</Label>
                    <Input
                      id="churchDistrict"
                      value={formData.churchDistrict}
                      onChange={(e) => setFormData({ ...formData, churchDistrict: e.target.value })}
                      placeholder="e.g., Central Kenya Conference"
                      className={errors.churchDistrict ? "border-destructive" : ""}
                    />
                    {errors.churchDistrict && <p className="text-sm text-destructive">{errors.churchDistrict}</p>}
                  </div>
                </div>
              </div>

              {/* Ministry Interests */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Ministry Interests *
                </h3>
                <p className="text-sm text-muted-foreground">Select all ministries you're involved in or interested in:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ministryOptions.map((ministry) => (
                    <div key={ministry} className="flex items-center space-x-2">
                      <Checkbox
                        id={ministry}
                        checked={formData.ministryInterests.includes(ministry)}
                        onCheckedChange={() => handleMinistryToggle(ministry)}
                      />
                      <Label htmlFor={ministry} className="text-sm cursor-pointer">
                        {ministry}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.ministryInterests && <p className="text-sm text-destructive">{errors.ministryInterests}</p>}
              </div>

              {/* Dietary Requirements */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Dietary Requirements
                </h3>
                <p className="text-sm text-muted-foreground">Help us accommodate your dietary needs for the fellowship dinner:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dietaryOptions.map((dietary) => (
                    <div key={dietary} className="flex items-center space-x-2">
                      <Checkbox
                        id={dietary}
                        checked={formData.dietaryRequirements.includes(dietary)}
                        onCheckedChange={() => handleDietaryToggle(dietary)}
                      />
                      <Label htmlFor={dietary} className="text-sm cursor-pointer">
                        {dietary}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherDietary">Other Dietary Needs</Label>
                  <Input
                    id="otherDietary"
                    value={formData.otherDietary}
                    onChange={(e) => setFormData({ ...formData, otherDietary: e.target.value })}
                    placeholder="Please specify any other dietary requirements"
                  />
                </div>
              </div>

              {/* Expectations */}
              <div className="space-y-2">
                <Label htmlFor="expectations">What are you hoping to gain from this event? (Optional)</Label>
                <Textarea
                  id="expectations"
                  value={formData.expectations}
                  onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                  placeholder="Share your expectations or any special requests..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By registering, you confirm that you are a baptized Seventh-day Adventist single
                seeking to connect with fellow believers in accordance with biblical principles.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationForm;
