import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too weak",
        description: "Your new password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resetpassword/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password. The link may have expired.");
      }

      setIsSuccess(true);
      toast({
        title: "Success",
        description: "Your password has been successfully reset.",
      });
      
      // Navigate to login after 3 seconds automatically
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err: any) {
      toast({
        title: "Reset failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 govt-pattern opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-xl">
               <img src="/logo.png" alt="SevaaSetu" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-3xl text-primary-foreground">
              Sevaa<span className="text-saffron-400">Setu</span>
            </span>
          </Link>
          <h1 className="font-display text-4xl font-bold text-primary-foreground text-center mb-4">
            Security & Trust
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
               <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                 <img src="/logo.png" alt="SevaaSetu" className="w-full h-full object-cover" />
               </div>
              <span className="font-display font-bold text-xl text-foreground">
                Sevaa<span className="text-saffron-500">Setu</span>
              </span>
            </Link>
          </div>

          <div className="text-left mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Create New Password
            </h2>
            <p className="text-muted-foreground">
              Enter your new password below. Make sure it's secure!
            </p>
          </div>

          {isSuccess ? (
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg">Password Changed</h3>
              <p className="text-sm">
                Your password has been successfully reset. You will be redirected to the login page momentarily.
              </p>
              <Button 
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/login")}
              >
                Go to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11"
                    min="6"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11"
                    min="6"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-saffron-500 hover:bg-saffron-600 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
