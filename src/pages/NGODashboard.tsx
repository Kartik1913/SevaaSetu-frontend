import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Users,
  Plus,
  Eye,
  UserCheck,
  UserX,
  Clock,
  Briefcase,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/config/api";

// Mock posted opportunities
const postedOpportunities = [
  {
    id: 1,
    title: "Teaching English to Underprivileged Children",
    applicants: 12,
    accepted: 3,
    pending: 7,
    rejected: 2,
    postedOn: "2025-01-20",
  },
  {
    id: 2,
    title: "Weekend Tutoring Program",
    applicants: 8,
    accepted: 2,
    pending: 5,
    rejected: 1,
    postedOn: "2025-01-25",
  },
  {
    id: 3,
    title: "Digital Literacy Camp",
    applicants: 5,
    accepted: 0,
    pending: 5,
    rejected: 0,
    postedOn: "2025-02-01",
  },
];

// Mock recent applicants
const recentApplicants = [
  {
    id: 1,
    name: "Rahul Verma",
    opportunity: "Teaching English",
    skills: ["Teaching", "Communication"],
    status: "pending",
    appliedOn: "2025-02-03",
  },
  {
    id: 2,
    name: "Sneha Patel",
    opportunity: "Weekend Tutoring",
    skills: ["Tutoring", "Math"],
    status: "pending",
    appliedOn: "2025-02-02",
  },
  {
    id: 3,
    name: "Amit Kumar",
    opportunity: "Digital Literacy",
    skills: ["Tech", "Training"],
    status: "pending",
    appliedOn: "2025-02-01",
  },
];

const NGODashboard = () => {
  const navigate = useNavigate();

  const [ngo, setNgo] = useState<any>(null);

  const totalApplicants = postedOpportunities.reduce(
    (sum, opp) => sum + opp.applicants,
    0
  );
  const totalAccepted = postedOpportunities.reduce(
    (sum, opp) => sum + opp.accepted,
    0
  );
  const totalPending = postedOpportunities.reduce(
    (sum, opp) => sum + opp.pending,
    0
  );

  // 🔐 Auth + NGO bootstrap (TEMP until /auth/me)
  useEffect(() => {
  const fetchNGO = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "ngo") {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to load NGO");
      }

      setNgo({
        name: data.firstName,              // org name stored here
        description: data.description || "",
        category: data.category || "NGO",
        city: data.city || "Not specified",
        registrationId: data._id,
        verified: data.ngoVerified,
      });
    } catch (err) {
      navigate("/login");
    }
  };

  fetchNGO();
}, [navigate]);


  if (!ngo) return null;

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
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                NGO Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your opportunities and connect with volunteers
              </p>
            </div>
            <Button variant="saffron" size="lg">
              <Plus className="w-5 h-5" />
              Post New Opportunity
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Posted Opportunities" value={postedOpportunities.length} icon={Briefcase} />
            <StatCard label="Total Applicants" value={totalApplicants} icon={Users} />
            <StatCard label="Accepted" value={totalAccepted} icon={UserCheck} />
            <StatCard label="Pending Review" value={totalPending} icon={Clock} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Opportunities */}
              <SectionCard title="Your Opportunities" link="/ngo/opportunities">
                {postedOpportunities.map((opp) => (
                  <div key={opp.id} className="p-4 bg-secondary/50 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-foreground">{opp.title}</h3>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {opp.applicants}
                      </span>
                      <span className="flex items-center gap-1 text-india-green-600">
                        <UserCheck className="w-4 h-4" /> {opp.accepted}
                      </span>
                      <span className="flex items-center gap-1 text-saffron-600">
                        <Clock className="w-4 h-4" /> {opp.pending}
                      </span>
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* Applicants */}
              <SectionCard title="Recent Applicants" link="/ngo/applicants">
                {recentApplicants.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm">
                          {a.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Applied for: {a.opportunity}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="success" size="sm">
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <motion.div className="civic-card p-6 bg-card text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="font-semibold text-lg">{ngo.name}</h2>
                  {ngo.verified && (
                    <Shield className="w-5 h-5 text-india-green-500" />
                  )}
                </div>
                {ngo.verified && (
                  <span className="badge-green text-xs">Verified NGO</span>
                )}
                <p className="text-sm text-muted-foreground mt-4">
                  {ngo.description}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <MapPin className="w-4 h-4" /> {ngo.city}
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Briefcase className="w-4 h-4" /> {ngo.category}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border text-sm font-mono">
                  {ngo.registrationId}
                </div>

                <Button variant="outline" className="w-full mt-6">
                  Edit Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }: any) => (
  <motion.div className="civic-card p-5 bg-card">
    <Icon className="w-5 h-5 mb-2" />
    <p className="font-display text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

const SectionCard = ({ title, link, children }: any) => (
  <motion.div className="civic-card p-6 bg-card">
    <div className="flex justify-between mb-6">
      <h2 className="font-semibold">{title}</h2>
      <Link to={link} className="text-sm text-saffron-600">
        View all
      </Link>
    </div>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

export default NGODashboard;
