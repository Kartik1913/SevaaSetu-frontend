import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Building2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

const Signup = () => {
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const payload = {
      firstName: role === "volunteer" ? firstName : orgName,
      lastName: role === "volunteer" ? lastName : "",
      email,
      password,
      role,
    };

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    toast({
      title: "Account Created!",
      description: `Welcome! You have joined as a ${data.role}.`,
    });

    navigate(
      data.role === "volunteer"
        ? "/volunteer/dashboard"
        : "/ngo/dashboard"
    );
  } catch (err: any) {
    toast({
      title: "Signup failed",
      description: err.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background order-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
              Create an Account
            </h2>
            <p className="text-muted-foreground">
              {role === "volunteer" 
                ? "Join the community and start serving" 
                : "Register your organization to find volunteers"}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-1 bg-secondary/50 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setRole("volunteer")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === "volunteer" 
                  ? "bg-white text-green-700 shadow-sm border border-green-100" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" /> Volunteer
            </button>
            <button
              type="button"
              onClick={() => setRole("ngo")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === "ngo" 
                  ? "bg-white text-green-700 shadow-sm border border-green-100" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-4 h-4" /> NGO / Org
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            
            {role === "volunteer" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="orgName"
                    placeholder="e.g. Hope Foundation"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={role === "ngo" ? "contact@ngo.org" : "name@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-saffron-500 hover:bg-saffron-600 text-white mt-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : role === "volunteer" ? "Sign Up as Volunteer" : "Register NGO"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 hover:text-green-800 font-semibold">
              Log in here
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Branding (Green Theme) */}
      {/* UPDATE: Changed justify-center to justify-start + pt-32 to LOCK logo position */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden order-2 bg-gradient-to-br from-green-700 to-green-900 justify-center items-start pt-32 transition-all duration-500">
        <div className="absolute inset-0 govt-pattern opacity-30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center w-full px-12 text-center">
          <Link to="/" className="flex items-center gap-3 mb-8 hover:scale-105 transition-transform duration-300">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-xl">
               <img src="/logo.png" alt="SevaaSetu" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-3xl text-white">
              Sevaa<span className="text-saffron-400">Setu</span>
            </span>
          </Link>
          
          {/* DYNAMIC TEXT SECTION - No Quotes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg"
            >
              <h1 className="font-display text-4xl font-bold text-white mb-6">
                {role === "volunteer" ? "Join the Movement" : "Amplify Your Impact"}
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                {role === "volunteer" 
                  ? "Connect with NGOs and start making a real impact today."
                  : "Find dedicated volunteers to support your organization's mission."
                }
              </p>
            </motion.div>
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
};

export default Signup;