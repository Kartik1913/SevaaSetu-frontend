import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Clock, 
  Filter,
  GraduationCap,
  Leaf,
  HeartPulse,
  Users2,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for opportunities (KEPT YOUR DATA)
const mockOpportunities = [
  {
    id: 1,
    title: "Teaching English to Underprivileged Children",
    ngo: "Pratham Education Foundation",
    category: "Education",
    location: "Mumbai, Maharashtra",
    commitment: "Weekends",
    skills: ["Teaching", "Communication"],
    description: "Help children learn English through interactive sessions. No prior teaching experience required.",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "Tree Plantation Drive Coordinator",
    ngo: "Green Earth Initiative",
    category: "Environment",
    location: "Delhi NCR",
    commitment: "Flexible",
    skills: ["Coordination", "Event Management"],
    description: "Coordinate weekend plantation drives across Delhi NCR region.",
    icon: Leaf,
  },
  {
    id: 3,
    title: "Health Camp Assistant",
    ngo: "Rural Health Mission",
    category: "Health",
    location: "Pune, Maharashtra",
    commitment: "Monthly",
    skills: ["Medical", "First Aid"],
    description: "Assist doctors during free health camps in rural areas around Pune.",
    icon: HeartPulse,
  },
  {
    id: 4,
    title: "Women's Skill Development Trainer",
    ngo: "Shakti Foundation",
    category: "Social Welfare",
    location: "Bangalore, Karnataka",
    commitment: "Weekdays",
    skills: ["Training", "Crafts"],
    description: "Teach vocational skills to women from underprivileged backgrounds.",
    icon: Users2,
  },
  {
    id: 5,
    title: "Digital Literacy Program",
    ngo: "Digital India Foundation",
    category: "Education",
    location: "Hyderabad, Telangana",
    commitment: "Weekends",
    skills: ["Tech", "Teaching"],
    description: "Teach basic computer skills to senior citizens and rural youth.",
    icon: GraduationCap,
  },
  {
    id: 6,
    title: "Clean River Campaign",
    ngo: "Narmada Bachao",
    category: "Environment",
    location: "Ahmedabad, Gujarat",
    commitment: "Monthly",
    skills: ["Physical Work", "Coordination"],
    description: "Join monthly river cleaning drives along the Sabarmati riverfront.",
    icon: Leaf,
  },
];

const categoryColors: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700",
  Environment: "bg-green-100 text-green-700",
  Health: "bg-red-100 text-red-700",
  "Social Welfare": "bg-purple-100 text-purple-700",
};

const Opportunities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.ngo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory;
    const matchesCity = selectedCity === "all" || opp.location.includes(selectedCity);
    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION: Updated to Orange Overlay Style */}
        <section className="relative py-20 overflow-hidden">
          {/* 1. Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80")' }}
          />
          {/* 2. Orange Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/95 to-orange-800/90 backdrop-blur-[2px]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Find Your Opportunity
              </h1>
              <p className="text-orange-50 text-lg max-w-2xl mx-auto">
                Discover volunteering opportunities that match your skills, interests, and availability.
              </p>
            </motion.div>

            {/* Glassy Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-white/20">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-200" />
                  <Input
                    type="text"
                    placeholder="Search opportunities or NGOs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 border-0 bg-transparent text-white placeholder:text-orange-100/70 focus-visible:ring-0"
                  />
                </div>
                <Button className="h-12 px-8 bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-md">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Social Welfare">Social Welfare</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="ml-auto text-sm text-slate-500">
                 Showing <strong>{filteredOpportunities.length}</strong> results
              </div>
            </div>

            {/* Opportunity Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${categoryColors[opportunity.category]} flex items-center justify-center`}>
                        <opportunity.icon className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${categoryColors[opportunity.category]} bg-opacity-20`}>
                        {opportunity.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                      {opportunity.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                      <Building2 className="w-4 h-4 text-orange-400" />
                      {opportunity.ngo}
                    </div>

                    <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                      {opportunity.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-1 bg-slate-100 rounded-md text-slate-600 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        {opportunity.location.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-500" />
                        {opportunity.commitment}
                      </span>
                    </div>

                    <Button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white shadow-md shadow-orange-100">
                      Apply Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No opportunities found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedCity("all");
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Opportunities;