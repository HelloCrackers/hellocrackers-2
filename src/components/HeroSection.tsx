import { Button } from "@/components/ui/button";
import { Clock, Truck, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import familyCelebrationHero from "@/assets/family-celebration-hero.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-brand-gold" />
              <span className="text-sm font-medium">Direct Factory Outlet</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-glow">
              Celebrate with
              <span className="block text-brand-gold">90% OFF</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Premium quality crackers delivered safely to your doorstep
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Truck className="h-5 w-5 text-brand-gold" />
                <span className="text-sm font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Shield className="h-5 w-5 text-brand-gold" />
                <span className="text-sm font-medium">SC Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Clock className="h-5 w-5 text-brand-gold" />
                <span className="text-sm font-medium">Express Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="celebration" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate('/products')}
              >
                Shop Now - 90% OFF
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-brand-red"
                onClick={() => navigate('/price-list')}
              >
                View Price List
              </Button>
            </div>

            {/* Countdown Timer */}
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-sm font-medium mb-2">Limited Time Offer Ends In:</p>
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-gold">15</div>
                  <div className="text-xs">DAYS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-gold">07</div>
                  <div className="text-xs">HOURS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-gold">32</div>
                  <div className="text-xs">MINS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-gold">18</div>
                  <div className="text-xs">SECS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-celebration">
              <img 
                src={familyCelebrationHero} 
                alt="Family celebrating with crackers and fireworks"
                className="w-full h-[500px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-brand-gold text-black px-4 py-2 rounded-full font-bold text-sm animate-bounce">
              90% OFF
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white text-brand-red px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-float">
              Free Delivery
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};