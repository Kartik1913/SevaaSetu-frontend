import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setIsSent(true);
      toast({
        title: "Email Sent!",
        description: "If an account with that email exists, we have sent a password reset link.",
      });
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
            Service Through Connection
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

          <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <div className="text-left mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Forgot Password
            </h2>
            <p className="text-muted-foreground">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          {isSent ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg">Check your inbox</h3>
              <p className="text-sm">
                We have sent a password reset link to <strong>{email}</strong>. It will expire in 15 minutes.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setIsSent(false)}
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
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
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
