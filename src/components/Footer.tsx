import { Phone, Mail, MapPin, Clock, Shield, Star, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";

export const Footer = () => {
  const { fetchSiteSettings, fetchCategories } = useSupabase();
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const [settingsData, categoriesData] = await Promise.all([
        fetchSiteSettings(),
        fetchCategories()
      ]);

      // Convert settings array to object
      const settingsMap = settingsData.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      setSiteSettings(settingsMap);
      setCategories(categoriesData.filter(cat => cat.status === 'active'));
    } catch (error) {
      console.error('Error loading footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: string = '') => {
    return siteSettings[key] || defaultValue;
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-celebration bg-clip-text text-transparent">
              {getSetting('business_name', 'Hello Crackers')}
            </h3>
            <p className="text-gray-300 mb-4">
              {getSetting('description', 'Direct factory outlet offering premium quality crackers at 90% discount. Supreme Court compliant and safe for family celebrations.')}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-brand-gold" />
              <span className="text-sm">Supreme Court Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-brand-gold" />
              <span className="text-sm">{getSetting('factory_discount', '90')}% OFF Direct Factory Outlet</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-orange">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-300 hover:text-brand-orange transition-colors">Home</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-brand-orange transition-colors">Products</a></li>
              <li><a href="/price-list" className="text-gray-300 hover:text-brand-orange transition-colors">Price List</a></li>
              <li><a href="/track-order" className="text-gray-300 hover:text-brand-orange transition-colors">Track Order</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-brand-orange transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-brand-orange transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-orange">Categories</h4>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <a 
                      href={`/products?filter=${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-gray-300 hover:text-brand-orange transition-colors"
                    >
                      {category.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="/products?filter=family" className="text-gray-300 hover:text-brand-orange transition-colors">Family Crackers</a></li>
                  <li><a href="/products?filter=adult" className="text-gray-300 hover:text-brand-orange transition-colors">Adult Crackers</a></li>
                  <li><a href="/products?filter=kids" className="text-gray-300 hover:text-brand-orange transition-colors">Kids Crackers</a></li>
                  <li><a href="/products?filter=sparklers" className="text-gray-300 hover:text-brand-orange transition-colors">Sparklers</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-orange">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-gold" />
                <span className="text-gray-300">{getSetting('phone1', '+91 98765 43210')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-gold" />
                <span className="text-gray-300">{getSetting('email1', 'info@hellocrackers.com')}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-gold mt-1" />
                <span className="text-gray-300">
                  {getSetting('address', 'Factory Outlet,\nSivakasi, Tamil Nadu\nIndia - 626123').split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < getSetting('address', 'Factory Outlet,\nSivakasi, Tamil Nadu\nIndia - 626123').split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-gold" />
                <span className="text-gray-300">{getSetting('business_hours', '24/7 Customer Support')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Media */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-3">Stay Updated with Latest Offers</h4>
            <p className="text-gray-300 mb-4">Get notified about new arrivals and exclusive discounts</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange"
              />
              <Button variant="festive" className="px-6">
                Subscribe
              </Button>
            </div>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4">
              {getSetting('facebook_url') && (
                <a 
                  href={getSetting('facebook_url')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                >
                  <Facebook className="h-5 w-5 text-white" />
                </a>
              )}
              {getSetting('instagram_url') && (
                <a 
                  href={getSetting('instagram_url')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-colors"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              )}
              {getSetting('youtube_url') && (
                <a 
                  href={getSetting('youtube_url')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <Youtube className="h-5 w-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 {getSetting('business_name', 'Hello Crackers')}. All rights reserved. | Supreme Court Compliant Crackers
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-brand-orange text-sm transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-brand-orange text-sm transition-colors">Terms & Conditions</a>
              <a href="/supreme-court" className="text-gray-400 hover:text-brand-orange text-sm transition-colors">SC Compliance</a>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400 text-sm">Cancellation Charges: 70%</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};