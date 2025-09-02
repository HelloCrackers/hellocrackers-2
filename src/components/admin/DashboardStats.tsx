import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { 
  BarChart, Users, Package, ShoppingCart, DollarSign, 
  TrendingUp, Eye, FileText 
} from "lucide-react";

export const DashboardStats = () => {
  const { fetchProducts, fetchOrders, fetchCustomers } = useSupabase();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, orders, customers] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchCustomers()
        ]);

        const totalRevenue = orders
          .filter(order => order.payment_status === 'paid')
          .reduce((sum, order) => sum + order.total_amount, 0);

        const pendingOrders = orders.filter(order => order.order_status === 'confirmed').length;
        const recentOrders = orders.slice(0, 5);

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          activeProducts: products.filter(p => p.status === 'active').length,
          totalCustomers: customers.length,
          pendingOrders,
          recentOrders
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
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
              <p className="text-sm text-blue-600">
                {stats.pendingOrders} pending
              </p>
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
              <p className="text-sm text-purple-600">Products in catalog</p>
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
              <p className="text-sm text-orange-600">Registered users</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="font-semibold mb-2">Growth Rate</h3>
          <p className="text-2xl font-bold text-green-600">+25%</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </Card>

        <Card className="p-6 text-center">
          <BarChart className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="font-semibold mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-blue-600">15.8%</p>
          <p className="text-sm text-muted-foreground">Visitors to customers</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="h-12 w-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Avg Order Value</h3>
          <p className="text-2xl font-bold text-purple-600">₹{Math.round(stats.totalRevenue / (stats.totalOrders || 1)).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Per order</p>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {stats.recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          ) : (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.total_amount.toLocaleString()}</p>
                  <Badge 
                    variant={order.order_status === 'delivered' ? 'default' : 'secondary'}
                    className={
                      order.order_status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {order.order_status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col h-20">
            <Package className="h-6 w-6 mb-2" />
            <span className="text-sm">Add Product</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col h-20">
            <ShoppingCart className="h-6 w-6 mb-2" />
            <span className="text-sm">Process Orders</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col h-20">
            <FileText className="h-6 w-6 mb-2" />
            <span className="text-sm">Export Data</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col h-20">
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm">View Customers</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};