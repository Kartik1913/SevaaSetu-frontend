import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CategoriesSection from "@/components/landing/CategoriesSection";
import FeaturedNGOs from "@/components/landing/FeaturedNGOs";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <CategoriesSection />
        <FeaturedNGOs />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
