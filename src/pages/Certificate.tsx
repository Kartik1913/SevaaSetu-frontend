import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink, CheckCircle2, Award, Clock, MapPin, Heart, Users, Leaf, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { API_URL } from "@/config/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  certificateId: string;
  volunteerName: string;
  volunteerEmail: string;
  opportunityTitle: string;
  ngoName: string;
  category: string;
  location: string;
  completedDate: string;
  hours: number;
  applicationId: string;
}

const Certificate = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/certificate/my/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Certificate not found");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCertData(data);
      } catch (err) {
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [applicationId, navigate]);

  const handleDownloadPDF = () => {
    // We now use native browser printing because it perfectly handles CSS gradients, High-DPI/Retina, 
    // and preserves vector text natively so the certificate string is actually selectable/OCR-able!
    window.print();
  };

  const handleShareLinkedIn = () => {
    const certUrl = `${window.location.origin}/certificate/verify/${certData?.certificateId}`;
    const text = `I just earned my Certificate of Contribution from SevaaSetu for completing "${certData?.opportunityTitle}"! 🎉\n\nVerify: ${certUrl}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(text)}`;
    window.open(linkedinUrl, "_blank");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
          <p className="text-slate-500 font-medium">Loading your certificate...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <Award className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Certificate Not Found</h2>
          <p className="text-slate-500">{error || "This certificate does not exist"}</p>
          <Button variant="outline" onClick={() => navigate("/volunteer/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const verifyUrl = `${window.location.origin}/certificate/verify/${certData.certificateId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/30">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/volunteer/dashboard")} className="gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                <img src="/logo.png" alt="SevaaSetu" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm text-slate-800 hidden sm:inline">
                Sevaa<span className="text-[#FF9933]">Setu</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="bg-gradient-to-r from-[#FF9933] to-[#FF7700] hover:from-[#FF8822] hover:to-[#FF6600] text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl transition-all px-6 h-11 rounded-xl gap-2"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {downloading ? "Generating PDF..." : "Download as PDF"}
          </Button>
          <Button
            onClick={handleShareLinkedIn}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium px-6 h-11 rounded-xl gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share on LinkedIn
          </Button>
          <Button
            variant="outline"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium px-6 h-11 rounded-xl gap-2"
            onClick={() => {
              navigator.clipboard.writeText(verifyUrl);
              alert("Verification link copied!");
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Copy Verify Link
          </Button>
        </motion.div>

        {/* === THE CERTIFICATE === */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[960px] mx-auto"
        >
          <div
            ref={certificateRef}
            id="certificate-canvas"
            style={{
              width: "960px",
              minHeight: "720px",
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(145deg, #ffffff 0%, #fefcf9 30%, #fffbf5 60%, #ffffff 100%)",
              position: "relative",
              overflow: "hidden",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              boxShadow: "0 25px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)",
              borderRadius: "16px",
            }}
          >
            {/* Tricolor top bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: "linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)",
              }}
            />

            {/* Decorative corner patterns */}
            <svg style={{ position: "absolute", top: 12, left: 12, opacity: 0.06 }} width="120" height="120" viewBox="0 0 120 120">
              <pattern id="corner-pattern-tl" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="1.5" fill="#1a365d" />
              </pattern>
              <rect width="120" height="120" fill="url(#corner-pattern-tl)" />
              <rect x="5" y="5" width="110" height="110" fill="none" stroke="#FF9933" strokeWidth="0.5" rx="8" opacity="0.3" />
            </svg>

            <svg style={{ position: "absolute", top: 12, right: 12, opacity: 0.06 }} width="120" height="120" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="url(#corner-pattern-tl)" />
              <rect x="5" y="5" width="110" height="110" fill="none" stroke="#138808" strokeWidth="0.5" rx="8" opacity="0.3" />
            </svg>

            <svg style={{ position: "absolute", bottom: 12, left: 12, opacity: 0.06 }} width="120" height="120" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="url(#corner-pattern-tl)" />
              <rect x="5" y="5" width="110" height="110" fill="none" stroke="#138808" strokeWidth="0.5" rx="8" opacity="0.3" />
            </svg>

            <svg style={{ position: "absolute", bottom: 12, right: 12, opacity: 0.06 }} width="120" height="120" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="url(#corner-pattern-tl)" />
              <rect x="5" y="5" width="110" height="110" fill="none" stroke="#FF9933" strokeWidth="0.5" rx="8" opacity="0.3" />
            </svg>

            {/* Subtle decorative border */}
            <div
              style={{
                position: "absolute",
                top: "18px",
                left: "18px",
                right: "18px",
                bottom: "18px",
                border: "1.5px solid rgba(255, 153, 51, 0.12)",
                borderRadius: "12px",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                right: "24px",
                bottom: "24px",
                border: "0.5px solid rgba(19, 136, 8, 0.08)",
                borderRadius: "8px",
                pointerEvents: "none",
              }}
            />

            {/* Watermark pattern */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(26, 54, 93, 0.015) 1px, transparent 0)",
                backgroundSize: "32px 32px",
                pointerEvents: "none",
              }}
            />

            {/* Logo Watermark */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
                height: "400px",
                backgroundImage: "url('/logo.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                opacity: 0.05,
                pointerEvents: "none",
              }}
            />

            {/* === CERTIFICATE CONTENT === */}
            <div style={{ position: "relative", zIndex: 10, padding: "48px 64px 40px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
                  <img src="/logo.png" alt="SevaaSetu" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255, 153, 51, 0.2)" }} />
                  <span style={{ fontWeight: 800, fontSize: "18px", color: "#1a365d", letterSpacing: "-0.3px" }}>
                    Sevaa<span style={{ color: "#FF9933" }}>Setu</span>
                  </span>
                </div>

                {/* Title */}
                <h1
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    color: "#1a365d",
                    letterSpacing: "-0.5px",
                    margin: "0 0 4px 0",
                    lineHeight: 1.2,
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}
                >
                  Certificate of Contribution
                </h1>

                {/* Decorative line */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "14px 0 20px" }}>
                  <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #FF9933)" }} />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Heart style={{ width: "12px", height: "12px", color: "#FF9933", opacity: 0.6 }} />
                    <Users style={{ width: "12px", height: "12px", color: "#138808", opacity: 0.6 }} />
                    <Leaf style={{ width: "12px", height: "12px", color: "#FF9933", opacity: 0.6 }} />
                  </div>
                  <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #138808, transparent)" }} />
                </div>
              </div>

              {/* Body */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  This is to certify that
                </p>

                {/* Name */}
                <h2
                  style={{
                    fontSize: "42px",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 6px 0",
                    lineHeight: 1.2,
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {certData.volunteerName}
                </h2>

                {/* Decorative underline */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "200px",
                      height: "3px",
                      background: "linear-gradient(90deg, transparent, #FF9933, #138808, transparent)",
                      borderRadius: "2px",
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    marginBottom: "8px",
                    fontWeight: 400,
                  }}
                >
                  has successfully contributed to
                </p>

                {/* Opportunity */}
                <div
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, rgba(255, 153, 51, 0.08), rgba(19, 136, 8, 0.06))",
                    border: "1px solid rgba(255, 153, 51, 0.15)",
                    borderRadius: "12px",
                    padding: "12px 28px",
                    marginBottom: "6px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#1a365d",
                      margin: 0,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {certData.opportunityTitle}
                  </h3>
                </div>

                {/* NGO Name */}
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    marginTop: "8px",
                  }}
                >
                  organized by{" "}
                  <span style={{ fontWeight: 700, color: "#334155" }}>
                    {certData.ngoName}
                  </span>
                </p>
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "40px",
                  margin: "28px 0 24px",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, rgba(26, 54, 93, 0.03), rgba(255, 153, 51, 0.03))",
                  borderRadius: "12px",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: "4px" }}>
                    Date Completed
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a365d" }}>
                    {formatDate(certData.completedDate)}
                  </p>
                </div>

                <div style={{ width: "1px", background: "rgba(0,0,0,0.08)" }} />

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: "4px" }}>
                    Hours Contributed
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#FF9933" }}>
                    {certData.hours} Hours
                  </p>
                </div>

                <div style={{ width: "1px", background: "rgba(0,0,0,0.08)" }} />

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: "4px" }}>
                    Certificate ID
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#138808", fontFamily: "'Courier New', monospace" }}>
                    {certData.certificateId}
                  </p>
                </div>
              </div>

              {/* Bottom section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: "16px",
                }}
              >
                {/* Signature */}
                <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ height: "65px", display: "flex", alignItems: "flex-end", marginBottom: "0px" }}>
                    <img src="/signature.png" alt="Signature" style={{ maxHeight: "65px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <div
                    style={{
                      width: "140px",
                      borderBottom: "2px solid #1a365d",
                      margin: "0 auto 6px",
                      opacity: 0.3,
                    }}
                  />
                  <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Platform Director</p>
                  <p style={{ fontSize: "10px", color: "#94a3b8" }}>SevaaSetu</p>
                </div>

                {/* Center seal */}
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      border: "2.5px solid rgba(255, 153, 51, 0.3)",
                      margin: "0 auto 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "radial-gradient(circle, rgba(255, 153, 51, 0.06) 0%, transparent 70%)",
                    }}
                  >
                    <Award style={{ width: "28px", height: "28px", color: "#FF9933", opacity: 0.5 }} />
                  </div>
                  <p
                    style={{
                      fontSize: "9px",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "2.5px",
                      fontWeight: 600,
                    }}
                  >
                    Verified
                  </p>
                </div>

                {/* QR Code */}
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      margin: "0 auto 4px",
                      padding: "4px",
                      background: "#fff",
                      borderRadius: "8px",
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <QRCode
                      value={verifyUrl}
                      size={64}
                      style={{ width: "100%", height: "100%" }}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#1a365d"
                    />
                  </div>
                  <p style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 500 }}>Scan to Verify</p>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: "20px", padding: "12px 0 0", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    fontStyle: "italic",
                    letterSpacing: "1.5px",
                    fontWeight: 500,
                  }}
                >
                  "Empowering change through service"
                </p>
              </div>
            </div>

            {/* Bottom tricolor bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: "linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Impact Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-[960px] mx-auto mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF9933]" />
              Contribution Summary
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100/60 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-700">{certData.hours}</p>
                <p className="text-xs text-orange-600/80 font-medium uppercase tracking-wider">Hours</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100/60 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700">1</p>
                <p className="text-xs text-green-600/80 font-medium uppercase tracking-wider">Mission</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/60 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-bold text-blue-700 leading-tight">{certData.location}</p>
                <p className="text-xs text-blue-600/80 font-medium uppercase tracking-wider mt-1">Location</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100/60 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-bold text-purple-700 leading-tight">{certData.category}</p>
                <p className="text-xs text-purple-600/80 font-medium uppercase tracking-wider mt-1">Category</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificate;
