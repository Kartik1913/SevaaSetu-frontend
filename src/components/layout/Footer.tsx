import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Find Opportunities", path: "/opportunities" },
      { name: "Browse NGOs", path: "/ngos" },
      { name: "Register Your NGO", path: "/signup?role=ngo" },
      { name: "Become a Volunteer", path: "/signup?role=volunteer" },
    ],
    resources: [
      { name: "About Us", path: "/about" },
      { name: "How It Works", path: "/#how-it-works" },
      { name: "FAQ", path: "/faq" },
      { name: "Contact", path: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="tricolor-bar" />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-saffron-500">
                <Heart className="w-5 h-5 text-saffron-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-primary-foreground">
                Sevaa<span className="text-saffron-400">Setu</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Connecting intent with impact. A bridge between NGOs and volunteers for a better India.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <a href="mailto:connect@sevaasetu.in" className="flex items-center gap-2 hover:text-saffron-400 transition-colors">
                <Mail className="w-4 h-4" />
                connect@sevaasetu.in
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-saffron-400 transition-colors">
                <Phone className="w-4 h-4" />
                +91 12345 67890
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                New Delhi, India
              </p>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-saffron-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-saffron-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-saffron-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} SevaaSetu. All rights reserved.
            </p>
            <p className="text-sm text-primary-foreground/60 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-saffron-500 fill-saffron-500" /> for Bharat
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;