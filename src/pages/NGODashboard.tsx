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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";




// Mock posted opportunities
// const postedOpportunities = [
//   {
//     id: 1,
//     title: "Teaching English to Underprivileged Children",
//     applicants: 12,
//     accepted: 3,
//     pending: 7,
//     rejected: 2,
//     postedOn: "2025-01-20",
//   },
//   {
//     id: 2,
//     title: "Weekend Tutoring Program",
//     applicants: 8,
//     accepted: 2,
//     pending: 5,
//     rejected: 1,
//     postedOn: "2025-01-25",
//   },
//   {
//     id: 3,
//     title: "Digital Literacy Camp",
//     applicants: 5,
//     accepted: 0,
//     pending: 5,
//     rejected: 0,
//     postedOn: "2025-02-01",
//   },
// ];

// Mock recent applicants
// const recentApplicants = [
//   {
//     id: 1,
//     name: "Rahul Verma",
//     opportunity: "Teaching English",
//     skills: ["Teaching", "Communication"],
//     status: "pending",
//     appliedOn: "2025-02-03",
//   },
//   {
//     id: 2,
//     name: "Sneha Patel",
//     opportunity: "Weekend Tutoring",
//     skills: ["Tutoring", "Math"],
//     status: "pending",
//     appliedOn: "2025-02-02",
//   },
//   {
//     id: 3,
//     name: "Amit Kumar",
//     opportunity: "Digital Literacy",
//     skills: ["Tech", "Training"],
//     status: "pending",
//     appliedOn: "2025-02-01",
//   },
// ];

const NGODashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [postedOpportunities, setPostedOpportunities] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [ngo, setNgo] = useState<any>(null);

  const totalApplicants = postedOpportunities.reduce(
    (sum, opp) => sum + (opp.totalApplicants || 0),
    0
  );
  const totalAccepted = postedOpportunities.reduce(
    (sum, opp) => sum + (opp.accepted || 0),
    0
  );
  const totalPending = postedOpportunities.reduce(
    (sum, opp) => sum + (opp.pending || 0),
    0
  );
  const [category, setCategory] = useState("");
  const [commitment, setCommitment] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [onboardingDetails, setOnboardingDetails] = useState({
    locationUrl: "",
    dateTime: "",
    contactPerson: "",
    instructions: "",
    whatsappGroup: "",
  });

  const [showAllOpps, setShowAllOpps] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);

  const fetchApplicants = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/application/ngo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setApplicants(Array.isArray(data) ? data : []);
  };

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
        const headers = { Authorization: `Bearer ${token}` };
        
        // Parallelize all network requests to avoid waterfall loading
        const [authRes, oppRes, appRes] = await Promise.all([
          fetch(`${API_URL}/api/auth/me`, { headers }),
          fetch(`${API_URL}/api/opportunity/my`, { headers }),
          fetch(`${API_URL}/api/application/ngo`, { headers })
        ]);

        if (!authRes.ok) throw new Error("Failed to load NGO");

        const data = await authRes.json();
        setNgo({
          name: data.firstName,              // org name stored here
          description: data.description || "",
          category: data.category || "NGO",
          city: data.city || "Not specified",
          registrationId: data._id,
          verified: data.ngoVerified,
          logo: data.logo || "",
        });

        if (oppRes.ok) {
          const oppData = await oppRes.json();
          setPostedOpportunities(Array.isArray(oppData) ? oppData : []);
          console.log("MY OPP DATA:", oppData);
        }
        
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplicants(Array.isArray(appData) ? appData : []);
        }

      } catch (err) {
        navigate("/login");
      }
    };

    fetchNGO();


  }, [navigate]);


  if (!ngo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <Button variant="saffron" size="lg" onClick={() => setShowForm(true)}>
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

          {/* 👇 ADD FORM HERE 👇 */}
          {showForm && (
            <motion.div 
               initial={{opacity: 0, y: -10, scale: 0.98}} 
               animate={{opacity: 1, y: 0, scale: 1}} 
               className="civic-card p-6 md:p-8 bg-card mb-8 border border-saffron-500/20 shadow-xl relative overflow-hidden rounded-2xl"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-saffron-500" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-saffron-500/10 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                   <h2 className="font-display font-semibold text-2xl text-foreground">Draft New Mission</h2>
                   <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-muted-foreground hover:bg-secondary rounded-full h-8 w-8 p-0">✕</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <input
                    className="w-full bg-secondary/60 border border-border/50 outline-none focus:ring-2 focus:ring-saffron-500/50 rounded-xl px-4 py-3 text-sm transition-all focus:bg-background"
                    placeholder="Opportunity Title (e.g. Slum Teaching) *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    className="w-full bg-secondary/60 border border-border/50 outline-none focus:ring-2 focus:ring-saffron-500/50 rounded-xl px-4 py-3 text-sm transition-all focus:bg-background"
                    placeholder="City / Area *"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <textarea
                  className="w-full bg-secondary/60 border border-border/50 outline-none focus:ring-2 focus:ring-saffron-500/50 rounded-xl px-4 py-3 text-sm transition-all focus:bg-background mb-5 min-h-[100px] resize-y"
                  placeholder="Detailed Mission Description *"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <Select onValueChange={setCategory}>
                      <SelectTrigger className="w-full bg-secondary/60 border border-border/50 rounded-xl px-4 h-11 text-sm">
                        <SelectValue placeholder="Social Category *" />
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

                    <Select onValueChange={setCommitment}>
                      <SelectTrigger className="w-full bg-secondary/60 border border-border/50 rounded-xl px-4 h-11 text-sm">
                        <SelectValue placeholder="Time Commitment *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                        <SelectItem value="Weekends">Weekends</SelectItem>
                        <SelectItem value="Weekdays">Weekdays</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className="mb-6">
                    <input
                      className="w-full bg-secondary/60 border border-border/50 outline-none focus:ring-2 focus:ring-saffron-500/50 rounded-xl px-4 py-3 text-sm transition-all focus:bg-background"
                      placeholder="Add preferred skills & press Enter (e.g. Figma, Canva, English)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                            setSkills([...skills, skillInput.trim()]);
                            setSkillInput("");
                          }
                        }
                      }}
                    />
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm border border-saffron-200">
                              {skill}
                              <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-red-500 ml-1">✕</button>
                            </span>
                          ))}
                        </div>
                    )}
                </div>

                {/* Onboarding block - Elevated UI */}
                <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100/60 mb-8 relative overflow-hidden shadow-inner hidden md:block" style={{display: 'block'}}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  
                  <h3 className="font-semibold text-indigo-900 mb-5 flex items-center gap-2 relative z-10 text-sm tracking-wide uppercase">
                    <MapPin className="w-4 h-4 text-indigo-600"/> 
                    Mission Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    <input
                      className="w-full bg-white/70 border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400/50 rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                      placeholder="Google Maps URL or Physical Address *"
                      value={onboardingDetails.locationUrl}
                      onChange={(e) => setOnboardingDetails({ ...onboardingDetails, locationUrl: e.target.value })}
                    />
                    <input
                      type="datetime-local"
                      className="w-full bg-white/70 border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400/50 rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white text-muted-foreground"
                      value={onboardingDetails.dateTime}
                      onChange={(e) => setOnboardingDetails({ ...onboardingDetails, dateTime: e.target.value })}
                    />
                    <input
                      className="w-full bg-white/70 border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400/50 rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white md:col-span-2"
                      placeholder="POC Name & Number (e.g. Ramesh: +91 91234 56789) *"
                      value={onboardingDetails.contactPerson}
                      onChange={(e) => setOnboardingDetails({ ...onboardingDetails, contactPerson: e.target.value })}
                    />
                    <textarea
                      className="w-full bg-white/70 border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400/50 rounded-xl px-4 py-3 text-sm transition-all focus:bg-white md:col-span-2 min-h-[80px]"
                      placeholder="Special Instructions (Dress code, things to carry, ID proofs)"
                      value={onboardingDetails.instructions}
                      onChange={(e) => setOnboardingDetails({ ...onboardingDetails, instructions: e.target.value })}
                    />
                    <input
                      className="w-full bg-white/70 border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400/50 rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white md:col-span-2"
                      placeholder="WhatsApp Group Link (Optional)"
                      value={onboardingDetails.whatsappGroup}
                      onChange={(e) => setOnboardingDetails({ ...onboardingDetails, whatsappGroup: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button 
                      variant="saffron"
                      className="rounded-xl shadow-md"
                      onClick={async () => {
                        const token = localStorage.getItem("token");

                        await fetch(`${API_URL}/api/opportunity/create`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ 
                            title, description, location, category, commitment, skills,
                            onboarding: onboardingDetails.dateTime ? {
                              ...onboardingDetails,
                              dateTime: new Date(onboardingDetails.dateTime).toISOString()
                            } : onboardingDetails
                          }),
                        });

                        setShowForm(false);
                        setTitle("");
                        setDescription("");
                        setLocation("");
                        setSkills([]);
                        setOnboardingDetails({
                          locationUrl: "",
                          dateTime: "",
                          contactPerson: "",
                          instructions: "",
                          whatsappGroup: "",
                        });
                        toast.success("Mission went live successfully!");
                        
                        const newOppRes = await fetch(`${API_URL}/api/opportunity/my`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });

                        const newOppData = await newOppRes.json();
                        setPostedOpportunities(Array.isArray(newOppData) ? newOppData : []);
                      }}
                    >
                      Publish Mission Request
                    </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Opportunities */}
              <SectionCard 
                title="Your Opportunities" 
                actionText={postedOpportunities.length > 3 ? (showAllOpps ? "View less" : "View all") : null}
                onAction={() => setShowAllOpps(!showAllOpps)}
              >
                {postedOpportunities.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No opportunities posted yet.
                  </div>
                ) : (
                  <>
                    {(showAllOpps ? postedOpportunities : postedOpportunities.slice(0, 3)).map((opp: any) => (
                    <div
                      key={opp._id}
                      className="p-4 bg-secondary/50 rounded-xl border border-border hover:shadow-md transition"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {opp.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Posted on {new Date(opp.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-3 text-sm mt-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-saffron-500" />
                          {opp.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-saffron-500" />
                          <span className={`px-2 py-1 rounded-full text-xs ${opp.category === "Education"
                            ? "bg-blue-100 text-blue-700"
                            : opp.category === "Environment"
                              ? "bg-green-100 text-green-700"
                              : opp.category === "Health"
                                ? "bg-red-100 text-red-700"
                                : opp.category === "Social Welfare"
                                  ? "bg-purple-100 text-purple-700"
                                  : opp.category === "Disaster Relief"
                                    ? "bg-orange-100 text-orange-700"
                                    : opp.category === "Women Empowerment"
                                      ? "bg-pink-100 text-pink-700"
                                      : "bg-gray-100 text-gray-700"
                            }`}>
                            {opp.category}
                          </span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-saffron-500" />
                          {opp.commitment}
                        </span>
                      </div>

                      {/* Skills */}
                      {opp.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {opp.skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-200 rounded-md text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {opp.totalApplicants || 0}
                          </span>

                          <span className="flex items-center gap-1 text-green-600">
                            <UserCheck className="w-4 h-4" />
                            {opp.accepted || 0}
                          </span>

                          <span className="flex items-center gap-1 text-saffron-600">
                            <Clock className="w-4 h-4" />
                            {opp.pending || 0}
                          </span>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => navigate(`/ngo/mission/${opp._id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  </>
                )}
              </SectionCard>

              {/* Applicants */}
              {/* <SectionCard title="Recent Applicants" link="/ngo/applicants">
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
              </SectionCard> */}
              <SectionCard 
                title="Recent Applicants" 
                actionText={applicants.length > 4 ? (showAllApps ? "View less" : "View all") : null}
                onAction={() => setShowAllApps(!showAllApps)}
              >
                {applicants.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    No applications yet.
                  </div>
                ) : (() => {
                  const sortedApps = [...applicants].sort((a, b) => {
                    const statusOrder: Record<string, number> = { 
                      pending: 1, 
                      accepted: 2, 
                      completed: 3, 
                      absent: 4, 
                      rejected: 5 
                    };
                    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
                  });
                  
                  const displayedApps = showAllApps ? sortedApps : sortedApps.slice(0, 4);

                  return (
                    <>
                    {displayedApps.map((app: any) => (
                      <div
                        key={app._id}
                        className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-transparent hover:border-border transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                            {app.volunteer.firstName?.[0] || "?"}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground text-sm">
                              {app.volunteer.firstName || "Unknown"}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">
                              Applied for: <span className="text-primary/80">{app.opportunity?.title}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center">
                          {app.status === "pending" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="shadow-sm"
                                onClick={async () => {
                                  const token = localStorage.getItem("token");
                                  await fetch(
                                    `${API_URL}/api/application/status/${app._id}`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({ status: "accepted" }),
                                    }
                                  );
                                  await fetchApplicants();
                                }}
                              >
                                Accept
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                onClick={async () => {
                                  const token = localStorage.getItem("token");
                                  await fetch(
                                    `${API_URL}/api/application/status/${app._id}`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({ status: "rejected" }),
                                    }
                                  );
                                  await fetchApplicants();
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === "accepted" && (
                            <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 text-xs font-bold tracking-wide">
                              ACCEPTED ✔
                            </span>
                          )}

                          {app.status === "completed" && (
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 text-xs font-bold tracking-wide">
                              COMPLETED 🏆
                            </span>
                          )}

                          {app.status === "rejected" && (
                            <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 text-xs font-bold tracking-wide">
                              REJECTED ✖
                            </span>
                          )}

                          {app.status === "absent" && (
                            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 text-xs font-bold tracking-wide">
                              ABSENT ✖
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    </>
                  );
                })()}
              </SectionCard>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <motion.div className="civic-card p-6 bg-card relative overflow-hidden">
                {/* Banner Header */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-saffron-500/80 to-saffron-500/40"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center pt-8">

                  {/* LOGO WITH UPLOAD */}
                  <div className="relative w-24 h-24 mx-auto mb-4 p-1 bg-white rounded-full shadow-xl border border-secondary">
                    <div className="w-full h-full rounded-full bg-secondary flex flex-col items-center justify-center overflow-hidden">
                      {ngo.logo ? (
                        <img
                          src={ngo.logo}
                          alt={ngo.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-saffron-600">{ngo.name?.[0]}</span>
                      )}
                    </div>

                    {/* Upload Icon Overlay */}
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer border border-border/50 hover:bg-slate-50 transition">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const token = localStorage.getItem("token");
                          const formData = new FormData();
                          formData.append("logo", file);

                          const res = await fetch(`${API_URL}/api/ngo/upload-logo`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          });

                          const data = await res.json();

                          if (res.ok) {
                            setNgo((prev: any) => ({
                              ...prev,
                              logo: data.logo,
                            }));
                          } else {
                            toast.error(data.message);
                          }
                        }}
                      />
                      <span className="text-xs">✏️</span>
                    </label>
                  </div>

                  {/* NGO NAME + VERIFIED ICON */}
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h2 className="font-bold text-xl text-foreground">{ngo.name}</h2>
                    {ngo.verified ? (
                      <Shield className="w-5 h-5 text-india-green-500" />
                    ) : (
                      <Shield className="w-5 h-5 text-yellow-500 opacity-60" />
                    )}
                  </div>

                  {/* VERIFIED BADGE */}
                  {ngo.verified ? (
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full mb-5">
                      Verified Foundation
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full mb-5">
                      Pending Verification
                    </span>
                  )}

                  <div className="w-full space-y-4 text-left border-t border-border/60 pt-5">
                    {/* DETAILS */}
                    <div className="pt-2 flex flex-col gap-2.5">
                      <div className="flex items-center gap-3 text-sm text-foreground/80 bg-secondary/30 p-2.5 rounded-lg border border-border/40">
                        <MapPin className="w-4 h-4 text-saffron-600 shrink-0" />
                        <span className="truncate text-xs font-medium">{ngo.city}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/80 bg-secondary/30 p-2.5 rounded-lg border border-border/40">
                        <Briefcase className="w-4 h-4 text-saffron-600 shrink-0" />
                        <span className="truncate text-xs font-medium">{ngo.category}</span>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="px-2 py-3">
                      <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">About Organization</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {ngo.description || "No description provided yet."}
                      </p>
                    </div>

                    <Button 
                      variant="saffron" 
                      className="w-full mt-3 font-semibold shadow-md rounded-xl h-10 transition-colors" 
                      onClick={() => navigate("/ngo/edit-profile")}
                    >
                      Edit Organization Profile
                    </Button>
                  </div>
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
// const StatCard = ({ label, value, icon: Icon }: any) => (
//   <motion.div className="civic-card p-5 bg-card">
//     <Icon className="w-5 h-5 mb-2" />
//     <p className="font-display text-2xl font-bold">{value}</p>
//     <p className="text-sm text-muted-foreground">{label}</p>
//   </motion.div>
// );

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

const SectionCard = ({ title, actionText, onAction, children }: any) => (
  <motion.div className="civic-card p-6 bg-card">
    <div className="flex justify-between mb-6">
      <h2 className="font-semibold">{title}</h2>
      {actionText && (
        <button onClick={onAction} className="text-sm text-saffron-600 hover:text-saffron-700 font-medium">
          {actionText}
        </button>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

export default NGODashboard;
