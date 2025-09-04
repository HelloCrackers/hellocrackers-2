import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Edit, Home, Truck, Clock, MapPin, Shield, Star } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

interface HomepageSection {
  id: string;
  section_name: string;
  content: any;
}

export const HomepageContentManager = () => {
  const { supabase } = useSupabase();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Form states for different sections
  const [heroData, setHeroData] = useState({
    title: "Celebrate with 90% OFF",
    subtitle: "Premium quality crackers delivered safely to your doorstep",
    image_url: "/src/assets/family-celebration-hero.jpg",
    offer_text: "90% OFF",
    countdown_days: "15"
  });

  const [transportData, setTransportData] = useState({
    title: "Free Transport Delivery",
    subtitle: "We deliver your crackers safely to your location with our premium Tamil Nadu logistics service",
    image_url: "/src/assets/transport-hero.jpg",
    delivery_time: "48-60 hours - you will get the parcel at your location",
    coverage: "All districts in Tamil Nadu",
    transport_charge_note: "Transport charges apply - 48-60 hours delivery guaranteed"
  });

  const [deliveryData, setDeliveryData] = useState({
    fast_delivery: "Express delivery within 48-60 hours to ensure fresh crackers for your celebration",
    safety_protocols: "Special safety protocols for transporting crackers with proper handling and care",
    tracking: "Real-time tracking available"
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section_name');

      if (error) throw error;
      setSections(data || []);
      
      // Load existing data into forms
      data?.forEach((section) => {
        if (section.section_name === 'hero' && section.content && typeof section.content === 'object') {
          setHeroData(prev => ({ ...prev, ...section.content as typeof heroData }));
        } else if (section.section_name === 'transport' && section.content && typeof section.content === 'object') {
          setTransportData(prev => ({ ...prev, ...section.content as typeof transportData }));
        } else if (section.section_name === 'delivery' && section.content && typeof section.content === 'object') {
          setDeliveryData(prev => ({ ...prev, ...section.content as typeof deliveryData }));
        }
      });
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch homepage content');
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionName: string, content: any) => {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          section_name: sectionName,
          content: content
        }, {
          onConflict: 'section_name'
        });

      if (error) throw error;
      toast.success(`${sectionName} section updated successfully`);
      setShowEditDialog(false);
      setEditingSection(null);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section');
    }
  };

  const openEditDialog = (sectionName: string) => {
    setEditingSection(sectionName);
    setShowEditDialog(true);
  };

  const renderEditForm = () => {
    switch (editingSection) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Main Title</Label>
              <Input
                id="hero-title"
                value={heroData.title}
                onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Celebrate with 90% OFF"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Premium quality crackers delivered safely to your doorstep"
              />
            </div>
            <div>
              <Label htmlFor="hero-image">Hero Image URL</Label>
              <Input
                id="hero-image"
                value={heroData.image_url}
                onChange={(e) => setHeroData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="/src/assets/family-celebration-hero.jpg"
              />
            </div>
            <div>
              <Label htmlFor="hero-offer">Offer Text</Label>
              <Input
                id="hero-offer"
                value={heroData.offer_text}
                onChange={(e) => setHeroData(prev => ({ ...prev, offer_text: e.target.value }))}
                placeholder="90% OFF"
              />
            </div>
            <div>
              <Label htmlFor="hero-countdown">Countdown Days</Label>
              <Input
                id="hero-countdown"
                type="number"
                value={heroData.countdown_days}
                onChange={(e) => setHeroData(prev => ({ ...prev, countdown_days: e.target.value }))}
                placeholder="15"
              />
            </div>
            <Button onClick={() => saveSection('hero', heroData)} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Hero Section
            </Button>
          </div>
        );

      case 'transport':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="transport-title">Transport Title</Label>
              <Input
                id="transport-title"
                value={transportData.title}
                onChange={(e) => setTransportData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Free Transport Delivery"
              />
            </div>
            <div>
              <Label htmlFor="transport-subtitle">Transport Subtitle</Label>
              <Textarea
                id="transport-subtitle"
                value={transportData.subtitle}
                onChange={(e) => setTransportData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="We deliver your crackers safely to your location"
              />
            </div>
            <div>
              <Label htmlFor="transport-image">Transport Image URL</Label>
              <Input
                id="transport-image"
                value={transportData.image_url}
                onChange={(e) => setTransportData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="/src/assets/transport-hero.jpg"
              />
            </div>
            <div>
              <Label htmlFor="transport-delivery-time">Delivery Time</Label>
              <Input
                id="transport-delivery-time"
                value={transportData.delivery_time}
                onChange={(e) => setTransportData(prev => ({ ...prev, delivery_time: e.target.value }))}
                placeholder="48-60 hours - you will get the parcel at your location"
              />
            </div>
            <div>
              <Label htmlFor="transport-coverage">Coverage Area</Label>
              <Input
                id="transport-coverage"
                value={transportData.coverage}
                onChange={(e) => setTransportData(prev => ({ ...prev, coverage: e.target.value }))}
                placeholder="All districts in Tamil Nadu"
              />
            </div>
            <div>
              <Label htmlFor="transport-charge-note">Transport Charge Note</Label>
              <Input
                id="transport-charge-note"
                value={transportData.transport_charge_note}
                onChange={(e) => setTransportData(prev => ({ ...prev, transport_charge_note: e.target.value }))}
                placeholder="Transport charges apply - 48-60 hours delivery guaranteed"
              />
            </div>
            <Button onClick={() => saveSection('transport', transportData)} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Transport Section
            </Button>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery-fast">Fast Delivery Description</Label>
              <Textarea
                id="delivery-fast"
                value={deliveryData.fast_delivery}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, fast_delivery: e.target.value }))}
                placeholder="Express delivery within 48-60 hours to ensure fresh crackers"
              />
            </div>
            <div>
              <Label htmlFor="delivery-safety">Safety Protocols</Label>
              <Textarea
                id="delivery-safety"
                value={deliveryData.safety_protocols}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, safety_protocols: e.target.value }))}
                placeholder="Special safety protocols for transporting crackers"
              />
            </div>
            <div>
              <Label htmlFor="delivery-tracking">Tracking Information</Label>
              <Input
                id="delivery-tracking"
                value={deliveryData.tracking}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, tracking: e.target.value }))}
                placeholder="Real-time tracking available"
              />
            </div>
            <Button onClick={() => saveSection('delivery', deliveryData)} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Delivery Information
            </Button>
          </div>
        );

      default:
        return <div>Select a section to edit</div>;
    }
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return <Home className="h-5 w-5 text-brand-orange" />;
      case 'transport': return <Truck className="h-5 w-5 text-brand-red" />;
      case 'delivery': return <Clock className="h-5 w-5 text-brand-gold" />;
      default: return <Edit className="h-5 w-5 text-brand-purple" />;
    }
  };

  const getSectionDescription = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return 'Main banner with title, offer, and countdown timer';
      case 'transport': return 'Transport service details and delivery information';
      case 'delivery': return 'Delivery timing, safety protocols, and tracking info';
      default: return 'Edit this section content';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Home className="h-6 w-6 text-brand-orange" />
          Homepage Content Manager
        </h2>
        <p className="text-muted-foreground">Manage all homepage sections including hero, transport, and delivery info</p>
      </div>

      {/* Quick Edit Buttons for Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openEditDialog('hero')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-brand-orange" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Main banner with title, offer, and countdown timer
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Hero
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openEditDialog('transport')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-brand-red" />
              Transport Section
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Transport service details and delivery information
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Transport
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openEditDialog('delivery')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-gold" />
              Delivery Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Delivery timing, safety protocols, and tracking info
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Delivery
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Existing Sections Display */}
      {sections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Homepage Sections</h3>
          {sections.map((section) => (
            <Card key={section.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getSectionIcon(section.section_name)}
                  <div>
                    <h4 className="font-semibold capitalize">
                      {section.section_name.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getSectionDescription(section.section_name)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(section.section_name)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingSection && getSectionIcon(editingSection)}
              Edit {editingSection && editingSection.charAt(0).toUpperCase() + editingSection.slice(1)} Section
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderEditForm()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
