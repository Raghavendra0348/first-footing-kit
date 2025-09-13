import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useReports } from "@/contexts/ReportsContext";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Upload, Camera, Phone, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/constants";
import { MediaPreview } from "@/components/MediaPreview";
import { motion } from "framer-motion";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addReport, uploadMedia } = useReports();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState({ address: "", lat: undefined as number | undefined, lng: undefined as number | undefined });
  const [media, setMedia] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category || !location.address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files first
      const uploadedMediaUrls: string[] = [];
      for (const file of mediaFiles) {
        try {
          const url = await uploadMedia(file);
          uploadedMediaUrls.push(url);
        } catch (error) {
          console.error('Error uploading file:', error);
          // Continue with other files
        }
      }

      const reportData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority: "medium",
        status: "submitted",
        citizenName: user?.user_metadata?.full_name || "Anonymous User",
        citizenEmail: user?.email || "",
        citizenPhone: user?.user_metadata?.phone || undefined,
        location: {
          address: location.address.trim(),
          lat: location.lat || 0,
          lng: location.lng || 0,
        },
        media: uploadedMediaUrls,
        publicNotes: [],
        internalNotes: [],
      };

      const reportId = await addReport(reportData);
      
      toast({
        title: "Report Submitted Successfully!",
        description: `Your issue has been logged with ID: ${reportId}`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation({ address: "", lat: undefined, lng: undefined });
      setMedia([]);
      setMediaFiles([]);
      
      // Navigate to success page or dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMediaUrls = files.map(file => URL.createObjectURL(file));
    setMedia(prev => [...prev, ...newMediaUrls]);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Detected",
            description: "Your current location has been added to the report.",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to detect your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mr-4"
            >
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Report a Civic Issue
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your voice matters! Help us improve your community by reporting issues that need attention. 
            Every report makes a difference.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-border/50 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-civic-blue" />
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the issue, including when you first noticed it and any relevant details."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="Enter address or coordinates"
                        value={location.address}
                        onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLocationDetect}
                        className="px-3"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click the location icon to auto-detect your current location
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photos">Photos</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload photos of the issue (optional but recommended)
                      </p>
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*,video/*,audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photos')?.click()}
                      >
                        Choose Files
                      </Button>
                      {media.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {media.map((mediaUrl, index) => (
                            <MediaPreview
                              key={index}
                              url={mediaUrl}
                              type="image"
                              className="h-20"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-civic-blue/10 to-civic-green/10 rounded-lg p-6 border border-civic-blue/20">
                    <div className="flex items-start">
                      <Phone className="w-6 h-6 text-civic-blue mt-0.5 mr-4" />
                      <div>
                        <h3 className="font-semibold text-civic-blue mb-3">Emergency Issues</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          For urgent issues that pose immediate danger (gas leaks, water main breaks, etc.), 
                          please call our emergency hotline: <strong className="text-civic-red">(555) 911-CITY</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      variant="civic"
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="px-8"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="shadow-card bg-gradient-to-br from-background to-muted/20">
              <CardHeader>
                <CardTitle className="text-civic-blue">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: "1", title: "Immediate Review", desc: "Your report is reviewed within 24 hours" },
                  { step: "2", title: "Assignment", desc: "Assigned to the appropriate department" },
                  { step: "3", title: "Progress Updates", desc: "Regular updates sent to your email" },
                  { step: "4", title: "Resolution", desc: "Issue resolved and marked complete" }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-civic-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-to-br from-civic-green/5 to-civic-blue/5">
              <CardHeader>
                <CardTitle className="text-civic-green">Recent Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-civic-green" />
                    <span>247 potholes repaired this month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-civic-green" />
                    <span>156 streetlights fixed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-civic-green" />
                    <span>89 parks cleaned and maintained</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;