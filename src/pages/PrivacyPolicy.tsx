import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <h1 className="font-display text-3xl font-bold">
            Privacy Policy
          </h1>

          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">1. Information We Collect</h2>
            <p>
              We collect personal information such as name, email, city, and
              profile details when users register on SevaaSetu.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">2. How We Use Information</h2>
            <p>
              Information is used to connect volunteers with NGOs, improve our
              services, and ensure platform security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">3. Data Protection</h2>
            <p>
              We implement security measures to protect your data. However, no
              online system is completely secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">4. Contact Us</h2>
            <p>
              If you have questions regarding this policy, contact us at:
              support@sevaasetu.in
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;