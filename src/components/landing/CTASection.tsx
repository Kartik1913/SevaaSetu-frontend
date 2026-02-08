import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image & Overlay - Matching the Home Hero Style */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80")' }}
      />
      <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-[2px]" />
      <div className="absolute inset-0 govt-pattern opacity-10" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          India Needs You.
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Don't wait for change. Be the change. <br/>
          Join India's largest network of volunteers and changemakers today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-14 px-8 text-lg bg-saffron-500 hover:bg-saffron-600 text-white shadow-lg shadow-blue-900/20" asChild>
            <Link to="/signup">
              Start Volunteering <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-blue-900 bg-transparent" asChild>
            <Link to="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;