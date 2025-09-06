import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSupabase, PaymentSetting } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, CreditCard, QrCode, Building, FileText } from "lucide-react";
import { RazorpaySettingsDebug } from "./RazorpaySettingsDebug";

export const PaymentSettingsManager = () => {
  const { fetchPaymentSettings, updatePaymentSetting, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<PaymentSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      console.log(`Attempting to update payment setting: ${key} = ${value}`);
      await updatePaymentSetting(key, value);
      setSettings(prev => {
        const existingSetting = prev.find(s => s.key === key);
        if (existingSetting) {
          return prev.map(s => s.key === key ? { ...s, value } : s);
        } else {
          // Add new setting if it doesn't exist
          return [...prev, { id: Date.now().toString(), key, value, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];
        }
      });
      console.log(`Successfully updated payment setting: ${key}`);
    } catch (error) {
      console.error('Update setting error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({ 
        title: "Failed to update payment setting", 
        description: `Could not update ${key}. Please check database permissions.`,
        variant: "destructive" 
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      console.log('Loading payment settings...');
      const data = await fetchPaymentSettings();
      console.log('Payment settings loaded:', data);
      setSettings(data);
    } catch (error) {
      console.error('Failed to load payment settings:', error);
      toast({ 
        title: "Database Connection Error", 
        description: "Could not load payment settings. Check if payment_settings table exists.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { success, url } = await uploadFile('content', `qr-codes/${Date.now()}_${file.name}`, file);
      if (success && url) {
        await updateSetting('payment_qr_code', url);
        toast({ title: "QR Code uploaded successfully" });
      } else {
        toast({ title: "Failed to upload QR code", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to upload QR code", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Settings</h2>
        <p className="text-muted-foreground">Configure manual payment options and details</p>
      </div>

      {/* Diagnostics Tool */}
      <RazorpaySettingsDebug />

      {/* Razorpay Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Razorpay Payment Gateway</h3>
            <p className="text-sm text-muted-foreground">Configure Razorpay for online payments</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={getSettingValue('razorpay_enabled') === 'true'}
              onCheckedChange={async (checked) => {
                await updateSetting('razorpay_enabled', checked ? 'true' : 'false');
                toast({
                  title: checked ? "Razorpay Enabled" : "Razorpay Disabled",
                  description: checked ? "Online payments are now active" : "Online payments are now disabled",
                });
              }}
              disabled={loading}
            />
            <Label>Enable Razorpay Payments</Label>
            {loading && <span className="text-sm text-muted-foreground">Updating...</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
              <Input
                id="razorpay-key"
                type="password"
                value={getSettingValue('razorpay_key_id')}
                onChange={(e) => updateSetting('razorpay_key_id', e.target.value)}
                placeholder="Enter Razorpay Key ID"
              />
            </div>
            
            <div>
              <Label htmlFor="razorpay-secret">Razorpay Key Secret</Label>
              <Input
                id="razorpay-secret"
                type="password"
                value={getSettingValue('razorpay_key_secret')}
                onChange={(e) => updateSetting('razorpay_key_secret', e.target.value)}
                placeholder="Enter Razorpay Key Secret"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="razorpay-webhook">Webhook Secret (Optional)</Label>
            <Input
              id="razorpay-webhook"
              type="password"
              value={getSettingValue('razorpay_webhook_secret')}
              onChange={(e) => updateSetting('razorpay_webhook_secret', e.target.value)}
              placeholder="Enter Razorpay Webhook Secret"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Test Payment Gateway</h4>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={async () => {
                  const testMode = getSettingValue('razorpay_test_mode') !== 'false';
                  await updateSetting('razorpay_test_mode', testMode ? 'false' : 'true');
                  toast({ 
                    title: testMode ? "Switched to Live Mode" : "Switched to Test Mode",
                    description: testMode ? "Real payments will be processed" : "Test payments only" 
                  });
                }}
              >
                {getSettingValue('razorpay_test_mode') !== 'false' ? '🧪 Test Mode' : '🔴 Live Mode'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Create test payment
                  if (typeof window !== 'undefined' && window.Razorpay) {
                    const options = {
                      key: getSettingValue('razorpay_key_id'),
                      amount: 100, // ₹1 in paisa
                      currency: 'INR',
                      name: 'Hello Crackers - Test',
                      description: 'Test Payment',
                      handler: function(response: any) {
                        toast({ title: "Test Payment Successful", description: `Payment ID: ${response.razorpay_payment_id}` });
                      },
                      modal: {
                        ondismiss: function() {
                          toast({ title: "Test Payment Cancelled", variant: "destructive" });
                        }
                      }
                    };
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                  } else {
                    toast({ title: "Razorpay not loaded", description: "Please refresh the page", variant: "destructive" });
                  }
                }}
              >
                Test Payment (₹1)
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            When enabled, customers can pay online using Razorpay. Keep manual mode as fallback for failed transactions.
          </p>
        </div>
      </Card>

      {/* QR Code Upload */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <QrCode className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold">UPI QR Code</h3>
            <p className="text-sm text-muted-foreground">Upload QR code for UPI payments</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="qr-upload">Upload QR Code Image</Label>
            <div className="mt-2">
              <Input
                id="qr-upload"
                type="file"
                accept="image/*"
                onChange={handleQRUpload}
                disabled={uploading}
              />
            </div>
          </div>

          {getSettingValue('payment_qr_code') && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Current QR Code:</p>
              <img 
                src={getSettingValue('payment_qr_code')} 
                alt="Payment QR Code" 
                className="w-48 h-48 object-contain mx-auto border rounded"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Bank Details */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Building className="h-6 w-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold">Bank Account Details</h3>
            <p className="text-sm text-muted-foreground">Configure bank details for direct transfers</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={getSettingValue('bank_name')}
              onChange={(e) => updateSetting('bank_name', e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
          
          <div>
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              value={getSettingValue('account_number')}
              onChange={(e) => updateSetting('account_number', e.target.value)}
              placeholder="Enter account number"
            />
          </div>
          
          <div>
            <Label htmlFor="ifsc-code">IFSC Code</Label>
            <Input
              id="ifsc-code"
              value={getSettingValue('ifsc_code')}
              onChange={(e) => updateSetting('ifsc_code', e.target.value)}
              placeholder="Enter IFSC code"
            />
          </div>
          
          <div>
            <Label htmlFor="branch-name">Branch Name</Label>
            <Input
              id="branch-name"
              value={getSettingValue('branch_name')}
              onChange={(e) => updateSetting('branch_name', e.target.value)}
              placeholder="Enter branch name"
            />
          </div>
        </div>
      </Card>

      {/* Payment Instructions */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <FileText className="h-6 w-6 text-orange-600" />
          <div>
            <h3 className="text-lg font-semibold">Payment Instructions</h3>
            <p className="text-sm text-muted-foreground">Message displayed to customers after order placement</p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="payment-instructions">Instructions</Label>
          <Textarea
            id="payment-instructions"
            value={getSettingValue('payment_instructions')}
            onChange={(e) => updateSetting('payment_instructions', e.target.value)}
            placeholder="Enter payment instructions for customers"
            rows={4}
            className="mt-2"
          />
        </div>
      </Card>
    </div>
  );
};