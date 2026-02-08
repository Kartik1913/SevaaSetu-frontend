import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Shield, Users, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - OPTIMIZED BG LOAD */}
        <section className="relative py-24 overflow-hidden flex items-center justify-center bg-green-900">
           {/* 1. Background Image (Optimized) */}
           <div 
            className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80")',
            }}
          />
          {/* 2. Green Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/80 backdrop-blur-[1px]" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-8">
              Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed font-light">
              "To bridge the gap between intent and action by connecting passionate volunteers with trusted NGOs across India."
            </p>
          </div>
        </section>

        {/* The Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                 <span className="text-saffron-600 font-bold tracking-wider uppercase text-sm">Our Story</span>
                 <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                    Why SevaaSetu?
                 </h2>
              </div>
              
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed border-l-4 border-green-200 pl-6 md:pl-10">
                <p>
                  India has over 3 million registered NGOs and millions of citizens willing to help. Yet, a massive gap exists. NGOs struggle to find dedicated volunteers, and individuals often don't know where to start.
                </p>
                <p>
                  <strong className="text-green-700">SevaaSetu</strong> (Service Bridge) was built to solve this. We use technology to verify, match, and connect these two vital groups, creating a seamless ecosystem of service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="py-20 bg-slate-50 border-t border-slate-200 relative">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: "Seva (Service)", text: "Service above self is our guiding principle.", color: "text-saffron-500", bg: "bg-orange-50" },
                { icon: Shield, title: "Trust", text: "We strictly verify every NGO and volunteer.", color: "text-green-600", bg: "bg-green-50" },
                { icon: Users, title: "Community", text: "Building strong local networks of changemakers.", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Globe, title: "Impact", text: "Focusing on measurable, real-world change.", color: "text-purple-600", bg: "bg-purple-50" }
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 mx-auto ${item.bg} rounded-full flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white border-t border-slate-200 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to make a difference?</h2>
            <p className="text-slate-600 mb-10 max-w-xl mx-auto">Join thousands of others who are already serving their communities through SevaaSetu.</p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg bg-saffron-500 hover:bg-saffron-600 text-white shadow-lg shadow-orange-200 rounded-full" asChild>
                <Link to="/signup">Join Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;