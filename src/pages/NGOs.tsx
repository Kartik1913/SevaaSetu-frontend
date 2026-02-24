import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";


const NGOs = () => {
  // Mock Data for NGOs
  // const ngoList = [
  //   { 
  //     id: 1, 
  //     name: "Hope Foundation", 
  //     location: "New Delhi", 
  //     cause: "Child Education", 
  //     image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=60" 
  //   },
  //   { 
  //     id: 2, 
  //     name: "Green Earth Society", 
  //     location: "Bangalore", 
  //     cause: "Environment", 
  //     // NEW IMAGE: High-reliability nature shot (Plant sprout)
  //     image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&auto=format&fit=crop&q=60" 
  //   },
  //   { 
  //     id: 3, 
  //     name: "Animal Rescue League", 
  //     location: "Mumbai", 
  //     cause: "Animal Welfare", 
  //     image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=60" 
  //   },
  //   { 
  //     id: 4, 
  //     name: "Rural Health Mission", 
  //     location: "Pune", 
  //     cause: "Healthcare", 
  //     image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60" 
  //   },
  //   { 
  //     id: 5, 
  //     name: "Women Empowerment Trust", 
  //     location: "Jaipur", 
  //     cause: "Women's Rights", 
  //     image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60" 
  //   },
  //   { 
  //     id: 6, 
  //     name: "Clean City Drive", 
  //     location: "Indore", 
  //     cause: "Sanitation", 
  //     image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=60" 
  //   },
  // ];
  const [ngoList, setNgoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchNGOs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ngo/list`);
      const data = await res.json();
      setNgoList(data);
    } catch (err) {
      console.error("Failed to load NGOs");
    }
    setLoading(false);
  };

  fetchNGOs();
}, []);


  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading NGOs...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header - OPTIMIZED LOAD */}
        <section className="relative py-20 overflow-hidden bg-green-900">
          {/* 1. Background Image (Eager Load) */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1538935732373-f7a495fea3f6?auto=format&fit=crop&q=80")',
            }}
          />
          {/* 2. Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-green-800/80 backdrop-blur-[1px]" />
          
          <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Partner NGOs</h1>
            <p className="text-green-50 text-lg max-w-2xl mb-10 leading-relaxed">
              Discover trusted organizations working tirelessly to transform India. 
              Find a cause close to your heart and contribute.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-xl bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-white/20">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-100" />
                <Input 
                  placeholder="Search NGOs by name or cause..." 
                  className="pl-10 h-12 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-green-200/70" 
                />
              </div>
              <Button className="h-12 px-8 bg-saffron-500 hover:bg-saffron-600 text-white rounded-lg shadow-md transition-all hover:scale-105">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* NGO Grid */}
        <section className="py-16 container mx-auto px-4">

          {ngoList.length === 0 ? (
    <div className="text-center py-20 text-muted-foreground">
      No NGOs found.
    </div>
  ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ngoList.map((ngo) => (
              <div key={ngo._id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-52 overflow-hidden relative bg-slate-100">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                  
                  <div className="h-52 flex items-center justify-center bg-slate-50">
  {ngo.logo ? (
                  
                  <img 
                    src={ngo.logo} 
                    alt={ngo.firstName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback: If Unsplash fails, show a generic nature placeholder
                      e.currentTarget.src = "https://lawbhoomi.com/wp-content/uploads/2020/10/NGO.jpg"
                    }}
                  />
                  ): (
    <div className="w-full h-full  bg-primary flex items-center justify-center text-white text-3xl font-bold">
      {ngo.firstName?.[0]}
    </div>)}
    </div>
                  
                  <div className="absolute top-4 left-4 z-20">
                     <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-green-800 text-xs font-bold uppercase tracking-wide shadow-sm">
                      {ngo.category || "NGO"}
                    </span>
                  </div>

                  {ngo.ngoVerified && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        Verified
                      </span>
                   </div>
                  )}
                </div>


                
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">{ngo.firstName}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-6">
                    <MapPin className="w-4 h-4 mr-1 text-saffron-500" />
                    {ngo.city || "Location not specified"}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 text-slate-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                    onClick={() => navigate(`/ngo/${ngo._id}`)}
                  >
                    View Profile <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NGOs;