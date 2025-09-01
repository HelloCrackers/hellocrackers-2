import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Shield, Phone } from "lucide-react";
import helloCrackersTruck from "@/assets/hello-crackers-transport-branded.jpg";

export const TransportSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-orange/5 to-brand-red/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-festive bg-clip-text text-transparent">
            Free Transport Delivery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We deliver your crackers safely to your location with our premium Tamil Nadu logistics service
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Transport Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-celebration">
              <img 
                src={helloCrackersTruck} 
                alt="Hello Crackers Tamil Nadu logistics truck"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-brand-gold text-black font-bold text-sm px-3 py-2">
                  Tamil Nadu Model
                </Badge>
              </div>
              
              {/* Free Delivery Badge */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-orange" />
                  <span className="font-bold text-brand-red">FREE DELIVERY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transport Features */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 border-l-4 border-l-brand-orange hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand-orange/10 rounded-full p-2">
                    <Truck className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Free Delivery</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  No delivery charges on all orders. We bring your crackers to your doorstep at no extra cost.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-brand-red hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand-red/10 rounded-full p-2">
                    <MapPin className="h-5 w-5 text-brand-red" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Tamil Nadu Wide</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete coverage across Tamil Nadu with our dedicated logistics network.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-brand-gold hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand-gold/10 rounded-full p-2">
                    <Clock className="h-5 w-5 text-brand-gold/80" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
                </div>
                 <p className="text-gray-600 text-sm">
                   Express delivery within 48-60 hours to ensure fresh crackers for your celebration.
                 </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-brand-purple hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand-purple/10 rounded-full p-2">
                    <Shield className="h-5 w-5 text-brand-purple" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Safe Transport</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Special safety protocols for transporting crackers with proper handling and care.
                </p>
              </Card>
            </div>

            {/* Delivery Information */}
            <Card className="p-6 bg-gradient-to-r from-brand-orange/5 to-brand-red/5 border-brand-orange">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Delivery Information</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <Clock className="h-4 w-4 text-brand-orange" />
                   <span className="text-gray-700"><strong>Delivery Time:</strong> 48-60 hours - you will get the parcel at your location</span>
                 </div>
                 <div className="bg-brand-red/10 p-3 rounded-lg mt-3">
                   <p className="text-brand-red font-semibold">📦 Transport charges apply - 48-60 hours delivery guaranteed</p>
                 </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-brand-red" />
                  <span className="text-gray-700"><strong>Coverage:</strong> All districts in Tamil Nadu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-brand-purple" />
                  <span className="text-gray-700"><strong>Safety:</strong> Special cracker transport protocols</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-brand-gold/80" />
                  <span className="text-gray-700"><strong>Track Order:</strong> Real-time tracking available</span>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="text-center">
              <button className="bg-gradient-festive text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg">
                Track Your Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};