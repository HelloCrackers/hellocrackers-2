import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Heart } from "lucide-react";
import giftBox1000 from "@/assets/gift-box-1000.jpg";
import giftBox3000 from "@/assets/gift-box-3000.jpg";
import giftBox5000 from "@/assets/gift-box-5000.jpg";

export const GiftBoxSection = () => {
  const navigate = useNavigate();

  const giftBoxes = [
    {
      id: 1,
      title: "₹1,000 Gift Box",
      price: 1000,
      originalPrice: 2500,
      image: giftBox1000,
      description: "Perfect starter pack for small celebrations",
      features: ["Family-friendly crackers", "Sparklers included", "Safe for kids", "Free delivery"],
      badge: "Popular",
      badgeColor: "bg-brand-gold text-black"
    },
    {
      id: 2,
      title: "₹3,000 Gift Box",
      price: 3000,
      originalPrice: 7500,
      image: giftBox3000,
      description: "Complete celebration package for the whole family",
      features: ["Premium assorted crackers", "Fancy fireworks", "Ground chakras", "Aerial shots"],
      badge: "Best Value",
      badgeColor: "bg-brand-red text-white"
    },
    {
      id: 3,
      title: "₹5,000 Gift Box",
      price: 5000,
      originalPrice: 12500,
      image: giftBox5000,
      description: "Luxury celebration box for grand festivities",
      features: ["Deluxe cracker collection", "Professional grade", "Sky shots included", "Premium packaging"],
      badge: "Premium",
      badgeColor: "bg-brand-purple text-white"
    }
  ];

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
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${box.badgeColor} font-bold shadow-lg`}>
                  {box.badge}
                </Badge>
              </div>

              {/* Heart Icon */}
              <div className="absolute top-4 right-4 z-10">
                <div className="p-2 bg-white/90 rounded-full shadow-lg">
                  <Heart className="h-5 w-5 text-brand-red" />
                </div>
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={box.image}
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
                  <span className="text-3xl font-bold text-brand-red">₹{box.price.toLocaleString()}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{box.originalPrice.toLocaleString()}</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {Math.round((1 - box.price / box.originalPrice) * 100)}% OFF
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                Contact for Custom Box
              </Button>
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