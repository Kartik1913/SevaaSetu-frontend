import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";

const FeaturedNGOs = () => {
  const [featuredNGOs, setFeaturedNGOs] = useState<any[]>([]);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ngo/list`);
        if (!res.ok) throw new Error("Failed to fetch NGOs");
        const data = await res.json();
        
        // Prioritize verified NGOs, fallback to newest
        const sorted = data.sort((a: any, b: any) => {
           if (a.ngoVerified && !b.ngoVerified) return -1;
           if (!a.ngoVerified && b.ngoVerified) return 1;
           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setFeaturedNGOs(sorted.slice(0, 4));
      } catch (err) {
        console.error("Error loading featured NGOs", err);
      }
    };
    fetchNGOs();
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge-green mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Verified Partners
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            Featured <span className="text-saffron-500">NGOs</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partner with verified organizations making a real difference across India.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredNGOs.map((ngo, index) => (
            <motion.div
              key={ngo._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="civic-card p-6 bg-card h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  {ngo.logo ? (
                     <img src={ngo.logo} alt={ngo.firstName} className="w-full h-full object-cover" />
                  ) : (
                     <Building2 className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                {ngo.ngoVerified && (
                  <div className="flex items-center gap-1 text-india-green-500 bg-india-green-50 px-2 py-1 rounded-full border border-india-green-200">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-foreground mb-1">{ngo.firstName}</h3>
              <span className="badge-saffron text-xs mb-3 w-fit">{ngo.category || "Civic Action"}</span>
              
              <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                {ngo.description || "Partnering with verified organizations making a real difference across local communities."}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  {ngo.city || "Pan India"}
                </span>
                <Button variant="ghost" size="sm" asChild className="h-8 text-saffron-600 hover:text-saffron-700 hover:bg-saffron-50 px-2 -mr-2">
                  <Link to={`/ngo/${ngo._id}`}>Preview Profile</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/ngos">
              View All NGOs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNGOs;