import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { motion } from "framer-motion";
import { QrCode, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";

export default function CheckIn() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [missionTitle, setMissionTitle] = useState("");

  const handleCheckIn = async () => {
    setStatus("loading");
    setMessage("Verifying your check-in securely...");

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("error");
      setMessage("You must be logged in as a Volunteer to check in.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/application/checkin/${code}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Failed to check in.");
      } else {
        setStatus("success");
        setMessage("Attendance confirmed successfully!");
        setMissionTitle(data.opportunityTitle || "Mission");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Server connection failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-sm w-full text-center relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-saffron-500" />
          
          {status === "idle" && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-saffron-50 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-10 h-10 text-saffron-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Scan Detected</h1>
              <p className="text-slate-500 mb-8 text-sm">
                You are about to securely log your physical presence for this mission.
              </p>
              
              <Button 
                onClick={handleCheckIn}
                className="w-full h-14 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-saffron-500/20"
              >
                Log Attendance Now
              </Button>
            </div>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-saffron-500 rounded-full animate-spin mb-6" />
              <h2 className="text-lg font-bold text-slate-700 animate-pulse">{message}</h2>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-24 h-24 bg-india-green-50 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-india-green-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Verified!</h1>
              <div className="bg-slate-100 p-3 rounded-lg w-full mb-6">
                <p className="text-sm font-semibold text-slate-700 truncate">{missionTitle}</p>
              </div>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Your presence has been securely logged on the NGO's dashboard. You can safely close this screen.
              </p>
              
              <Button 
                onClick={() => navigate("/volunteer/dashboard")}
                variant="outline"
                className="w-full h-12"
              >
                Return to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Check-in Failed</h1>
              <p className="text-slate-600 mb-8 text-sm font-medium">
                {message}
              </p>
              
              <Button 
                onClick={() => setStatus("idle")}
                className="w-full h-12 mb-3 bg-slate-900 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button 
                onClick={() => navigate("/volunteer/dashboard")}
                variant="ghost"
                className="w-full h-lt text-slate-500"
              >
                Go back to Dashboard
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
