import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-volunteers.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 govt-pattern opacity-30" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-india-green-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary-foreground/20">
              🇮🇳 Empowering Civic Engagement Across India
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Service Through{" "}
            <span className="text-saffron-400">Connection</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            SevaaSetu bridges the gap between NGOs and passionate volunteers. 
            Discover meaningful opportunities to serve your community and create lasting impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button className="h-12 px-6 bg-saffron-500 hover:bg-saffron-600 text-white" asChild>
              <Link to="/signup?role=volunteer">
                <Users className="w-5 h-5 mr-2" />
                Join as Volunteer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="h-12 px-6 bg-transparent text-white border-white hover:bg-white hover:text-primary" asChild>
              <Link to="/signup?role=ngo">
                <Building2 className="w-5 h-5 mr-2" />
                Register Your NGO
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-primary-foreground/10"
          >
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-saffron-400">500+</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Registered NGOs</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-saffron-400">10K+</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Active Volunteers</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-saffron-400">28</p>
              <p className="text-sm text-primary-foreground/70 mt-1">States Covered</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;