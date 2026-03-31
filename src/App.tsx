import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";
import Opportunities from "./pages/Opportunities";
import About from "./pages/About"; // Imported New Page
import NGOs from "./pages/NGOs";   // Imported New Page
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NGOProfile from "./pages/NGOProfile";
import EditNGOProfile from "./pages/EditNGOProfile";
import EditVolunteerProfile from "./pages/EditVolunteerProfile";
import MissionControl from "./pages/MissionControl";
import CheckIn from "./pages/CheckIn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy"; // Placeholder for Cookie Policy Page
import FAQ from "./pages/FAQ"; // Placeholder for FAQ Page


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Dashboard Routes */}
          <Route
            path="/volunteer/dashboard"
            element={
              <ProtectedRoute allowedRole="volunteer">
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/volunteer/edit-profile"
            element={
              <ProtectedRoute allowedRole="volunteer">
                <EditVolunteerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkin/:code"
            element={
              <ProtectedRoute allowedRole="volunteer">
                <CheckIn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ngo/edit-profile"
            element={
              <ProtectedRoute allowedRole="ngo">
                <EditNGOProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRole="ngo">
                <NGODashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ngo/mission/:id"
            element={
              <ProtectedRoute allowedRole="ngo">
                <MissionControl />
              </ProtectedRoute>
            }
          />

          
          {/* Public Pages */}
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/about" element={<About />} /> {/* NEW ROUTE */}
          <Route path="/ngos" element={<NGOs />} />   {/* NEW ROUTE */}
          <Route path="/ngo/:id" element={<NGOProfile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;