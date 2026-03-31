import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { Building2, MapPin, LayoutGrid, Globe, FileText, ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const EditNGOProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    description: "",
    city: "",
    category: "",
    website: "",
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
          description: data.description || "",
          city: data.city || "",
          category: data.category || "",
          website: data.website || "",
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

  const handleSelectChange = (val: string, field: string) => {
    setForm({ ...form, [field]: val });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/ngo/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        toast.success("Profile updated successfully!");
        navigate("/ngo/dashboard");
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
                onClick={() => navigate("/ngo/dashboard")}
                className="mb-2 -ml-3 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Organization Profile
              </h1>
              <p className="text-slate-500 mt-1">
                Manage how your NGO appears to volunteers and the public.
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
                
                {/* Column 1: Basic Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" /> Organization Name
                    </label>
                    <Input
                      name="firstName"
                      placeholder="E.g., Green Earth Initiative"
                      value={form.firstName}
                      onChange={handleChange}
                      className="h-12 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Operating City
                    </label>
                    <Input
                      name="city"
                      placeholder="E.g., Mumbai, Maharashtra"
                      value={form.city}
                      onChange={handleChange}
                      className="h-12 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-primary" /> Primary Focus Area
                    </label>
                    <Select value={form.category} onValueChange={(val) => handleSelectChange(val, "category")}>
                      <SelectTrigger className="h-12 bg-slate-50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Social Welfare">Social Welfare</SelectItem>
                        <SelectItem value="Disaster Relief">Disaster Relief</SelectItem>
                        <SelectItem value="Women Empowerment">Women Empowerment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column 2: Additional Info */}
                <div className="space-y-6 h-full flex flex-col">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Website / Social Link
                    </label>
                    <Input
                      name="website"
                      placeholder="https://your-ngo.org"
                      value={form.website}
                      onChange={handleChange}
                      className="h-12 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2 flex-grow flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> About Organization
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Describe your organization's mission, history, and goals..."
                      value={form.description}
                      onChange={handleChange}
                      className="flex-grow min-h-[150px] resize-none bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/ngo/dashboard")}
                  className="h-12 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={saving}
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-md font-semibold"
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

export default EditNGOProfile;