import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CelebrationGallery } from "@/components/CelebrationGallery";
import { TransportSection } from "@/components/TransportSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CelebrationGallery />
      <TransportSection />
      <Footer />
    </div>
  );
};

export default Index;
