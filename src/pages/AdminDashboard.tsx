import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";

// Import all admin components
import { DashboardStats } from "@/components/admin/DashboardStats";
import { EnhancedProductManager } from "@/components/admin/EnhancedProductManager";
import { EnhancedOrderManager } from "@/components/admin/EnhancedOrderManager";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { GiftBoxManager } from "@/components/admin/GiftBoxManager";
import { HomepageContentManager } from "@/components/admin/HomepageContentManager";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { ChallanTemplateManagerV2 } from "@/components/admin/ChallanTemplateManagerV2";
import { QuotationTemplateManagerV2 } from "@/components/admin/QuotationTemplateManagerV2";
import { PaymentSettingsManager } from "@/components/admin/PaymentSettingsManager";
import { BulkUploadManager } from "@/components/admin/BulkUploadManager";
import { ZipUploadManager } from "@/components/admin/ZipUploadManager";
import { ContactManager } from "@/components/admin/ContactManager";
import { PasswordManager } from "@/components/admin/PasswordManager";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
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
          <TabsList className="grid w-full grid-cols-12 lg:grid-cols-12">
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