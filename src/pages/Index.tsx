import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CelebrationGallery } from "@/components/CelebrationGallery";
import { TransportSection } from "@/components/TransportSection";
import { Footer } from "@/components/Footer";
import { StickyOrderButton } from "@/components/StickyOrderButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Minimum Purchase Message */}
      <div className="bg-gradient-to-r from-brand-red to-brand-orange text-white py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium animate-pulse">
            🎆 Minimum Order: ₹3,000 |குறைந்தபட்சம் ₹3000க்கு ஆர்டர் செய்ய வேண்டும் | Free Delivery Across Tamil Nadu |இலவச டெலிவரி தமிழ்நாடு முழுவதும் | 90% OFF Direct Factory Prices! 90% தள்ளுபடி நேரடி தொழிற்சாலையிலிருந்து🎆
          </p>
        </div>
      </div>
      <HeroSection />
      <CelebrationGallery />
      <TransportSection />
      <Footer />
      <StickyOrderButton />
    </div>
  );
};

export default Index;
