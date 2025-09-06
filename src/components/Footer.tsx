import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = data.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      setSiteSettings(settingsMap);
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const getSetting = (key: string, defaultValue = "") => {
    return siteSettings[key] || defaultValue;
  };

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterLoading(true);
    try {
      // Store newsletter subscription in site_settings with timestamp
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: `newsletter_${Date.now()}`,
          value: newsletterEmail.trim(),
          description: 'Newsletter subscription'
        });

      if (error) throw error;

      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our latest offers and new arrivals.",
      });
      setNewsletterEmail("");
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-brand-gold">
              {getSetting('business_name', 'Hello Crackers')}
            </h3>
            <p className="text-gray-300 mb-4">
              {getSetting('description', 'Direct factory outlet offering premium quality crackers at 90% discount. Supreme Court compliant and safe for family celebrations.')}
            </p>
            <p className="text-sm text-gray-400">
              {getSetting('tagline', 'Premium Diwali Crackers at Factory Prices')}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-orange" />
                <span className="text-sm text-gray-300">
                  {getSetting('address', 'Tamil Nadu, India')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-orange" />
                <div className="text-sm text-gray-300">
                  <div>{getSetting('phone1', '+91 9042132123')}</div>
                  {getSetting('phone2') && <div>{getSetting('phone2')}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-orange" />
                <div className="text-sm text-gray-300">
                  <div>{getSetting('email1', 'Hellocrackers.official@gmail.com')}</div>
                  {getSetting('email2') && <div>{getSetting('email2')}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-orange" />
                <span className="text-sm text-gray-300">
                  {getSetting('business_hours', '9:00 AM - 7:00 PM, Monday to Saturday')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/products" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Products
              </Link>
              <Link to="/price-list" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Price List
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-brand-orange transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Contact
              </Link>
              <Link to="/track-order" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Track Order
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Media */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-3">Stay Updated with Latest Offers</h4>
            <p className="text-gray-300 mb-4">Get notified about new arrivals and exclusive discounts</p>
            <form onSubmit={handleNewsletterSubscription} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange"
                required
              />
              <Button type="submit" variant="festive" className="px-6" disabled={newsletterLoading}>
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            
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