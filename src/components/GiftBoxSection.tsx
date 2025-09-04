import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Heart } from "lucide-react";
import { useSupabase, GiftBox } from "@/hooks/useSupabase";

export const GiftBoxSection = () => {
  const navigate = useNavigate();
  const supabaseHook = useSupabase();
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGiftBoxes();
  }, []);

  const loadGiftBoxes = async () => {
    setLoading(true);
    try {
      const data = await supabaseHook.fetchGiftBoxes();
      setGiftBoxes(data);
    } catch (error) {
      console.error('Error loading gift boxes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading gift boxes...</div>
        </div>
      </section>
    );
  }

  if (giftBoxes.length === 0) {
    return null; // Don't show section if no active gift boxes
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="h-8 w-8 text-brand-orange" />
            <h2 className="text-4xl font-bold bg-gradient-celebration bg-clip-text text-transparent">
              Festival Gift Boxes
            </h2>
            <Gift className="h-8 w-8 text-brand-orange" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated celebration packages with premium crackers at factory prices. 
            Perfect gifts for festivals and special occasions!
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Star className="h-5 w-5 text-brand-gold fill-current" />
            <span className="text-brand-gold font-semibold">90% OFF Factory Prices</span>
            <Star className="h-5 w-5 text-brand-gold fill-current" />
          </div>
        </div>

        {/* Gift Boxes Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {giftBoxes.map((box, index) => (
            <Card key={box.id} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              {/* Badge */}
              {box.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className={`${box.badge_color} font-bold shadow-lg`}>
                    {box.badge}
                  </Badge>
                </div>
              )}

              {/* Heart Icon */}
              <div className="absolute top-4 right-4 z-10">
                <div className="p-2 bg-white/90 rounded-full shadow-lg">
                  <Heart className="h-5 w-5 text-brand-red" />
                </div>
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={box.image_url || '/placeholder.svg'}
                  alt={box.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{box.title}</h3>
                <p className="text-muted-foreground mb-4">{box.description}</p>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-brand-red">₹{box.final_rate.toLocaleString()}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{box.original_price.toLocaleString()}</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {box.discount}% OFF
                  </Badge>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {box.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-brand-gold fill-current flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gradient-festive text-white font-semibold hover:shadow-lg transition-all"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Order This Gift Box
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                  >
                    Customize Your Box
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-brand-red/10 to-brand-orange/10 rounded-2xl p-8 max-w-4xl mx-auto border border-brand-orange/20">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Gift Box?</h3>
            <p className="text-muted-foreground mb-6">
              Create your own personalized celebration package with our expert guidance. 
              Minimum order ₹3,000 for free delivery across Tamil Nadu.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/products')}
                className="bg-gradient-festive text-white"
              >
                Browse All Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};