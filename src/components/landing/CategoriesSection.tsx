import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Leaf, 
  HeartPulse, 
  Users2, 
  AlertTriangle, 
  Home 
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: GraduationCap,
    name: "Education",
    count: 120,
    color: "bg-blue-500/10 text-blue-600",
    iconBg: "bg-blue-500",
  },
  {
    icon: Leaf,
    name: "Environment",
    count: 85,
    color: "bg-green-500/10 text-green-600",
    iconBg: "bg-green-500",
  },
  {
    icon: HeartPulse,
    name: "Health",
    count: 95,
    color: "bg-red-500/10 text-red-600",
    iconBg: "bg-red-500",
  },
  {
    icon: Users2,
    name: "Social Welfare",
    count: 110,
    color: "bg-purple-500/10 text-purple-600",
    iconBg: "bg-purple-500",
  },
  {
    icon: AlertTriangle,
    name: "Disaster Relief",
    count: 45,
    color: "bg-orange-500/10 text-orange-600",
    iconBg: "bg-orange-500",
  },
  {
    icon: Home,
    name: "Women Empowerment",
    count: 78,
    color: "bg-pink-500/10 text-pink-600",
    iconBg: "bg-pink-500",
  },
];

const CategoriesSection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge-navy mb-4">Service Categories</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            Find Your <span className="text-saffron-500">Calling</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from diverse causes that resonate with your passion and skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                to={`/opportunities?category=${category.name.toLowerCase().replace(" ", "-")}`}
                className="civic-card p-6 flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300 bg-card h-full"
              >
                <div className={`w-14 h-14 rounded-2xl ${category.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count} opportunities</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;