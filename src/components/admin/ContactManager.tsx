import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Edit3 } from "lucide-react";

interface ContactInfo {
  id: string;
  title: string;
  primary: string;
  secondary: string;
  type: "phone" | "email" | "location" | "hours";
}

interface SiteSettings {
  businessName: string;
  tagline: string;
  description: string;
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  businessHours: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
}

export const ContactManager = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([
    {
      id: "1",
      title: "Phone Support",
      primary: "+91 9042132123",
      secondary: "+91 9629088412",
      type: "phone"
    },
    {
      id: "2",
      title: "Email Support",
      primary: "Hellocrackers.official@gmail.com",
      secondary: "orders@hellocrackers.com",
      type: "email"
    },
    {
      id: "3",
      title: "Store Location",
      primary: "Tamil Nadu, India",
      secondary: "Multiple outlet locations",
      type: "location"
    },
    {
      id: "4",
      title: "Business Hours",
      primary: "9:00 AM - 7:00 PM",
      secondary: "Monday to Saturday",
      type: "hours"
    }
  ]);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    businessName: "Hello Crackers",
    tagline: "Premium Diwali Crackers at Factory Prices",
    description: "Direct factory outlet with 90% discount on Supreme Court compliant crackers",
    address: "Tamil Nadu, India",
    phone1: "+91 9042132123",
    phone2: "+91 9629088412",
    email1: "Hellocrackers.official@gmail.com",
    email2: "orders@hellocrackers.com",
    businessHours: "9:00 AM - 7:00 PM, Monday to Saturday",
    socialMedia: {
      instagram: "https://instagram.com/Hello_Crackers",
      facebook: "https://facebook.com/Hello_Crackers",
      youtube: "https://youtube.com/Hello_Crackers"
    }
  });

  const [editingContact, setEditingContact] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveContact = (contactId: string, field: string, value: string) => {
    setContactInfo(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, [field]: value }
        : contact
    ));
    setEditingContact(null);
    toast({
      title: "Contact Updated",
      description: "Contact information has been updated successfully."
    });
  };

  const handleAddContact = () => {
    const newContact: ContactInfo = {
      id: Date.now().toString(),
      title: "New Contact",
      primary: "",
      secondary: "",
      type: "phone"
    };
    setContactInfo(prev => [...prev, newContact]);
    setEditingContact(newContact.id);
  };

  const handleDeleteContact = (contactId: string) => {
    setContactInfo(prev => prev.filter(contact => contact.id !== contactId));
    toast({
      title: "Contact Deleted",
      description: "Contact information has been removed."
    });
  };

  const handleSaveSiteSettings = () => {
    // In a real app, this would save to database
    toast({
      title: "Settings Saved",
      description: "Website contact details have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Management</h2>
        <Button onClick={handleAddContact} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactInfo.map((contact) => (
          <Card key={contact.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{contact.title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContact(contact.id)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {editingContact === contact.id ? (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={contact.title}
                    onChange={(e) => {
                      setContactInfo(prev => prev.map(c => 
                        c.id === contact.id ? { ...c, title: e.target.value } : c
                      ));
                    }}
                  />
                </div>
                <div>
                  <Label>Primary Information</Label>
                  <Input
                    value={contact.primary}
                    onChange={(e) => {
                      setContactInfo(prev => prev.map(c => 
                        c.id === contact.id ? { ...c, primary: e.target.value } : c
                      ));
                    }}
                  />
                </div>
                <div>
                  <Label>Secondary Information</Label>
                  <Input
                    value={contact.secondary}
                    onChange={(e) => {
                      setContactInfo(prev => prev.map(c => 
                        c.id === contact.id ? { ...c, secondary: e.target.value } : c
                      ));
                    }}
                  />
                </div>
                <Button
                  onClick={() => {
                    setEditingContact(null);
                    toast({
                      title: "Contact Updated",
                      description: "Contact information has been updated."
                    });
                  }}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-800 font-medium">{contact.primary}</div>
                <div className="text-gray-600 text-sm">{contact.secondary}</div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Website Footer/Bottom Details */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Website Footer Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={siteSettings.businessName}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, businessName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Tagline</Label>
              <Input
                value={siteSettings.tagline}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, tagline: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={siteSettings.description}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label>Primary Phone</Label>
              <Input
                value={siteSettings.phone1}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, phone1: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Secondary Phone</Label>
              <Input
                value={siteSettings.phone2}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, phone2: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Address</Label>
              <Textarea
                value={siteSettings.address}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>
            
            <div>
              <Label>Primary Email</Label>
              <Input
                value={siteSettings.email1}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, email1: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Secondary Email</Label>
              <Input
                value={siteSettings.email2}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, email2: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Business Hours</Label>
              <Input
                value={siteSettings.businessHours}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, businessHours: e.target.value }))}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold mb-4">Social Media Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Instagram URL</Label>
              <Input
                value={siteSettings.socialMedia.instagram}
                onChange={(e) => setSiteSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label>Facebook URL</Label>
              <Input
                value={siteSettings.socialMedia.facebook}
                onChange={(e) => setSiteSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label>YouTube URL</Label>
              <Input
                value={siteSettings.socialMedia.youtube}
                onChange={(e) => setSiteSettings(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>
        
        <Button onClick={handleSaveSiteSettings} className="mt-6 w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Website Details
        </Button>
      </Card>
    </div>
  );
};