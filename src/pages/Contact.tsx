import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  Truck,
  Shield,
  Star,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";
import FeedbackSystem from "@/components/FeedbackSystem";
import Map from "@/components/Map";
import SupremeCourtNotice from "@/components/SupremeCourtNotice";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      primary: "+91 9042132123",
      secondary: "+91 9629088412",
      color: "bg-brand-orange"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      primary: "Hellocrackers.official@gmail.com",
      secondary: "orders@hellocrackers.com",
      color: "bg-brand-purple"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Store Location",
      primary: "Tamil Nadu, India",
      secondary: "Multiple outlet locations",
      color: "bg-brand-gold"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      primary: "9:00 AM - 7:00 PM",
      secondary: "Monday to Saturday",
      color: "bg-brand-red"
    }
  ];

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Delivery",
      description: "48-60 hours delivery across Tamil Nadu"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "SC Compliant",
      description: "100% Supreme Court compliant crackers"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Premium Quality",
      description: "Direct factory outlet with 90% discount"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-festive bg-clip-text text-transparent">
            Contact Hello Crackers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for orders, support, or any questions about our premium Diwali crackers
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`${info.color} text-white rounded-full p-3 w-fit mx-auto mb-4`}>
                {info.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
              <div className="space-y-1">
                <div className="text-gray-800 font-medium">{info.primary}</div>
                <div className="text-gray-600 text-sm">{info.secondary}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about your requirements, questions, or feedback..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-festive text-white hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* WhatsApp Support */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-600 text-white rounded-full p-3">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800">WhatsApp Support</h3>
                  <p className="text-green-700">Get instant help on WhatsApp</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Why Choose Hello Crackers?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-brand-orange mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Store Locator */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Visit Our Store</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand-red" />
                  <span className="text-gray-700">Multiple locations across Tamil Nadu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand-orange" />
                  <span className="text-gray-700">Open 9 AM - 7 PM, Mon-Sat</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <MapPin className="h-4 w-4 mr-2" />
                Find Nearest Store
              </Button>
            </Card>

            {/* Special Offers */}
            <Card className="p-6 bg-gradient-to-r from-brand-orange/10 to-brand-red/10 border-2 border-brand-orange/20">
              <div className="text-center">
                <Badge className="bg-brand-red text-white mb-3 text-lg px-4 py-2">
                  🎆 Special Offer
                </Badge>
                <h3 className="text-xl font-bold mb-2">90% OFF Diwali Sale</h3>
                <p className="text-gray-700 mb-4">
                  Direct factory outlet prices on all premium crackers
                </p>
                <Button className="bg-gradient-festive text-white">
                  Shop Now
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Social Media Links */}
        <Card className="mt-12 p-6">
          <h3 className="text-2xl font-bold text-center mb-6">Follow Us on Social Media</h3>
          <div className="flex justify-center gap-6">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-pink-500 text-pink-600 hover:bg-pink-50"
              onClick={() => window.open('https://instagram.com/Hello_Crackers', '_blank')}
            >
              <Instagram className="h-5 w-5" />
              Instagram
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://facebook.com/Hello_Crackers', '_blank')}
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => window.open('https://youtube.com/Hello_Crackers', '_blank')}
            >
              <Youtube className="h-5 w-5" />
              YouTube
            </Button>
          </div>
        </Card>

        {/* Supreme Court Notice */}
        <div className="mt-12">
          <SupremeCourtNotice />
        </div>

        {/* Map Section */}
        <Card className="mt-12 p-6">
          <h3 className="text-2xl font-bold text-center mb-6">Our Store Location</h3>
          <Map />
        </Card>

        {/* Customer Feedback */}
        <div className="mt-12">
          <FeedbackSystem />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;