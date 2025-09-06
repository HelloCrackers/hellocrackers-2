import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSecurityWrapper } from "@/components/admin/AdminSecurityWrapper";

// Import all admin components
import { DashboardStats } from "@/components/admin/DashboardStats";
import { ImprovedProductManager } from "@/components/admin/ImprovedProductManager";
import { EnhancedOrderManager } from "@/components/admin/EnhancedOrderManager";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { TemplateManager } from "@/components/admin/TemplateManager";

import { GiftBoxManager } from "@/components/admin/GiftBoxManager";
import { HomepageContentManager } from "@/components/admin/HomepageContentManager";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { PaymentSettingsManager } from "@/components/admin/PaymentSettingsManager";
import { BulkUploadManager } from "@/components/admin/BulkUploadManager";
import { ZipUploadManager } from "@/components/admin/ZipUploadManager";
import { ContactManager } from "@/components/admin/ContactManager";
import { CountdownManager } from "@/components/admin/CountdownManager";
import { PasswordManager } from "@/components/admin/PasswordManager";
import { ImageUploadManager } from "@/components/admin/ImageUploadManager";

export default function AdminDashboard() {
  return (
    <AdminSecurityWrapper>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Secure admin panel with enhanced features</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-1 h-auto p-2">
            <TabsTrigger value="dashboard" className="text-xs px-2 py-1">Dashboard</TabsTrigger>
            <TabsTrigger value="products" className="text-xs px-2 py-1">Products</TabsTrigger>
            <TabsTrigger value="customers" className="text-xs px-2 py-1">Customers</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs px-2 py-1">Orders</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs px-2 py-1">Payments</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs px-2 py-1">Templates</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs px-2 py-1">Categories</TabsTrigger>
            <TabsTrigger value="giftboxes" className="text-xs px-2 py-1">Gift Boxes</TabsTrigger>
            <TabsTrigger value="homepage" className="text-xs px-2 py-1">Homepage</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs px-2 py-1">Contact</TabsTrigger>
            <TabsTrigger value="countdown" className="text-xs px-2 py-1">Countdown</TabsTrigger>
            <TabsTrigger value="images" className="text-xs px-2 py-1">Images</TabsTrigger>
            <TabsTrigger value="password" className="text-xs px-2 py-1">Password</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs px-2 py-1">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="products">
            <ImprovedProductManager />
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

          <TabsContent value="templates">
            <TemplateManager />
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
    </AdminSecurityWrapper>
  );
}