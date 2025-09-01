import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CelebrationGallery } from "@/components/CelebrationGallery";
import { TransportSection } from "@/components/TransportSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Minimum Purchase Message */}
      <div className="bg-gradient-to-r from-brand-red to-brand-orange text-white py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium animate-pulse">
            🎆 Minimum Order: ₹3,000 | Free Delivery Across Tamil Nadu | 90% OFF Direct Factory Prices! 🎆
          </p>
        </div>
      </div>
      <HeroSection />
      <CelebrationGallery />
      <TransportSection />
      <Footer />
    </div>
  );
};

export default Index;
