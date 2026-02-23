import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Leaf,
  HeartPulse,
  Building2,
  Users2,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/config/api";

const statusStyles = {
  pending: "bg-saffron-500/10 text-saffron-600",
  accepted: "bg-india-green-100 text-india-green-600",
  rejected: "bg-red-100 text-red-600",
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
};

const getIconFromCategory = (category?: string) => {
  switch (category) {
    case "Education":
      return GraduationCap;
    case "Environment":
      return Leaf;
    case "Health":
      return HeartPulse;
    case "Social Welfare":
      return Users2;
    default:
      return Briefcase;
  }
};

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState<any[]>([]);

  // 🔐 Fetch Volunteer Info
  useEffect(() => {
    const fetchVolunteer = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "volunteer") {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error();

        setUser({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          city: data.city || "Not specified",
          availability: data.availability || "Not specified",
          skills: data.skills || [],
          interests: data.interests || [],
          profileCompletion: 50,
        });
      } catch {
        navigate("/login");
      }
    };

    fetchVolunteer();
  }, [navigate]);

  // 📌 Fetch Applications
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_URL}/api/application/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!Array.isArray(data)) {
          setAppliedOpportunities([]);
          return;
        }

        const formatted = data.map((app: any) => ({
          id: app._id,
          title: app.opportunity?.title,
          ngo: app.opportunity?.ngo?.firstName,
          status: app.status,
          icon: getIconFromCategory(app.opportunity?.category),
        }));

        setAppliedOpportunities(formatted);
      } catch {
        setAppliedOpportunities([]);
      }
    };

    fetchApplications();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your volunteering journey
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Completion */}
              <motion.div className="civic-card p-6 bg-card">
                <div className="flex justify-between mb-4">
                  <h2 className="font-semibold">Profile Completion</h2>
                  <span className="text-sm font-medium text-saffron-600">
                    {user.profileCompletion}%
                  </span>
                </div>
                <Progress value={user.profileCompletion} className="h-2 mb-4" />
                <Button variant="outline" size="sm">
                  Complete Profile <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>

              {/* Applied Opportunities */}
              <motion.div className="civic-card p-6 bg-card">
                <h2 className="font-semibold mb-6">
                  Applied Opportunities
                </h2>

                {appliedOpportunities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    You haven’t applied to any opportunities yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appliedOpportunities.map((opp) => {
                      const StatusIcon =
                        statusIcons[
                          opp.status as keyof typeof statusIcons
                        ];
                      const IconComponent = opp.icon || Briefcase;

                      return (
                        <div
                          key={opp.id}
                          className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary-foreground" />
                          </div>

                          <div className="flex-grow">
                            <h3 className="font-medium text-sm">
                              {opp.title}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {opp.ngo}
                            </p>
                          </div>

                          <div
                            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                              statusStyles[
                                opp.status as keyof typeof statusStyles
                              ]
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {opp.status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              <motion.div className="civic-card p-6 bg-card text-center">
                <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>

                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>

                <div className="mt-4 text-sm flex justify-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {user.availability}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VolunteerDashboard;