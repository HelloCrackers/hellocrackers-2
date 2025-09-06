import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Import all admin components
import { DashboardStats } from "@/components/admin/DashboardStats";
import { EnhancedProductManager } from "@/components/admin/EnhancedProductManager";
import { EnhancedOrderManager } from "@/components/admin/EnhancedOrderManager";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { CategoryManager } from "@/components/admin/CategoryManager";

import { GiftBoxManager } from "@/components/admin/GiftBoxManager";
import { HomepageContentManager } from "@/components/admin/HomepageContentManager";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { ChallanTemplateManagerV2 } from "@/components/admin/ChallanTemplateManagerV2";
import { QuotationTemplateManagerV2 } from "@/components/admin/QuotationTemplateManagerV2";
import { PaymentSettingsManager } from "@/components/admin/PaymentSettingsManager";
import { BulkUploadManager } from "@/components/admin/BulkUploadManager";
import { ZipUploadManager } from "@/components/admin/ZipUploadManager";
import { ContactManager } from "@/components/admin/ContactManager";
import { CountdownManager } from "@/components/admin/CountdownManager";
import { PasswordManager } from "@/components/admin/PasswordManager";
import { ImageUploadManager } from "@/components/admin/ImageUploadManager";

export default function AdminDashboard() {
  const { user, isAdmin, login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (!success) {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-13 lg:grid-cols-13">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="challan">Challan</TabsTrigger>
            <TabsTrigger value="quotation">Quotation</TabsTrigger>
            <TabsTrigger value="giftboxes">Gift Boxes</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="countdown">Countdown</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-8">
              <EnhancedProductManager />
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Bulk Upload</h2>
                <BulkUploadManager />
              </div>
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Media Upload</h2>
                <ZipUploadManager />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <EnhancedOrderManager />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentSettingsManager />
          </TabsContent>

          <TabsContent value="challan">
            <ChallanTemplateManagerV2 />
          </TabsContent>

          <TabsContent value="quotation">
            <QuotationTemplateManagerV2 />
          </TabsContent>

          <TabsContent value="giftboxes">
            <GiftBoxManager />
          </TabsContent>

          <TabsContent value="homepage">
            <HomepageContentManager />
          </TabsContent>

          <TabsContent value="contact">
            <ContactManager />
          </TabsContent>

          <TabsContent value="countdown">
            <CountdownManager />
          </TabsContent>

          <TabsContent value="images">
            <ImageUploadManager />
          </TabsContent>

          <TabsContent value="password">
            <PasswordManager />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}