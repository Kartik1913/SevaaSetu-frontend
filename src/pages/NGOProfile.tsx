import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Shield, Briefcase, Users, UserCheck } from "lucide-react";
import { API_URL } from "@/config/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

const NGOProfile = () => {
  const { id } = useParams();
  const [ngo, setNgo] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
  });
  const navigate = useNavigate();
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [postedOpportunities, setPostedOpportunities] = useState<any[]>([]);
  const totalApplicants = postedOpportunities.reduce(
    (sum, opp) => sum + (opp.totalApplicants || 0),
    0
  );
  

  useEffect(() => {
    const fetchNGO = async () => {
      const res = await fetch(`${API_URL}/api/ngo/${id}`);
      const data = await res.json();

      setNgo(data.ngo);
      setOpportunities(data.opportunities || []);
      setStats({
        totalOpportunities: data.totalOpportunities,
        totalApplications: data.totalApplications,
      });
    };

    fetchNGO();
  }, [id]);

  useEffect(() => {
  const fetchApplied = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "volunteer") return;

    const res = await fetch(`${API_URL}/api/application/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!Array.isArray(data)) return;

    const ids = data.map((app: any) => app.opportunity?._id);
    setAppliedIds(ids);
  };

  fetchApplied();
}, []);

  if (!ngo) return null;
  

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 space-y-8">

          {/* HERO */}
          <motion.div className="civic-card p-6 bg-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
                {ngo.logo ? (
                    <img
                        src={ngo.logo}
                        alt={ngo.firstName}
                        className="w-16 h-16 rounded-2xl object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold">
                        {ngo.firstName?.[0]}
                    </div>
                )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold">
                    {ngo.firstName}
                  </h1>

                  {ngo.ngoVerified && (
                    <Shield className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  {ngo.city || "Location not specified"}
                </div>

                <p className="text-sm mt-2 text-muted-foreground">
                  {ngo.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <StatCard
    label="Opportunities"
    value={stats.totalOpportunities}
    icon={Briefcase}
  />

  <StatCard
    label="Applications"
    value={stats.totalApplications}
    icon={Users}
  />

  <StatCard
    label="Active"
    value={opportunities.filter(o => o.isActive).length}
    icon={UserCheck}
  />

  <StatCard
    label="Joined Year"
    value={new Date(ngo.createdAt).getFullYear()}
    icon={Clock}
  />
</div>
          </motion.div>

          {/* OPPORTUNITIES */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              Opportunities by {ngo.firstName}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp: any) => {

                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");
                const isApplied = appliedIds.includes(opp._id);
                const isLoading = loadingId === opp._id;

                return (
                    <div
                        key={opp._id}
                        className="civic-card p-4 bg-card hover:shadow-md transition"
                    >
                    <h3 className="font-medium mb-2">{opp.title}</h3>

                    <p className="text-sm text-muted-foreground mb-3">
                        {opp.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{opp.category}</span>
                        <span>{opp.location}</span>
                    </div>

                    <Button
                        disabled={isApplied || isLoading}
                        className={`w-full ${
                        isApplied
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-saffron-500 hover:bg-saffron-600 text-white"
                        }`}
                        onClick={async () => {
                            if (!token) {
                                navigate("/login");
                                return;
                            }

                            if (role !== "volunteer") {
                                toast.error("Only volunteers can apply.");
                                return;
                            }

                            setLoadingId(opp._id);

                            try {
                                const res = await fetch(
                                    `${API_URL}/api/application/apply/${opp._id}`,
                                    {
                                    method: "POST",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                    }
                                );

                                const data = await res.json();

                                if (!res.ok) {
                                    toast.error(data.message);
                                } else {
                                    setAppliedIds((prev) => [...prev, opp._id]);
                                    toast.success("Application submitted!");
                                }
                            } catch {
                                toast.error("Server error");
                            }

                            setLoadingId(null);
                        }}
                    >
                        {isLoading
                        ? "Applying..."
                        : isApplied
                        ? "Applied ✓"
                        : "Apply Now"}
                    </Button>
                    </div>
                );
            })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }: any) => (
  <motion.div className="civic-card p-5 bg-card flex items-center gap-4">
    <div className="p-3 rounded-xl bg-saffron-100">
      <Icon className="w-5 h-5 text-saffron-600" />
    </div>
    <div>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </motion.div>
);

export default NGOProfile;