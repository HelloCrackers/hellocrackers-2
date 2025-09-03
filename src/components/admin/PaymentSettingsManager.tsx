import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSupabase, PaymentSetting } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, CreditCard, QrCode, Building, FileText } from "lucide-react";

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
      await updatePaymentSetting(key, value);
      setSettings(prev => prev.map(s => 
        s.key === key ? { ...s, value } : s
      ));
      toast({ title: "Setting updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update setting", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchPaymentSettings();
      setSettings(data);
    } catch (error) {
      toast({ title: "Failed to load payment settings", variant: "destructive" });
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

      {/* Razorpay Manual Mode */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Razorpay Manual Mode</h3>
            <p className="text-sm text-muted-foreground">Enable manual payment confirmation for orders</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={getSettingValue('razorpay_enabled') === 'true'}
            onCheckedChange={(checked) => updateSetting('razorpay_enabled', checked ? 'true' : 'false')}
          />
          <Label>Enable Manual Payment Mode</Label>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          When enabled, customers will see manual payment options and admins can confirm payments manually.
        </p>
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