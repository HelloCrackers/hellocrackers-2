import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupabase, SiteSetting } from "@/hooks/useSupabase";
import { Save, Settings, Globe, Phone, Mail, DollarSign } from "lucide-react";

export const SiteSettingsManager = () => {
  const { fetchSiteSettings, updateSiteSetting } = useSupabase();
  
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSiteSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    const success = await updateSiteSetting(key, value);
    if (success) {
      await loadSettings();
    }
    setSaving(false);
  };

  const getSettingsByCategory = () => {
    const categories = {
      general: settings.filter(s => ['site_name', 'site_tagline'].includes(s.key)),
      contact: settings.filter(s => ['contact_phone', 'contact_email'].includes(s.key)),
      business: settings.filter(s => ['minimum_order', 'delivery_info', 'factory_discount'].includes(s.key))
    };
    return categories;
  };

  const categories = getSettingsByCategory();

  const getIcon = (key: string) => {
    switch (key) {
      case 'site_name':
      case 'site_tagline':
        return <Globe className="h-4 w-4" />;
      case 'contact_phone':
        return <Phone className="h-4 w-4" />;
      case 'contact_email':
        return <Mail className="h-4 w-4" />;
      case 'minimum_order':
      case 'factory_discount':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Configure your website settings</p>
      </div>

      {/* General Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          General Settings
        </h3>
        <div className="space-y-4">
          {categories.general.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <Label htmlFor={setting.key} className="flex items-center gap-2">
                {getIcon(setting.key)}
                {setting.description || setting.key.replace('_', ' ').toUpperCase()}
              </Label>
              <div className="flex gap-2">
                <Input
                  id={setting.key}
                  value={setting.value}
                  onChange={(e) => {
                    setSettings(prev => prev.map(s => 
                      s.key === setting.key ? { ...s, value: e.target.value } : s
                    ));
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSave(setting.key, setting.value)}
                  disabled={saving}
                  size="sm"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </h3>
        <div className="space-y-4">
          {categories.contact.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <Label htmlFor={setting.key} className="flex items-center gap-2">
                {getIcon(setting.key)}
                {setting.description || setting.key.replace('_', ' ').toUpperCase()}
              </Label>
              <div className="flex gap-2">
                <Input
                  id={setting.key}
                  value={setting.value}
                  onChange={(e) => {
                    setSettings(prev => prev.map(s => 
                      s.key === setting.key ? { ...s, value: e.target.value } : s
                    ));
                  }}
                  className="flex-1"
                  type={setting.key === 'contact_email' ? 'email' : 'text'}
                />
                <Button 
                  onClick={() => handleSave(setting.key, setting.value)}
                  disabled={saving}
                  size="sm"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Business Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Business Settings
        </h3>
        <div className="space-y-4">
          {categories.business.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <Label htmlFor={setting.key} className="flex items-center gap-2">
                {getIcon(setting.key)}
                {setting.description || setting.key.replace('_', ' ').toUpperCase()}
              </Label>
              <div className="flex gap-2">
                <Input
                  id={setting.key}
                  value={setting.value}
                  onChange={(e) => {
                    setSettings(prev => prev.map(s => 
                      s.key === setting.key ? { ...s, value: e.target.value } : s
                    ));
                  }}
                  className="flex-1"
                  type={['minimum_order', 'factory_discount'].includes(setting.key) ? 'number' : 'text'}
                />
                <Button 
                  onClick={() => handleSave(setting.key, setting.value)}
                  disabled={saving}
                  size="sm"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {loading && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </Card>
      )}
    </div>
  );
};