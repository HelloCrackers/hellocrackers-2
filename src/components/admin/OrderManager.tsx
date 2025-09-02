import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSupabase, Order } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Search, Package, Truck, CheckCircle, Factory, Eye, Edit } from "lucide-react";
import { exportToExcel } from "@/utils/fileProcessing";

export const OrderManager = () => {
  const { fetchOrders, updateOrderStatus } = useSupabase();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [trackingNotes, setTrackingNotes] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || order.order_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (order: Order, newStatus: Order['order_status']) => {
    const result = await updateOrderStatus(order.id, newStatus, trackingNotes);
    if (result) {
      await loadOrders();
      setEditingOrder(null);
      setTrackingNotes("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'factory': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-orange-100 text-orange-800';
      case 'transport': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'factory': return <Factory className="h-4 w-4" />;
      case 'dispatched': return <Package className="h-4 w-4" />;
      case 'transport': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const handleExport = () => {
    const exportData = orders.map(order => ({
      'Order Number': order.order_number,
      'Challan Number': order.challan_number || 'N/A',
      'Customer Name': order.customer_name,
      'Customer Email': order.customer_email,
      'Customer Phone': order.customer_phone,
      'Total Amount': order.total_amount,
      'Payment Status': order.payment_status,
      'Order Status': order.order_status,
      'Date': new Date(order.created_at).toLocaleDateString(),
      'Tracking Notes': order.tracking_notes || ''
    }));
    
    exportToExcel(exportData, 'orders_export', 'Orders');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button variant="outline" onClick={handleExport}>
          <Package className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="factory">Factory</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders List */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Order Details</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Tracking</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{order.order_number}</p>
                      {order.challan_number && (
                        <p className="text-sm text-muted-foreground">
                          Challan: {order.challan_number}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        {order.payment_status}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold">₹{order.total_amount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(order.order_status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.order_status)}
                        {order.order_status.toUpperCase()}
                      </span>
                    </Badge>
                  </td>
                  <td className="p-4">
                    {order.tracking_notes ? (
                      <div className="max-w-32">
                        <p className="text-sm truncate">{order.tracking_notes}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Status Update Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Update Order Status - {editingOrder.order_number}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Current Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(editingOrder.order_status)}>
                      {editingOrder.order_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>New Status</Label>
                  <div className="mt-2 space-y-2">
                    {['confirmed', 'factory', 'dispatched', 'transport', 'delivered'].map(status => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        className="mr-2 mb-2"
                        onClick={() => handleStatusUpdate(editingOrder, status as Order['order_status'])}
                        disabled={loading}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(status)}
                          {status.toUpperCase()}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tracking_notes">Tracking Notes</Label>
                  <Textarea
                    id="tracking_notes"
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    placeholder="Add tracking notes..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingOrder(null);
                    setTrackingNotes("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};