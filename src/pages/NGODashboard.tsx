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
        logo: data.logo || "",
      });

      const oppRes = await fetch(`${API_URL}/api/opportunity/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const oppData = await oppRes.json();
      setPostedOpportunities(Array.isArray(oppData) ? oppData : []);

      if (oppData && oppData.length > 0) {
  const firstOppId = oppData[0]._id;

  const appRes = await fetch(
    `${API_URL}/api/application/ngo/${firstOppId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const appData = await appRes.json();
  setApplicants(appData);
}
      
      console.log("MY OPP DATA:", oppData);
    } catch (err) {
      navigate("/login");
    }
  };

  fetchNGO();

  
}, [navigate]);


  if (!ngo) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header/>

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
  <div className="civic-card p-6 bg-card mb-6">
    <h2 className="font-semibold mb-4">Create Opportunity</h2>

    <input
      className="w-full mb-3 p-2 border rounded"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <textarea
      className="w-full mb-3 p-2 border rounded"
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <input
      className="w-full mb-3 p-2 border rounded"
      placeholder="Location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
    <input
  className="w-full mb-3 p-2 border rounded"
  placeholder="Add skill and press Enter"
  value={skillInput}
  onChange={(e) => setSkillInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillInput.trim()) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  }}
/>

<div className="flex flex-wrap gap-2 mb-3">
  {skills.map((skill, index) => (
    <span key={index} className="px-2 py-1 bg-gray-200 rounded text-sm">
      {skill}
    </span>
  ))}
</div>
    

    <Select onValueChange={setCategory}>
  <SelectTrigger className="w-full mb-3">
    <SelectValue placeholder="Select Category" />
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
  <SelectTrigger className="w-full mb-3">
    <SelectValue placeholder="Select Commitment" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Flexible">Flexible</SelectItem>
    <SelectItem value="Weekends">Weekends</SelectItem>
    <SelectItem value="Weekdays">Weekdays</SelectItem>
    <SelectItem value="Monthly">Monthly</SelectItem>
  </SelectContent>
</Select>

    <Button
      onClick={async () => {
        const token = localStorage.getItem("token");

        await fetch(`${API_URL}/api/opportunity/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, location, category, commitment, skills, }),
        });

        setShowForm(false);
        setTitle("");
        setDescription("");
        setLocation("");
        setSkills([]);
        // window.location.reload(); 
        toast.success("Opportunity Created Successfully");
        setShowForm(false);

const newOppRes = await fetch(`${API_URL}/api/opportunity/my`, {
  headers: { Authorization: `Bearer ${token}` },
});

const newOppData = await newOppRes.json();
setPostedOpportunities(Array.isArray(newOppData) ? newOppData : []);
      }}
    >
      Save
    </Button>
  </div>
)}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Opportunities */}
              <SectionCard title="Your Opportunities" link="/ngo/opportunities">
  {postedOpportunities.length === 0 ? (
    <div className="text-center py-10 text-muted-foreground">
      No opportunities posted yet.
    </div>
  ) : (
    postedOpportunities.map((opp: any) => (
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
            <span className={`px-2 py-1 rounded-full text-xs ${
  opp.category === "Education"
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

  <Button variant="ghost" size="sm">
    <Eye className="w-4 h-4" />
  </Button>
</div>
      </div>
    ))
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
              <SectionCard title="Recent Applicants" link="#">
  {applicants.length === 0 ? (
    <div className="text-muted-foreground text-sm">
      No applications yet.
    </div>
  ) : (
    applicants.map((app: any) => (
      <div
        key={app._id}
        className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {app.volunteer.firstName?.[0]}
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">
              {app.volunteer.firstName}
            </h3>
            <p className="text-xs text-muted-foreground">
              Applied for: {app.opportunity?.title}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {app.status === "pending" && (
          <>
          <Button
            variant="success"
            size="sm"
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

              setApplicants((prev) =>
                prev.map((a) =>
                  a._id === app._id ? { ...a, status: "accepted" } : a
                )
              );
            }}
          >
            Accept
          </Button>

          <Button
            variant="outline"
            size="sm"
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

              setApplicants((prev) =>
                prev.map((a) =>
                  a._id === app._id ? { ...a, status: "rejected" } : a
                )
              );
            }}
          >
            Reject
          </Button>
         </> 
          )}
          {app.status === "accepted" && (
    <span className="text-green-600 text-sm font-medium">
      Accepted ✔
    </span>
  )}

  {app.status === "rejected" && (
    <span className="text-red-600 text-sm font-medium">
      Rejected ✖
    </span>
  )}
        </div>
      </div>
    ))
  )}
</SectionCard>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <motion.div className="civic-card p-6 bg-card text-center">

  {/* LOGO WITH UPLOAD */}
  <div className="relative w-20 h-20 mx-auto mb-4">

    {ngo.logo ? (
      <img
        src={ngo.logo}
        alt={ngo.name}
        className="w-20 h-20 rounded-2xl object-cover"
      />
    ) : (
      <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold">
        {ngo.name?.[0]}
      </div>
    )}

    {/* Upload Icon Overlay */}
    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer text-xs">
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
            alert(data.message);
          }
        }}
      />
      ✏️
    </label>
  </div>

  {/* NGO NAME + VERIFIED ICON */}
  <div className="flex items-center justify-center gap-2">
    <h2 className="font-semibold text-lg">{ngo.name}</h2>

    {ngo.verified ? (
      <Shield className="w-5 h-5 text-india-green-500" />
    ) : (
      <Shield className="w-5 h-5 text-yellow-500 opacity-60" />
    )}
  </div>

  {/* VERIFIED BADGE */}
  {ngo.verified ? (
    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
      Verified NGO
    </span>
  ) : (
    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
      Pending Verification
    </span>
  )}

  {/* DESCRIPTION */}
  <p className="text-sm text-muted-foreground mt-4">
    {ngo.description}
  </p>

  {/* LOCATION + CATEGORY */}
  <div className="mt-4 space-y-2 text-sm">
    <div className="flex items-center gap-2 justify-center">
      <MapPin className="w-4 h-4" /> {ngo.city}
    </div>
    <div className="flex items-center gap-2 justify-center">
      <Briefcase className="w-4 h-4" /> {ngo.category}
    </div>
  </div>

  {/* REGISTRATION ID */}
  <div className="mt-6 pt-6 border-t border-border text-sm font-mono">
    {ngo.registrationId}
  </div>

  <Button variant="outline" className="w-full mt-6" onClick={() => navigate("/ngo/edit-profile")}>
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
