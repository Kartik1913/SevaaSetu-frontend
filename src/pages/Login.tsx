import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save auth data
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    toast({
      title: "Welcome back!",
      description: "You have been logged in successfully.",
    });

    // Role-based redirect
    navigate(
      data.role === "volunteer"
        ? "/volunteer/dashboard"
        : "/ngo/dashboard"
    );
    } catch (err: any) {
      toast({
      title: "Login failed",
      description: err.message,
      variant: "destructive",
      });
    } finally {
    setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google authentication will be available soon.",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (Original Blue Theme) */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 govt-pattern opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link to="/" className="flex items-center gap-3 mb-8">
            {/* LOGO FIX:
                1. Removed 'p-2' (padding) so no gaps exist.
                2. Use 'object-cover' to fill the circle completely.
                3. Added 'overflow-hidden' to clip the square corners.
            */}
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-xl">
               <img 
                 src="/logo.png" 
                 alt="SevaaSetu" 
                 className="w-full h-full object-cover" 
               />
            </div>
            <span className="font-display font-bold text-3xl text-primary-foreground">
              Sevaa<span className="text-saffron-400">Setu</span>
            </span>
          </Link>
          
          <h1 className="font-display text-4xl font-bold text-primary-foreground text-center mb-4">
            Service Through Connection
          </h1>
          <p className="text-primary-foreground/80 text-center max-w-md">
            Join thousands of volunteers and NGOs working together to create a better India.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
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

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to continue your journey
            </p>
          </div>

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

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-saffron-600 hover:text-saffron-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-saffron-600 hover:text-saffron-700 font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;