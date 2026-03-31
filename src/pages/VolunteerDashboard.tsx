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
    AlertTriangle,
    Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/config/api";

const statusStyles = {
    pending: "bg-saffron-500/10 text-saffron-600",
    accepted: "bg-india-green-100 text-india-green-600",
    rejected: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-700",
    absent: "bg-slate-100 text-slate-600",
};

const statusIcons = {
    pending: Clock,
    accepted: CheckCircle2,
    rejected: XCircle,
    completed: CheckCircle2,
    absent: XCircle,
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
        case "Disaster Relief":
            return AlertTriangle;
        case "Women Empowerment":
            return Home;
        default:
            return Briefcase;
    }
};

const getCategoryColor = (category?: string) => {
    switch (category) {
        case "Education":
            return "bg-blue-500 text-white shadow-sm";
        case "Environment":
            return "bg-green-500 text-white shadow-sm";
        case "Health":
            return "bg-red-500 text-white shadow-sm";
        case "Social Welfare":
            return "bg-purple-500 text-white shadow-sm";
        case "Disaster Relief":
            return "bg-orange-500 text-white shadow-sm";
        case "Women Empowerment":
            return "bg-pink-500 text-white shadow-sm";
        default:
            return "bg-amber-500 text-white shadow-sm";
    }
};

const formatCustomDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "TBD";

    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `🗓 ${day} ${month} • ${hours}:${minutes} ${ampm}`;
};

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [appliedOpportunities, setAppliedOpportunities] = useState<any[]>([]);
    const [openId, setOpenId] = useState<string | null>(null);

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

                const profileFields = [
                    data.city,
                    data.availability,
                    data.skills && data.skills.length > 0,
                    data.interests && data.interests.length > 0,
                    data.bio,
                    data.logo || data.coverImage
                ];
                const filledFields = profileFields.filter(Boolean).length;
                const calculatedCompletion = Math.round((filledFields / profileFields.length) * 100);

                setUser({
                    name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                    email: data.email,
                    city: data.city || "Not specified",
                    availability: data.availability || "Not specified",
                    skills: data.skills || [],
                    interests: data.interests || [],
                    bio: data.bio || "",
                    profileCompletion: calculatedCompletion,
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
                    categoryColor: getCategoryColor(app.opportunity?.category),
                    onboarding: app.opportunity?.onboarding,
                    createdAt: app.createdAt,
                }));

                formatted.sort((a: any, b: any) => {
                    const statusOrder: Record<string, number> = { accepted: 1, pending: 2, completed: 3, rejected: 4, absent: 5 };
                    const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);

                    if (statusDiff !== 0) return statusDiff;

                    // If same status, sort by date
                    if (a.status === "accepted") {
                        // For accepted missions: sort by closest upcoming onboarding dateTime first
                        const dateA = a.onboarding?.dateTime ? new Date(a.onboarding.dateTime).getTime() : Number.MAX_SAFE_INTEGER;
                        const dateB = b.onboarding?.dateTime ? new Date(b.onboarding.dateTime).getTime() : Number.MAX_SAFE_INTEGER;
                        return dateA - dateB;
                    } else {
                        // For pending/rejected: sort by recently applied (createdAt) descending
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    }
                });

                setAppliedOpportunities(formatted);
            } catch {
                setAppliedOpportunities([]);
            }
        };

        fetchApplications();
    }, []);

    if (!user) {
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
                            {/* Impact Gamification Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <motion.div className="civic-card p-5 bg-card flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{appliedOpportunities.filter((o: any) => o.status === 'completed').length}</h3>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Missions Completed</p>
                                </motion.div>

                                <motion.div className="civic-card p-5 bg-card flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-india-green-100 flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-india-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{appliedOpportunities.filter((o: any) => o.status === 'accepted').length}</h3>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Upcoming Missions</p>
                                </motion.div>

                                <motion.div className="civic-card p-5 bg-card flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-saffron-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center mb-2 relative z-10">
                                        <HeartPulse className="w-5 h-5 text-saffron-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-saffron-700 relative z-10">{appliedOpportunities.filter((o: any) => o.status === 'completed').length * 3}</h3>
                                    <p className="text-xs text-saffron-600 uppercase font-black tracking-widest relative z-10">Total Impact Hours</p>
                                </motion.div>
                            </div>

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
                                                    className="flex flex-col p-4 bg-secondary/50 rounded-xl gap-3"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${opp.categoryColor}`}>
                                                            <IconComponent className="w-6 h-6" />
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
                                                            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ${statusStyles[
                                                                opp.status as keyof typeof statusStyles
                                                            ]
                                                                }`}
                                                        >
                                                            <StatusIcon className="w-3 h-3" />
                                                            {opp.status === "accepted" ? "Mission Joined" : opp.status === "completed" ? "Successfully Completed 🎉" : opp.status}
                                                        </div>
                                                    </div>

                                                    {opp.status === "accepted" && opp.onboarding && (
                                                        <div className="mt-2.5 relative overflow-hidden bg-background/60 backdrop-blur-sm border border-border/60 rounded-xl shadow-sm transition-all">

                                                            {/* Header - Clickable */}
                                                            <div
                                                                className="px-4 py-3 bg-india-green-500/10 border-b border-india-green-500/10 flex items-center justify-between cursor-pointer hover:bg-india-green-500/15 transition-colors group"
                                                                onClick={() => setOpenId(openId === opp.id ? null : opp.id)}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-white rounded-full p-0.5 shadow-sm hidden sm:block">
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-india-green-600" />
                                                                    </div>
                                                                    <span className="font-semibold text-india-green-700 text-[13px] tracking-wide">CHECK DETAILS</span>
                                                                </div>
                                                                <span className="text-india-green-600/60 group-hover:text-india-green-600 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1">
                                                                    {openId === opp.id ? "Close Details ▲" : "View Details ▼"}
                                                                </span>
                                                            </div>

                                                            {/* Expanded Data Block */}
                                                            {openId === opp.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    className="px-5 pb-5 pt-3"
                                                                >
                                                                    <div className="grid grid-cols-1 gap-5">

                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                                                                            {/* Location Badge */}
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-blue-50/80 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                                                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                                                </div>
                                                                                <div className="min-w-0 flex flex-col items-start justify-center">
                                                                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 leading-none mt-1">Location</p>
                                                                                    {opp.onboarding.locationUrl ? (
                                                                                        <a
                                                                                            href={opp.onboarding.locationUrl.startsWith("http") ? opp.onboarding.locationUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opp.onboarding.locationUrl)}`}
                                                                                            target="_blank"
                                                                                            rel="noreferrer"
                                                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200/50 leading-none shadow-sm"
                                                                                        >
                                                                                            Open Maps ↗
                                                                                        </a>
                                                                                    ) : (
                                                                                        <p className="font-medium text-[13px] text-foreground truncate">TBD</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Time Badge */}
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-amber-50/80 flex items-center justify-center shrink-0 border border-amber-100 shadow-sm">
                                                                                    <Calendar className="w-4 h-4 text-amber-600" />
                                                                                </div>
                                                                                <div className="min-w-0 flex flex-col items-start justify-center">
                                                                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 leading-none mt-1">Time & Date</p>
                                                                                    <p className="font-semibold text-[12px] text-amber-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/50 leading-none shadow-sm">
                                                                                        {formatCustomDate(opp.onboarding.dateTime)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="pt-4 border-t border-border/60 space-y-5">
                                                                            {/* Contact Person Badge */}
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-purple-50/80 flex items-center justify-center shrink-0 border border-purple-100 shadow-sm">
                                                                                    <User className="w-4 h-4 text-purple-600" />
                                                                                </div>
                                                                                <div className="min-w-0 flex flex-col items-start justify-center">
                                                                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 leading-none mt-1">Contact Person</p>
                                                                                    <p className="font-semibold text-[12px] text-purple-900 bg-purple-50 px-2 py-1 rounded-md border border-purple-200/50 leading-none shadow-sm tracking-wide">
                                                                                        {opp.onboarding.contactPerson || "Not provided"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            {opp.onboarding.instructions && (
                                                                                <div className="bg-secondary/40 rounded-xl p-4 text-[13px] text-foreground/90 whitespace-pre-wrap border border-border/40 leading-relaxed shadow-inner">
                                                                                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider block mb-2 opacity-80">Instructions / Notes</span>
                                                                                    {opp.onboarding.instructions}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {opp.onboarding.whatsappGroup && (
                                                                            <Button
                                                                                className="bg-[#25D366] hover:bg-[#20BE5A] text-white w-full sm:w-auto font-medium shadow-sm transition-all active:scale-[0.98] mt-1 rounded-xl h-11"
                                                                                onClick={() => window.open(opp.onboarding.whatsappGroup, "_blank")}
                                                                            >
                                                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                                                Join Volunteer Group
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-6">
                            <motion.div className="civic-card p-6 bg-card relative overflow-hidden">
                                {/* Banner Header */}
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/80 to-primary/40"></div>
                                
                                <div className="relative z-10 flex flex-col items-center text-center pt-8">
                                    {/* Profile Avatar */}
                                    <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 shadow-xl border border-secondary">
                                        <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                            <User className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                    </div>

                                    {/* Name & Title */}
                                    <h2 className="font-bold text-xl text-foreground">{user.name}</h2>
                                    <p className="text-sm text-muted-foreground mb-5">{user.email}</p>

                                    <div className="w-full space-y-4 text-left border-t border-border/60 pt-5">
                                        
                                        {/* Dynamic Profile Progress */}
                                        <div>
                                            <div className="flex justify-between mb-1.5">
                                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Profile Strength</h3>
                                                <span className="text-[11px] font-bold text-primary">{user.profileCompletion}%</span>
                                            </div>
                                            <Progress value={user.profileCompletion} className="h-2 mb-2 bg-secondary" />
                                            {user.profileCompletion < 100 && (
                                                <p className="text-[10px] text-muted-foreground/80 leading-tight">Add your skills and bio to stand out to NGOs!</p>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="pt-2 flex flex-col gap-2.5">
                                            <div className="flex items-center gap-3 text-sm text-foreground/80 bg-secondary/30 p-2.5 rounded-lg border border-border/40">
                                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate text-xs font-medium">{user.city}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-foreground/80 bg-secondary/30 p-2.5 rounded-lg border border-border/40">
                                                <Calendar className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate text-xs font-medium">{user.availability}</span>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            className="w-full mt-3 font-semibold shadow-sm rounded-xl h-10" 
                                            variant="outline"
                                            onClick={() => navigate("/volunteer/edit-profile")}
                                        >
                                            Edit Volunteer Profile
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

export default VolunteerDashboard;