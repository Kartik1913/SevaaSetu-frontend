import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  GraduationCap,
  Leaf,
  HeartPulse,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock applied opportunities
const appliedOpportunities = [
  {
    id: 1,
    title: "Teaching English to Underprivileged Children",
    ngo: "Pratham Education Foundation",
    status: "pending",
    appliedOn: "2025-01-28",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "Tree Plantation Drive",
    ngo: "Green Earth Initiative",
    status: "accepted",
    appliedOn: "2025-01-20",
    icon: Leaf,
  },
  {
    id: 3,
    title: "Health Camp Assistant",
    ngo: "Rural Health Mission",
    status: "rejected",
    appliedOn: "2025-01-15",
    icon: HeartPulse,
  },
];

// Mock recommended opportunities
const recommendedOpportunities = [
  {
    id: 4,
    title: "Digital Literacy Program",
    ngo: "Digital India Foundation",
    location: "Mumbai",
    match: 95,
    icon: GraduationCap,
  },
  {
    id: 5,
    title: "Beach Cleanup Drive",
    ngo: "Clean Shores Foundation",
    location: "Mumbai",
    match: 88,
    icon: Leaf,
  },
];

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

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // 🔐 Auth + user bootstrap (TEMP until /auth/me)
  useEffect(() => {
  const fetchVolunteer = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "volunteer") {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to load user");
      }

      setUser({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        city: data.city || "Not specified",
        availability: data.availability || "Not specified",
        skills: data.skills || [],
        interests: data.interests || [],
        profileCompletion: 50, // temp, we’ll compute later
      });
    } catch (err) {
      navigate("/login");
    }
  };

  fetchVolunteer();
}, [navigate]);


  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your volunteering journey
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Completion */}
              <motion.div className="civic-card p-6 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">
                    Profile Completion
                  </h2>
                  <span className="text-sm font-medium text-saffron-600">
                    {user.profileCompletion}%
                  </span>
                </div>
                <Progress value={user.profileCompletion} className="h-2 mb-4" />
                <Button variant="outline" size="sm">
                  Complete Profile <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Applied Opportunities */}
              <motion.div className="civic-card p-6 bg-card">
                <h2 className="font-semibold text-foreground mb-6">
                  Applied Opportunities
                </h2>

                <div className="space-y-4">
                  {appliedOpportunities.map((opp) => {
                    const StatusIcon =
                      statusIcons[
                        opp.status as keyof typeof statusIcons
                      ];
                    return (
                      <div
                        key={opp.id}
                        className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                          <opp.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-foreground text-sm">
                            {opp.title}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {opp.ngo}
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
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <motion.div className="civic-card p-6 bg-card text-center">
                <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="font-semibold text-foreground text-lg">
                  {user.name}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>

                <div className="mt-4 text-sm flex justify-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {user.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {user.availability}
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
