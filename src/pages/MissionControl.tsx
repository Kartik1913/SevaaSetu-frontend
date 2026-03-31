import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Play, 
  Square,
  RefreshCw,
  Share2,
  Edit,
  ShieldCheck,
  Building2,
  XCircle,
  EyeOff,
  AlertCircle,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import QRCode from "react-qr-code";

type TabType = "pending" | "accepted" | "completed" | "absent";

export default function MissionControl() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const openEditModal = () => {
      setEditData({
          title: mission.title || "",
          description: mission.description || "",
          location: mission.location || "",
          commitment: mission.commitment || "",
          dateTime: mission.onboarding?.dateTime || "",
          contactPerson: mission.onboarding?.contactPerson || "",
          instructions: mission.onboarding?.instructions || "",
      });
      setShowEditModal(true);
  };

  const saveMissionChanges = async () => {
      const token = localStorage.getItem("token");
      try {
          // Re-nest onboarding details to match schema
          const payload = {
              title: editData.title,
              description: editData.description,
              location: editData.location,
              commitment: editData.commitment,
              onboarding: {
                  ...mission.onboarding,
                  dateTime: editData.dateTime,
                  contactPerson: editData.contactPerson,
                  instructions: editData.instructions
              }
          };

          const res = await fetch(`${API_URL}/api/opportunity/edit/${id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error("Update failed");
          
          const updatedMission = await res.json();
          setMission(updatedMission);
          setShowEditModal(false);
          toast.success("Mission successfully updated!");
      } catch (err) {
          toast.error("Could not update mission details.");
      }
  };

  const fetchMissionData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch Mission Details
      const missionRes = await fetch(`${API_URL}/api/opportunity/mission/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!missionRes.ok) throw new Error("Failed to load mission");
      const missionData = await missionRes.json();
      
      // Fetch Applications
      const appRes = await fetch(`${API_URL}/api/application/ngo/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!appRes.ok) throw new Error("Failed to load applicants");
      const appData = await appRes.json();
      
      setMission(missionData);
      setApplications(appData);
    } catch (err) {
      toast.error("Error loading mission control");
      navigate("/ngo/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionData();
  }, [id, navigate]);

  const handleCheckInAction = async (action: "start" | "stop" | "regenerate" | "end") => {
    // Add confirmation if ending mission
    if (action === "end") {
        if (!window.confirm("Are you sure? Ending the mission will lock attendance and mark all pending/absent volunteers. This cannot be undone.")) {
            return;
        }
    }
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/opportunity/mission/${id}/checkin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      
      if (!res.ok) throw new Error("Check-in action failed");
      
      const updatedMission = await res.json();
      setMission(updatedMission);
      toast.success(action === "start" ? "Check-in Started!" : action === "end" ? "Mission Ended & Locked" : action === "stop" ? "Check-in Stopped" : "New QR Generated");
      if (action === "end") {
          fetchMissionData(); // Refresh the list of volunteers to get updated absent statuses
      }
    } catch (err) {
      toast.error("Could not update check-in status");
    }
  };

  const handleApplicationStatus = async (appId: string, status: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/application/status/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Applicant marked as ${status}`);
      fetchMissionData(); // Refresh lists
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  if (loading || !mission) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingCount = applications.filter(a => a.status === "pending").length;
  const acceptedCount = applications.filter(a => a.status === "accepted").length;
  const completedCount = applications.filter(a => a.status === "completed").length;
  const absentCount = applications.filter(a => a.status === "absent").length;

  // Filter current tab applications
  const currentTabApps = applications.filter(a => a.status === activeTab);

  // Generate QR value (e.g. a link to scan)
  const qrValue = `${window.location.origin}/checkin/${mission.checkInCode}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Security Indicator Bar (Appears when active) */}
      <AnimatePresence>
        {mission.checkInActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-india-green-600 text-white py-2 text-center flex items-center justify-center gap-2 font-medium tracking-wide text-sm shadow-md z-10"
          >
            <ShieldCheck className="w-5 h-5" /> 
            Live Security Check-in Active
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow py-8 max-w-7xl mx-auto px-4 w-full">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate("/ngo/dashboard")}
          className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        {/* 1. MISSION OVERVIEW (TOP) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="h-4 w-full bg-saffron-500"></div>
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">{mission.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 font-medium">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><Building2 className="w-4 h-4 text-saffron-500" /> Managed by You</span>
                            {mission.onboarding?.dateTime && (
                                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><MapPin className="w-4 h-4 text-saffron-500" /> {new Date(mission.onboarding.dateTime).toLocaleDateString()} • {new Date(mission.onboarding.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            )}
                            <span className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 bg-slate-100 px-3 py-1 rounded-full transition"><MapPin className="w-4 h-4 text-saffron-500" /> Open in Maps</span>
                        </div>
                    </div>
                    {/* 4. QUICK ACTIONS */}
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="h-11"
                            onClick={() => {
                                const url = `${window.location.origin}/opportunity/${mission._id}`;
                                navigator.clipboard.writeText(url);
                                toast.success("Mission link copied to clipboard!");
                            }}
                        >
                            <Share2 className="w-4 h-4 mr-2 text-muted-foreground"/> Share
                        </Button>
                        <Button variant="outline" className="h-11" onClick={openEditModal}>
                            <Edit className="w-4 h-4 mr-2 text-muted-foreground"/> Edit Mission
                        </Button>
                    </div>
                </div>

                {/* Real-time Stat Pills */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                        <span className="text-3xl font-bold text-slate-700">{applications.length}</span>
                        <span className="text-xs uppercase tracking-wider font-bold text-slate-500 mt-1">Total Applied</span>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-blue-100">
                        <span className="text-3xl font-bold text-blue-700">{acceptedCount}</span>
                        <span className="text-xs uppercase tracking-wider font-bold text-blue-500 mt-1">Accepted</span>
                    </div>
                    <div className="bg-india-green-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-india-green-100">
                        <span className="text-3xl font-bold text-india-green-700">{completedCount}</span>
                        <span className="text-xs uppercase tracking-wider font-bold text-india-green-500 mt-1">Completed</span>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-red-100">
                        <span className="text-3xl font-bold text-red-700">{absentCount}</span>
                        <span className="text-xs uppercase tracking-wider font-bold text-red-500 mt-1">Absent</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: 2. CHECK-IN CONTROL PANEL */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
                    <div className="p-6 text-center border-b border-slate-100">
                         <h2 className="font-bold text-lg text-slate-900 mb-1">Check-in Terminal</h2>
                         <p className="text-xs text-slate-500">Scan QR to log presence</p>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center min-h-[320px] bg-slate-50">
                        {mission.isActive === false ? (
                            <div className="text-center space-y-4 w-full">
                                <div className="w-24 h-24 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="font-bold text-red-700 text-xl tracking-wide">Mission Officially Ended</h3>
                                <p className="text-sm text-slate-500 font-medium pb-2">All attendance records have been securely locked.</p>
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-left text-xs text-red-800 leading-relaxed shadow-sm">
                                    <strong>Administration Locked:</strong> You can no longer modify physical attendance for this event. 
                                </div>
                            </div>
                        ) : !mission.checkInActive ? (
                            <div className="text-center space-y-6 w-full">
                                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto flex items-center justify-center">
                                    <EyeOff className="w-10 h-10 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-700 mb-2">Check-in is currently offline</h3>
                                    <p className="text-sm text-slate-500 mb-6">Start the check-in terminal to generate a live QR code for volunteers.</p>
                                </div>
                                <Button 
                                    size="lg" 
                                    className="w-full bg-india-green-600 hover:bg-india-green-700 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-india-green-600/20"
                                    onClick={() => handleCheckInAction("start")}
                                >
                                    <Play className="w-5 h-5 mr-2" fill="currentColor"/> Start Check-in
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full h-12 rounded-xl font-bold mt-3 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleCheckInAction("end")}
                                >
                                    <XCircle className="w-4 h-4 mr-2" /> End Mission & Lock Attendance
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center w-full">
                                <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 inline-block mb-6 relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-india-green-400 to-emerald-400 rounded-2xl blur opacity-20 -z-10 animate-pulse"></div>
                                    <QRCode value={qrValue} size={200} />
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    <span className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-india-green-500"></span>
                                    </span>
                                    <h3 className="font-bold text-india-green-700 tracking-wide">STATUS: LIVE</h3>
                                </div>

                                <div className="space-y-3">
                                    <Button 
                                        variant="outline"
                                        className="w-full h-12 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-100 font-medium"
                                        onClick={() => handleCheckInAction("regenerate")}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" /> Regenerate QR Code
                                    </Button>
                                    <Button 
                                        variant="destructive"
                                        className="w-full h-12 rounded-xl font-bold shadow-sm"
                                        onClick={() => handleCheckInAction("stop")}
                                    >
                                        <Square className="w-4 h-4 mr-2" fill="currentColor"/> Stop Check-in
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        className="w-full h-12 rounded-xl font-bold mt-2 text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleCheckInAction("end")}
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" /> End Mission & Lock
                                    </Button>
                                    
                                    {/* 5. REAL-TIME FEEDBACK */}
                                    <div className="mt-6 pt-6 border-t border-slate-200">
                                        <div className="flex justify-between text-sm mb-2 font-medium">
                                            <span className="text-slate-600">Live Turnout</span>
                                            <span className="text-slate-900">{completedCount} / {acceptedCount} Checked In</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="bg-india-green-500 h-2.5 rounded-full transition-all duration-1000" 
                                                style={{ width: `${acceptedCount > 0 ? (completedCount / acceptedCount) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: 3. VOLUNTEER LIST TABS */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Custom Tabs Navigation */}
                <div className="bg-slate-200 p-1.5 rounded-2xl flex max-w-full overflow-x-auto no-scrollbar">
                    {(["pending", "accepted", "completed", "absent"] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[100px] text-sm font-semibold capitalize py-3 px-4 rounded-xl transition-all duration-300 ${
                                activeTab === tab 
                                ? "bg-white text-slate-900 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            }`}
                        >
                            {tab}
                            <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                                {applications.filter(a => a.status === tab).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab Content List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 min-h-[500px]">
                    {currentTabApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 space-y-4">
                            <Users className="w-12 h-12 opacity-20" />
                            <p>No volunteers currently {activeTab}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {currentTabApps.map((app) => (
                                <div key={app._id} className="p-4 hover:bg-slate-50 transition rounded-xl flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-100 to-orange-100 flex items-center justify-center text-saffron-700 font-bold text-lg border border-saffron-200">
                                            {app.volunteer?.firstName?.[0] || "?"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{app.volunteer?.firstName || "Unknown User"}</h4>
                                            <p className="text-sm text-slate-500">{app.volunteer?.email || "No email provided"}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons based on state */}
                                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        
                                        {activeTab === "pending" && (
                                            <>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={() => handleApplicationStatus(app._id, "rejected")}>Reject</Button>
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => handleApplicationStatus(app._id, "accepted")}>Accept Volunteer</Button>
                                            </>
                                        )}

                                        {activeTab === "accepted" && (
                                            <>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={() => handleApplicationStatus(app._id, "absent")}>
                                                    <XCircle className="w-4 h-4 mr-1.5"/> Mark Absent
                                                </Button>
                                                <Button size="sm" className="bg-india-green-600 hover:bg-india-green-700 text-white shadow-sm" onClick={() => handleApplicationStatus(app._id, "completed")}>
                                                    <CheckCircle2 className="w-4 h-4 mr-1.5"/> Manually Complete
                                                </Button>
                                            </>
                                        )}

                                        {activeTab === "completed" && (
                                            <span className="flex items-center text-sm font-bold text-india-green-600 bg-india-green-50 px-3 py-1.5 rounded-full border border-india-green-200">
                                                <CheckCircle2 className="w-4 h-4 mr-1.5"/> Verified
                                            </span>
                                        )}

                                        {activeTab === "absent" && (
                                            <span className="flex items-center text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                                                <XCircle className="w-4 h-4 mr-1.5"/> Did not attend
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
      </main>

      {/* Edit Mission Modal Overlay */}
      <AnimatePresence>
          {showEditModal && editData && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
              >
                  <motion.div 
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8"
                  >
                      {/* Modal Header */}
                      <div className="bg-slate-50 p-5 font-bold flex justify-between items-center border-b border-slate-200">
                          <h2 className="text-xl text-slate-900">Edit Mission Details</h2>
                          <button onClick={() => setShowEditModal(false)} className="p-2 bg-white rounded-full hover:bg-slate-200 transition">
                              <X className="w-5 h-5 text-slate-500" />
                          </button>
                      </div>

                      {/* Form Body */}
                      <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Mission Title</label>
                              <input 
                                  value={editData.title} 
                                  onChange={e => setEditData({...editData, title: e.target.value})} 
                                  className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                              />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
                                  <input 
                                      value={editData.location} 
                                      onChange={e => setEditData({...editData, location: e.target.value})} 
                                      className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Time Commitment</label>
                                  <input 
                                      value={editData.commitment} 
                                      onChange={e => setEditData({...editData, commitment: e.target.value})} 
                                      placeholder="e.g. 4 hours/week"
                                      className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                                  />
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Date & Time</label>
                                  <input 
                                      type="datetime-local"
                                      value={editData.dateTime ? new Date(new Date(editData.dateTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''}
                                      onChange={e => setEditData({...editData, dateTime: e.target.value})} 
                                      className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Contact Person</label>
                                  <input 
                                      value={editData.contactPerson} 
                                      onChange={e => setEditData({...editData, contactPerson: e.target.value})} 
                                      className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">About this Mission</label>
                              <textarea 
                                  value={editData.description} 
                                  onChange={e => setEditData({...editData, description: e.target.value})} 
                                  rows={4}
                                  className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                              />
                          </div>

                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Special Instructions (Optional)</label>
                              <textarea 
                                  value={editData.instructions} 
                                  onChange={e => setEditData({...editData, instructions: e.target.value})} 
                                  rows={3}
                                  placeholder="e.g. Wear comfortable shoes..."
                                  className="w-full border-slate-200 rounded-lg p-3 text-sm focus:ring-saffron-500 focus:border-saffron-500 bg-slate-50 hover:bg-white transition"
                              />
                          </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="bg-slate-50 p-5 border-t border-slate-200 flex justify-end gap-3">
                          <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
                          <Button className="bg-saffron-500 hover:bg-saffron-600 font-bold" onClick={saveMissionChanges}>
                              <Save className="w-4 h-4 mr-2" /> Save Changes
                          </Button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
