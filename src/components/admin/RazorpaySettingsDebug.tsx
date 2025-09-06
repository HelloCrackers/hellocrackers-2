import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export const RazorpaySettingsDebug = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<{
    tableExists: boolean | null;
    canRead: boolean | null;
    canWrite: boolean | null;
    settings: any[];
    enabled: boolean;
  }>({
    tableExists: null,
    canRead: null,
    canWrite: null,
    settings: [],
    enabled: false
  });

  const runDiagnostics = async () => {
    const results = {
      tableExists: false,
      canRead: false,
      canWrite: false,
      settings: [],
      enabled: false
    };

    try {
      // Test 1: Check if table exists and can read
      console.log('Testing table access...');
      const { data: readData, error: readError } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1);

      if (readError) {
        console.error('Read test failed:', readError);
        results.tableExists = false;
        results.canRead = false;
      } else {
        console.log('Read test passed');
        results.tableExists = true;
        results.canRead = true;
        results.settings = readData || [];
        
        // Check if razorpay_enabled exists
        const enabledSetting = results.settings.find(s => s.key === 'razorpay_enabled');
        results.enabled = enabledSetting?.value === 'true';
      }

      // Test 2: Try to insert/update a test setting
      if (results.canRead) {
        try {
          console.log('Testing write access...');
          const testKey = 'test_setting_' + Date.now();
          const { error: writeError } = await supabase
            .from('payment_settings')
            .insert({ key: testKey, value: 'test' });

          if (writeError) {
            console.error('Write test failed:', writeError);
            results.canWrite = false;
          } else {
            console.log('Write test passed');
            results.canWrite = true;
            
            // Clean up test record
            await supabase
              .from('payment_settings')
              .delete()
              .eq('key', testKey);
          }
        } catch (error) {
          console.error('Write test error:', error);
          results.canWrite = false;
        }
      }

    } catch (error) {
      console.error('Diagnostics error:', error);
    }

    setTestResults(results);
    
    toast({
      title: "Diagnostics Complete",
      description: `Table exists: ${results.tableExists}, Can read: ${results.canRead}, Can write: ${results.canWrite}`,
    });
  };

  const forceToggleRazorpay = async () => {
    try {
      console.log('Force toggling Razorpay...');
      const newValue = !testResults.enabled;
      
      if (!testResults.canWrite) {
        toast({
          title: "Cannot Toggle",
          description: "No write permissions to payment_settings table",
          variant: "destructive",
        });
        return;
      }

      const { data: existing, error: selectError } = await supabase
        .from('payment_settings')
        .select('id')
        .eq('key', 'razorpay_enabled')
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (!existing) {
        // Insert new record
        const { error: insertError } = await supabase
          .from('payment_settings')
          .insert({ key: 'razorpay_enabled', value: newValue ? 'true' : 'false' });
        
        if (insertError) throw insertError;
      } else {
        // Update existing record
        const { error: updateError } = await supabase
          .from('payment_settings')
          .update({ value: newValue ? 'true' : 'false' })
          .eq('key', 'razorpay_enabled');
        
        if (updateError) throw updateError;
      }

      setTestResults(prev => ({ ...prev, enabled: newValue }));
      
      toast({
        title: "Toggle Successful",
        description: `Razorpay is now ${newValue ? 'enabled' : 'disabled'}`,
      });

    } catch (error) {
      console.error('Force toggle failed:', error);
      toast({
        title: "Toggle Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 mb-6 border-2 border-orange-200 bg-orange-50">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-orange-900">Razorpay Settings Diagnostics</h3>
      </div>
      
      <div className="space-y-4">
        <Button onClick={runDiagnostics} variant="outline">
          Run Database Diagnostics
        </Button>

        {testResults.tableExists !== null && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {testResults.tableExists ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span>Payment Settings Table: {testResults.tableExists ? 'EXISTS' : 'MISSING'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {testResults.canRead ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span>Read Permission: {testResults.canRead ? 'OK' : 'DENIED'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {testResults.canWrite ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span>Write Permission: {testResults.canWrite ? 'OK' : 'DENIED'}</span>
            </div>

            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-sm font-medium mb-2">Current Settings Count: {testResults.settings.length}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={testResults.enabled}
                    onCheckedChange={forceToggleRazorpay}
                    disabled={!testResults.canWrite}
                  />
                  <Label>Razorpay Enabled (Force Toggle)</Label>
                </div>
                <span className="text-xs text-muted-foreground">
                  Current: {testResults.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};