import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Truck, Users, Award, Heart, Star, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import familyCelebration from "@/assets/family-diwali-celebration.jpg";
import helloCrackersLogo from "@/assets/hello-crackers-logo-unique.png";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-brand-orange/10 to-brand-red/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-brand-gold text-black font-bold">
                🎆 Direct Factory Outlet
              </Badge>
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                About <span className="bg-gradient-festive bg-clip-text text-transparent">Hello Crackers</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We are Tamil Nadu's premier direct factory outlet for premium Diwali crackers, 
                offering authentic celebration experiences with 90% OFF and Supreme Court compliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-festive">
                  Shop Now - 90% OFF
                </Button>
                <Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
                  View Products
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={familyCelebration} 
                alt="Hello Crackers family celebration"
                className="w-full h-[400px] object-cover rounded-2xl shadow-celebration"
              />
              <div className="absolute -top-4 -left-4 bg-white rounded-lg p-3 shadow-lg">
                <img 
                  src={helloCrackersLogo} 
                  alt="Hello Crackers Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold text-gray-800">Our Story</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Hello Crackers started as a family business with a simple mission: to bring joy and safe celebrations 
              to every Tamil Nadu family during Diwali. As a direct factory outlet, we eliminate middlemen to offer 
              genuine premium crackers at unbeatable prices with 90% discount.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="p-6 text-center">
                <div className="bg-brand-orange/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold mb-2">Family Business</h3>
                <p className="text-gray-600">Three generations of fireworks expertise serving Tamil Nadu families</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="bg-brand-red/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-brand-red" />
                </div>
                <h3 className="text-xl font-bold mb-2">SC Compliant</h3>
                <p className="text-gray-600">100% Supreme Court compliant products with safety certifications</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="bg-brand-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-brand-gold/80" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Direct factory outlet ensuring authentic quality at 90% OFF</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-brand-purple/5 to-brand-violet/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-royal bg-clip-text text-transparent">
              Why Choose Hello Crackers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with Tamil Nadu's most trusted cracker outlet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-brand-orange/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
              <p className="text-gray-600 text-sm">48-60 hours delivery across Tamil Nadu with transport charges</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-brand-red/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="font-bold text-lg mb-2">SC Certified</h3>
              <p className="text-gray-600 text-sm">Supreme Court compliant with all safety regulations</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-brand-gold/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-brand-gold/80" />
              </div>
              <h3 className="font-bold text-lg mb-2">90% OFF</h3>
              <p className="text-gray-600 text-sm">Direct factory pricing with massive discounts</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-brand-purple/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-brand-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">Family Safe</h3>
              <p className="text-gray-600 text-sm">Products suitable for family, adult, and kids celebrations</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-to-br from-white to-brand-orange/5">
                <h3 className="text-2xl font-bold text-brand-orange mb-4">Safety First</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every product undergoes rigorous safety testing. We prioritize family safety above profits, 
                  ensuring all crackers meet Supreme Court guidelines and safety standards.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-brand-red/5">
                <h3 className="text-2xl font-bold text-brand-red mb-4">Quality Promise</h3>
                <p className="text-gray-600 leading-relaxed">
                  Direct factory sourcing means authentic quality without compromises. We guarantee freshness, 
                  performance, and satisfaction with every purchase.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-brand-gold/5">
                <h3 className="text-2xl font-bold text-brand-gold/80 mb-4">Fair Pricing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our 90% OFF model eliminates middleman profits, passing genuine savings to families. 
                  Premium crackers at factory prices for everyone.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-white to-brand-purple/5">
                <h3 className="text-2xl font-bold text-brand-purple mb-4">Customer Care</h3>
                <p className="text-gray-600 leading-relaxed">
                  From order placement to delivery, we ensure a seamless experience. Real-time tracking, 
                  professional packaging, and responsive support.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🔔 Celebrate Safely, Celebrate Responsibly! 🎉</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              At Hello Crackers, your safety is our top priority. While we bring joy to your celebrations with vibrant fireworks, 
              we also urge everyone to follow essential safety guidelines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Do's */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                ✅ Do's
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Buy only from licensed and reliable sellers like Hello Crackers.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Always light fireworks under adult supervision.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Read and follow the safety instructions printed on each firework label.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Use a long-handled candle or agarbathi to ignite fireworks from a safe distance.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Keep a bucket of water or sand nearby to extinguish accidental fires.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Use aerial fireworks in open areas with a clear and safe landing zone.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Store fireworks in a dry and closed container, away from open flames.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Dispose of used fireworks safely by soaking them in water.
                </li>
              </ul>
            </Card>

            {/* Don'ts */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                <XCircle className="h-6 w-6" />
                ❌ Don'ts
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Do not ignite fireworks while holding them. Place them on the ground and move back before lighting.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Avoid lighting fireworks inside containers or glass bottles.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Never re-light malfunctioning or "dud" fireworks. Wait 15–20 minutes and soak them in water.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Do not use aerial fireworks near trees, wires, or open windows.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Never use fireworks indoors or in congested areas.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Avoid lighting fireworks on public roads or busy throughfares.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Never try to make your own fireworks.
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  Do not use banned, illegal, or spurious fireworks.
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  As per Supreme Court guidelines, avoid bursting fireworks between 10:00 PM and 6:00 AM.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50">
              <h3 className="text-3xl font-bold text-brand-orange mb-4 flex items-center gap-2">
                🔥 Vision Statement
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                "To be the most trusted and joyful destination for high-quality, eco-conscious, and safe fireworks 
                that light up every celebration with happiness, tradition, and responsibility."
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="text-3xl font-bold text-brand-purple mb-4 flex items-center gap-2">
                🎯 Mission Statement
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• To provide a wide range of premium fireworks that are safe, certified, and environmentally friendly.</li>
                <li>• To promote the spirit of celebration by combining innovation with traditional values.</li>
                <li>• To ensure customer satisfaction through transparency, affordability, and quality assurance.</li>
                <li>• To raise awareness about responsible and safe cracker usage among people of all ages.</li>
                <li>• To foster long-term relationships with customers through trust, timely service, and festive spirit.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Commitment */}
      <section className="py-16 bg-gradient-to-r from-brand-gold/10 to-brand-orange/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">🔥 About Hello Crackers</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              At Hello Crackers, we believe every celebration deserves to be vibrant, safe, and memorable. 
              With a strong foundation built on quality, safety, and affordability, we have become one of the 
              most trusted names in the fireworks industry.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              Our journey began with a simple mission: to make high-quality and safe fireworks accessible to 
              everyone at the most reasonable prices. Whether it's Diwali, weddings, birthdays, or any special 
              occasion, Hello Crackers brings joy to your doorstep with a wide range of government-approved, 
              lab-tested, and eco-friendly crackers.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 text-left">
                <h4 className="font-bold text-lg mb-3 text-brand-orange">We are committed to:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Offering top-notch quality fireworks that light up your celebrations.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Ensuring 100% safety compliance in storage, handling, and packaging.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Providing transparent and pocket-friendly pricing without compromising on performance.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Delivering exceptional customer service and timely support for all your cracker needs.
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-festive text-white">
                <h4 className="font-bold text-lg mb-4">Our Promise</h4>
                <p className="text-sm leading-relaxed mb-4">
                  With a growing base of happy customers across India, Hello Crackers stands as a symbol of trust, 
                  tradition, and innovation in the fireworks industry.
                </p>
                <p className="font-bold text-lg">
                  Celebrate responsibly. Celebrate safely. Celebrate with Hello Crackers.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-festive text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Celebrate?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Tamil Nadu families who trust Hello Crackers for their Diwali celebrations
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-white text-brand-red hover:bg-gray-100" onClick={() => navigate('/products')}>
              Shop Now - 90% OFF
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;