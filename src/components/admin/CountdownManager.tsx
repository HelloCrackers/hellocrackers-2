import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Clock, Calendar, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CountdownSettings {
  title: string;
  description: string;
  target_date: string;
  is_active: boolean;
  festival_name: string;
}

export const CountdownManager = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<CountdownSettings>({
    title: "Limited Time Offer Ends In:",
    description: "Diwali Special - 90% OFF on all crackers",
    target_date: "2026-11-01", // Diwali 2026 approximate
    is_active: true,
    festival_name: "Diwali 2026"
  });

  const { toast } = useToast();

  useEffect(() => {
    loadCountdownSettings();
  }, []);

  const loadCountdownSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['countdown_title', 'countdown_description', 'countdown_target_date', 'countdown_is_active', 'countdown_festival_name']);

      if (error) throw error;

      const settingsMap = data.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      if (Object.keys(settingsMap).length > 0) {
        setSettings({
          title: settingsMap.countdown_title || settings.title,
          description: settingsMap.countdown_description || settings.description,
          target_date: settingsMap.countdown_target_date || settings.target_date,
          is_active: settingsMap.countdown_is_active !== 'false',
          festival_name: settingsMap.countdown_festival_name || settings.festival_name
        });
      }
    } catch (error) {
      console.error('Error loading countdown settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const settingsData = [
        { key: 'countdown_title', value: settings.title, description: 'Countdown timer title' },
        { key: 'countdown_description', value: settings.description, description: 'Countdown description' },
        { key: 'countdown_target_date', value: settings.target_date, description: 'Countdown target date' },
        { key: 'countdown_is_active', value: settings.is_active.toString(), description: 'Countdown active status' },
        { key: 'countdown_festival_name', value: settings.festival_name, description: 'Festival name' }
      ];

      for (const setting of settingsData) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: setting.key,
            value: setting.value,
            description: setting.description
          }, {
            onConflict: 'key'
          });

        if (error) throw error;
      }

      toast({
        title: "Settings Saved",
        description: "Countdown timer settings have been updated successfully."
      });

      loadCountdownSettings();
    } catch (error) {
      console.error('Error saving countdown settings:', error);
      toast({
        title: "Error",
        description: "Failed to save countdown settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    const targetDate = new Date(settings.target_date).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes, active: true };
    }
    
    return { days: 0, hours: 0, minutes: 0, active: false };
  };

  const timeLeft = calculateTimeLeft();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-brand-orange" />
            Countdown Timer Manager
          </h2>
          <p className="text-muted-foreground">Configure automatic countdown timers for festivals and special offers</p>
        </div>
      </div>

      {/* Current Countdown Preview */}
      <Card className="p-6 bg-gradient-to-r from-brand-orange/10 to-brand-red/10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Current Countdown Preview
        </h3>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 inline-block">
          <p className="text-sm font-medium mb-2">{settings.title}</p>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-brand-gold">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-xs">DAYS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-gold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs">HOURS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-gold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs">MINS</div>
            </div>
          </div>
        </div>

        {!timeLeft.active && (
          <div className="mt-4 flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Countdown has expired. Please set a new target date.</span>
          </div>
        )}
      </Card>

      {/* Settings Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Countdown Settings</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Festival/Event Name</Label>
              <Input
                value={settings.festival_name}
                onChange={(e) => setSettings(prev => ({ ...prev, festival_name: e.target.value }))}
                placeholder="Diwali 2026"
              />
            </div>
            
            <div>
              <Label>Target Date</Label>
              <Input
                type="date"
                value={settings.target_date}
                onChange={(e) => setSettings(prev => ({ ...prev, target_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Countdown Title</Label>
            <Input
              value={settings.title}
              onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Limited Time Offer Ends In:"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={settings.description}
              onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Diwali Special - 90% OFF on all crackers"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={settings.is_active}
              onChange={(e) => setSettings(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="is_active">Enable countdown timer on homepage</Label>
          </div>
        </div>

        <Button onClick={saveSettings} className="mt-6 w-full" disabled={loading}>
          {loading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Countdown Settings
            </>
          )}
        </Button>
      </Card>

      {/* Quick Presets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Festival Presets</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => setSettings(prev => ({
              ...prev,
              target_date: "2026-11-01",
              festival_name: "Diwali 2026",
              title: "Diwali Countdown:",
              description: "Premium crackers with 90% OFF for Diwali celebrations"
            }))}
          >
            Diwali 2026
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setSettings(prev => ({
              ...prev,
              target_date: "2025-12-31",
              festival_name: "New Year 2026",
              title: "New Year Sale Ends In:",
              description: "Year-end special offers on all cracker categories"
            }))}
          >
            New Year 2026
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setSettings(prev => ({
              ...prev,
              target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              festival_name: "Flash Sale",
              title: "Flash Sale Ends In:",
              description: "Limited time offer - grab your favorites now!"
            }))}
          >
            30-Day Sale
          </Button>
        </div>
      </Card>
    </div>
  );
};