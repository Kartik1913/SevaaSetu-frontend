import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Settings, BarChart3 } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">

          {/* Header */}
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Learn how we use cookies to improve your experience.
            </p>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-3 gap-8">

            <div className="civic-card p-6 bg-card text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-saffron-100 mx-auto flex items-center justify-center">
                <Shield className="text-saffron-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold">Essential Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Required for login, security, and core platform functionality.
              </p>
            </div>

            <div className="civic-card p-6 bg-card text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 mx-auto flex items-center justify-center">
                <BarChart3 className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold">Analytics Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Help us understand user behavior and improve our services.
              </p>
            </div>

            <div className="civic-card p-6 bg-card text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 mx-auto flex items-center justify-center">
                <Settings className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold">Preference Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Remember your preferences and settings for better experience.
              </p>
            </div>
          </div>

          {/* Extra Text */}
          <div className="space-y-6 text-sm text-muted-foreground">
            <h2 className="font-semibold text-lg text-foreground">
              Managing Cookies
            </h2>
            <p>
              You can disable cookies through your browser settings. However,
              some features of SevaaSetu may not function properly.
            </p>

            <h2 className="font-semibold text-lg text-foreground">
              Updates
            </h2>
            <p>
              We may update this Cookie Policy occasionally. Continued use of
              our platform indicates acceptance of changes.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;