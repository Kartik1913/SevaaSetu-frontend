import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { User, MapPin, Calendar, Heart, Lightbulb, FileText, ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

const EditVolunteerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    availability: "",
    skills: "",
    interests: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          city: data.city || "",
          availability: data.availability || "",
          // Convert array back to comma-separated strings for simple input editing
          skills: data.skills && data.skills.length ? data.skills.join(", ") : "",
          interests: data.interests && data.interests.length ? data.interests.join(", ") : "",
          bio: data.bio || "",
        });
      } catch (err) {
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    // Convert comma-separated strings back to strictly trimmed arrays
    const formattedPayload = {
      ...form,
      skills: form.skills.split(",").map(item => item.trim()).filter(Boolean),
      interests: form.interests.split(",").map(item => item.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`${API_URL}/api/volunteer/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
        navigate("/volunteer/dashboard"); // Redirect to volunteer dashboard
      }
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="mb-2 -ml-3 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Volunteer Passport
              </h1>
              <p className="text-slate-500 mt-1">
                A complete profile boosts your credibility with NGOs!
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Column 1: Identity & Location */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> First Name
                      </label>
                      <Input
                        name="firstName"
                        placeholder="Aarav"
                        value={form.firstName}
                        onChange={handleChange}
                        className="bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <span className="w-4 h-4 inline-block" /> Last Name
                      </label>
                      <Input
                        name="lastName"
                        placeholder="Sharma"
                        value={form.lastName}
                        onChange={handleChange}
                        className="bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> City
                    </label>
                    <Input
                      name="city"
                      placeholder="E.g., Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> General Availability
                    </label>
                    <Input
                      name="availability"
                      placeholder="E.g., Weekends, Every Monday"
                      value={form.availability}
                      onChange={handleChange}
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                {/* Column 2: Gamification & Experience */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" /> Skills
                      </div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Comma Separated</span>
                    </label>
                    <Input
                      name="skills"
                      placeholder="E.g. Teaching, Java, Medicine, Event Mgmt"
                      value={form.skills}
                      onChange={handleChange}
                      className="bg-slate-50 bg-green-50/30 focus-visible:ring-green-500 border-green-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" /> Causes / Interests
                      </div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Comma Separated</span>
                    </label>
                    <Input
                      name="interests"
                      placeholder="E.g. Environment, Animal Rescue, Coding"
                      value={form.interests}
                      onChange={handleChange}
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Personal Bio
                    </label>
                    <Textarea
                      name="bio"
                      placeholder="Why do you love volunteering? What drives you to help..."
                      value={form.bio}
                      onChange={handleChange}
                      className="min-h-[105px] resize-none bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/volunteer/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-india-green-600 hover:bg-india-green-700 text-white shadow-md font-semibold"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Profile
                    </>
                  )}
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditVolunteerProfile;
