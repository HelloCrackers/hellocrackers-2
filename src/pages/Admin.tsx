import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Settings, Package, Truck, Bell, Users, FileText, Eye } from "lucide-react";

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Header */}
      <section className="bg-gradient-festive text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/90">Manage Hello Crackers Platform</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">456</div>
                  <p className="text-xs text-muted-foreground">+12 new this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹2,45,678</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">890</div>
                  <p className="text-xs text-muted-foreground">+45 new customers</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Product Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="excel-upload">Upload Excel File</Label>
                  <Input id="excel-upload" type="file" accept=".xlsx,.xls" />
                  <p className="text-sm text-gray-600 mt-1">
                    Format: Product Code, Name, User For, Category, MRP, Discount, Final Rate, Quantity
                  </p>
                </div>
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Products
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Family", "Adult", "Kids", "Fancy Crackers", "Sparklers", "Bijili Crackers"].map((category) => (
                    <Badge key={category} variant="outline" className="cursor-pointer">
                      {category}
                    </Badge>
                  ))}
                </div>
                <Button className="mt-4">Add New Category</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="media-zip">Upload Media ZIP</Label>
                  <Input id="media-zip" type="file" accept=".zip" />
                  <p className="text-sm text-gray-600 mt-1">
                    Include images and videos named by Product Code (e.g., H001.jpg, H001.mp4)
                  </p>
                </div>
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media Files
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>#12345</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>₹1,250</TableCell>
                      <TableCell>
                        <Badge>Paid</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transport Tab */}
          <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transport Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="courier">Courier Partner</Label>
                    <Input id="courier" placeholder="Enter courier name" />
                  </div>
                  <div>
                    <Label htmlFor="vehicle">Vehicle Number</Label>
                    <Input id="vehicle" placeholder="TN XX XX XXXX" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Delivery Status</Label>
                  <select className="w-full p-2 border rounded">
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                  </select>
                </div>
                <Button>Update Transport Info</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-text">Hero Section Text</Label>
                  <Input id="hero-text" defaultValue="Direct Factory Outlet – Celebrate with 90% OFF" />
                </div>
                <div>
                  <Label htmlFor="offer-text">Offer Banner</Label>
                  <Input id="offer-text" defaultValue="90% OFF on All Products" />
                </div>
                <div>
                  <Label htmlFor="transport-text">Transport Message</Label>
                  <Input id="transport-text" defaultValue="Free Transport delivery to you at your location" />
                </div>
                <Button>Update Content</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Supreme Court Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sc-upload">Upload SC Notice PDF</Label>
                    <Input id="sc-upload" type="file" accept=".pdf" />
                  </div>
                  <Button>
                    <Bell className="h-4 w-4 mr-2" />
                    Upload Notice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>90% OFF Sale Toggle</Label>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Free Delivery Toggle</Label>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>New User Registration</Label>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}