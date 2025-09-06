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
  return (
    <AdminSecurityWrapper>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Secure admin panel with enhanced features</p>
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
    </AdminSecurityWrapper>
  );
}