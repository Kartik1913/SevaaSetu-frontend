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
import ProtectedRoute from "./components/auth/ProtectedRoute";


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
  path="/ngo/dashboard"
  element={
    <ProtectedRoute allowedRole="ngo">
      <NGODashboard />
    </ProtectedRoute>
  }
/>

          
          {/* Public Pages */}
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/about" element={<About />} /> {/* NEW ROUTE */}
          <Route path="/ngos" element={<NGOs />} />   {/* NEW ROUTE */}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;