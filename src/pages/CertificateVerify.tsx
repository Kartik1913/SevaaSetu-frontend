import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Award, Calendar, Building2, Shield, ExternalLink, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";

interface VerifyData {
  valid: boolean;
  volunteerName?: string;
  opportunityTitle?: string;
  ngoName?: string;
  completedDate?: string;
  certificateId?: string;
  message?: string;
}

const CertificateVerify = () => {
  const { certId } = useParams<{ certId: string }>();
  const [data, setData] = useState<VerifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/certificate/verify/${certId}`);
        const json = await res.json();
        setData(json);
      } catch {
        setData({ valid: false, message: "Unable to verify certificate" });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [certId]);

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
          <p className="text-slate-500 font-medium">Verifying certificate...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/20 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
              <img src="/logo.png" alt="SevaaSetu" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-sm text-slate-800">
              Sevaa<span className="text-[#FF9933]">Setu</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Shield className="w-3.5 h-3.5" />
            Certificate Verification
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {data?.valid ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border-2 border-white/30">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h1 className="text-xl font-bold text-white mb-1">Certificate Verified</h1>
                <p className="text-emerald-100 text-sm">This certificate is authentic and valid</p>
              </div>

              {/* Certificate Details */}
              <div className="p-6 space-y-5">
                <div className="text-center pb-4 border-b border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Awarded to</p>
                  <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                    {data.volunteerName}
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mission</p>
                      <p className="text-sm font-semibold text-slate-800">{data.opportunityTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Organization</p>
                      <p className="text-sm font-semibold text-slate-800">{data.ngoName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Completed</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {data.completedDate ? formatDate(data.completedDate) : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="text-center pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Certificate ID</p>
                  <p className="text-sm font-bold text-[#138808] font-mono tracking-wide">
                    {data.certificateId}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-slate-50 to-orange-50/30 border-t border-slate-100 p-4 text-center">
                <p className="text-[10px] text-slate-400 italic tracking-wider">"Empowering change through service"</p>
                <Link to="/" className="inline-flex items-center gap-1 text-xs text-[#FF9933] font-semibold mt-2 hover:underline">
                  Visit SevaaSetu <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
              {/* Error Banner */}
              <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border-2 border-white/30">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white mb-1">Verification Failed</h1>
                <p className="text-red-100 text-sm">This certificate could not be verified</p>
              </div>

              <div className="p-6 text-center space-y-4">
                <p className="text-slate-500 text-sm">
                  {data?.message || "The certificate ID provided is invalid or does not exist in our records."}
                </p>
                <Button variant="outline" asChild>
                  <Link to="/" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Go to SevaaSetu
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateVerify;
