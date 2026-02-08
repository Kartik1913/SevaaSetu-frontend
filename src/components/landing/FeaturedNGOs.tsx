import { motion } from "framer-motion";
import { Building2, MapPin, Users, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const featuredNGOs = [
  {
    id: 1,
    name: "Pratham Education Foundation",
    category: "Education",
    location: "Mumbai",
    volunteers: 450,
    verified: true,
    description: "Empowering children through quality education since 1995.",
  },
  {
    id: 2,
    name: "Green Earth Initiative",
    category: "Environment",
    location: "Delhi NCR",
    volunteers: 320,
    verified: true,
    description: "Working towards a sustainable and greener India.",
  },
  {
    id: 3,
    name: "Rural Health Mission",
    category: "Health",
    location: "Pan India",
    volunteers: 280,
    verified: true,
    description: "Bringing healthcare to underserved rural communities.",
  },
  {
    id: 4,
    name: "Shakti Foundation",
    category: "Women Empowerment",
    location: "Bangalore",
    volunteers: 190,
    verified: true,
    description: "Empowering women through skill development and education.",
  },
];

const FeaturedNGOs = () => {
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
              key={ngo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="civic-card p-6 bg-card h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-foreground" />
                </div>
                {ngo.verified && (
                  <div className="flex items-center gap-1 text-india-green-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-foreground mb-1">{ngo.name}</h3>
              <span className="badge-saffron text-xs mb-3 w-fit">{ngo.category}</span>
              
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                {ngo.description}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {ngo.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {ngo.volunteers}
                </span>
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