import { motion } from "framer-motion";
import { Building2, Search, Handshake, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Building2,
    step: "01",
    title: "NGOs Enlist",
    description: "Verified NGOs register and post volunteering opportunities with details about skills needed, location, and time commitment.",
  },
  {
    icon: Search,
    step: "02",
    title: "Volunteers Discover",
    description: "Browse opportunities that match your skills, interests, and availability. Filter by cause, location, or time commitment.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Impact Happens",
    description: "Apply to opportunities, get connected with NGOs, and start making a real difference in your community.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="badge-saffron mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            How <span className="text-saffron-500">SevaaSetu</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple three-step process to connect passionate volunteers with organizations making a difference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="civic-card p-8 text-center relative z-10 bg-card h-full">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="absolute top-4 right-4 text-5xl font-display font-bold text-muted/50">
                  {step.step}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;