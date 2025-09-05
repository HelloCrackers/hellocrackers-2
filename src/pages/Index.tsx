import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CelebrationGallery } from "@/components/CelebrationGallery";
import { TransportSection } from "@/components/TransportSection";
import { GiftBoxSection } from "@/components/GiftBoxSection";
import { Footer } from "@/components/Footer";

import { CategoryNotification } from "@/components/CategoryNotification";
import FeedbackSystem from "@/components/FeedbackSystem";
import { EnhancedCartButton } from "@/components/EnhancedCartButton";

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
      <GiftBoxSection />
      <TransportSection />
      
      {/* Customer Feedback Section */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Customer Feedback</h2>
            <p className="text-muted-foreground">Share your experience and read what others say about Hello Crackers</p>
          </div>
          <FeedbackSystem />
        </div>
      </div>
      
      <Footer />
      <EnhancedCartButton />
    </div>
  );
};

export default Index;
