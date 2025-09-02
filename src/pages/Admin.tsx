import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Users,
  Package,
  ShoppingCart,
  Download,
  Edit,
  Trash2,
  Plus,
  FileText,
  Eye,
  DollarSign
} from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Mock data - replace with real API calls
  const [stats] = useState({
    totalRevenue: 50000,
    totalOrders: 1,
    activeProducts: 190,
    totalCustomers: 4,
    conversionRate: 25.00,
    avgOrderValue: 2300,
    returnCustomers: 0,
    growthRate: 0
  });

  const [orders] = useState([
    {
      id: "#4",
      customer: "Iyappan K",
      items: 1,
      total: 23,
      status: "CONFIRMED",
      date: "27/08/2025",
      payment: "online",
      paymentId: "pay_RARckpW2Hr5tE"
    }
  ]);

  const [customers] = useState([
    {
      name: "Skcrackers",
      email: "skcracker.official@gmail.com",
      phone: "9042191018",
      orders: 0,
      totalSpent: 0,
      status: "Active",
      joinDate: "10/08/2025"
    },
    {
      name: "Iyappan K",
      email: "iyappanvicky7@gmail.com",
      phone: "7397326983",
      orders: 1,
      totalSpent: 23,
      status: "Active",
      joinDate: "10/08/2025",
      lastOrder: "27/08/2025"
    },
    {
      name: "Kaviya",
      email: "satheeshkumar22june@gmail.com",
      phone: "9042132123",
      orders: 0,
      totalSpent: 0,
      status: "Active",
      joinDate: "12/08/2025"
    },
    {
      name: "8925916760",
      email: "satheeshkumarb@nibavlifts.com",
      phone: "+918925916760",
      orders: 0,
      totalSpent: 0,
      status: "Active",
      joinDate: "25/08/2025"
    }
  ]);

  const [products] = useState([
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Kuruvi",
      category: "Adults",
      basePrice: 65,
      discount: 90,
      actualPrice: 6.5,
      stock: 999990,
      sales: 0,
      rating: 5,
      status: "FALSE"
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Lakshmi",
      category: "Adults",
      basePrice: 150,
      discount: 90,
      actualPrice: 15,
      stock: 999994,
      sales: 0,
      rating: 1,
      status: "FALSE"
    }
  ]);

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const exportToExcel = (data: any[], filename: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${filename} to Excel format...`,
    });
    // Implement Excel export logic here
  };

  const exportToPDF = (data: any[], filename: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${filename} to PDF format...`,
    });
    // Implement PDF export logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => exportToExcel(orders, "orders")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={() => exportToPDF(orders, "orders")} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+0%</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    <p className="text-sm text-green-600">+8%</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Products</p>
                    <p className="text-2xl font-bold">{stats.activeProducts}</p>
                    <p className="text-sm text-green-600">+3%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                    <p className="text-sm text-green-600">+15%</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <BarChart className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Conversion Rate</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.conversionRate}%</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Avg Order Value</h3>
                <p className="text-2xl font-bold text-green-600">₹{stats.avgOrderValue}</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Return Customers</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.returnCustomers}%</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Growth Rate</h3>
                <p className="text-2xl font-bold text-red-600">+{stats.growthRate}%</p>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total}</p>
                      <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <div className="flex gap-2">
                <Button onClick={() => exportToExcel(products, "products")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Products
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Image</th>
                      <th className="text-left p-4">Product Details</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Base Price</th>
                      <th className="text-left p-4">Discount %</th>
                      <th className="text-left p-4">Actual Price</th>
                      <th className="text-left p-4">Stock</th>
                      <th className="text-left p-4">Performance</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Single Sound Crackers</p>
                          </div>
                        </td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">₹{product.basePrice}</td>
                        <td className="p-4">{product.discount}%</td>
                        <td className="p-4">₹{product.actualPrice}</td>
                        <td className="p-4 text-green-600">{product.stock.toLocaleString()}</td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm">Sales: {product.sales}</p>
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1">{product.rating}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={product.status === "TRUE" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  Filter Orders
                </Button>
                <Button onClick={() => exportToExcel(orders, "orders")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Orders
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Order ID</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Items</th>
                      <th className="text-left p-4">Total</th>
                      <th className="text-left p-4">Payment</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Courier</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="p-4 font-semibold">{order.id}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">7397326983</p>
                          </div>
                        </td>
                        <td className="p-4">{order.items} Items</td>
                        <td className="p-4">₹{order.total}</td>
                        <td className="p-4">
                          <div>
                            <Badge className="bg-green-100 text-green-800 mb-1">online</Badge>
                            <p className="text-xs text-muted-foreground">{order.paymentId}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                        </td>
                        <td className="p-4">-</td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Order...
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Customer Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  Search Customers
                </Button>
                <Button onClick={() => exportToExcel(customers, "customers")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Customers
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Contact</th>
                      <th className="text-left p-4">Orders</th>
                      <th className="text-left p-4">Total Spent</th>
                      <th className="text-left p-4">Last Order</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">Joined {customer.joinDate}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm">{customer.email}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                        </td>
                        <td className="p-4">{customer.orders}</td>
                        <td className="p-4">₹{customer.totalSpent}</td>
                        <td className="p-4">{customer.lastOrder || "-"}</td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800">{customer.status}</Badge>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Category Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Categories
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Category
                </Button>
              </div>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Total Categories</h3>
                <p className="text-2xl font-bold text-blue-600">6</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Active Categories</h3>
                <p className="text-2xl font-bold text-green-600">4</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Total Products</h3>
                <p className="text-2xl font-bold text-purple-600">190</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Most Popular</h3>
                <p className="text-lg font-bold text-orange-600">Master</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Settings</h2>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Store Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" defaultValue="SK Crackers" />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" defaultValue="skcrackers.official@gmail.com" />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" defaultValue="+91 99421 91018" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="storeAddress">Store Address</Label>
                    <Textarea id="storeAddress" defaultValue="Sivakasi" />
                  </div>
                  <div>
                    <Label htmlFor="freeDelivery">Free delivery Amount*</Label>
                    <Input id="freeDelivery" defaultValue="500" />
                  </div>
                  <div>
                    <Label htmlFor="youtubeLink">Youtube Link*</Label>
                    <Input id="youtubeLink" defaultValue="https://" />
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Settings</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}