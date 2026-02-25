import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <h1 className="font-display text-3xl font-bold">
            Terms of Service
          </h1>

          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">1. Acceptance of Terms</h2>
            <p>
              By using SevaaSetu, you agree to comply with these terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">2. User Responsibilities</h2>
            <p>
              Users must provide accurate information and use the platform
              ethically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">3. Platform Rights</h2>
            <p>
              We reserve the right to suspend accounts that violate our
              policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-lg">4. Limitation of Liability</h2>
            <p>
              SevaaSetu acts as a connecting platform and is not responsible
              for off-platform activities.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;