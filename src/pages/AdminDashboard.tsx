import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { 
  BarChart, Users, Package, ShoppingCart, Download, Edit, Trash2, Plus, 
  FileText, Eye, DollarSign, Upload, Save, Settings, Image, Video,
  Factory, Truck, CheckCircle
} from "lucide-react";

// Import admin components
import { EnhancedProductManager } from "@/components/admin/EnhancedProductManager";
import { OrderManager } from "@/components/admin/OrderManager";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { EnhancedChallanManager } from "@/components/admin/EnhancedChallanManager";
import { DashboardStats } from "@/components/admin/DashboardStats";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete Content Management System</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-brand-green text-white">
              Admin Access
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="challans">Challans</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <EnhancedProductManager />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManager />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <HomepageEditor />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SiteSettingsManager />
          </TabsContent>

          <TabsContent value="challans" className="space-y-6">
            <EnhancedChallanManager />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}