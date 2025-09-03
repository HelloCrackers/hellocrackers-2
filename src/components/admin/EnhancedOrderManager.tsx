import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupabase, Order } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, Edit, Trash2, Download, Search, Filter,
  CheckCircle, XCircle, Clock, Truck, DollarSign
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EnhancedOrderManager = () => {
  const { fetchOrders, updateOrderStatus, updateOrderPaymentStatus } = useSupabase();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      toast({ title: "Failed to load orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      await loadOrders();
      toast({ title: "Order status updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update order status", variant: "destructive" });
    }
  };

  const handlePaymentConfirmation = async (confirmed: boolean) => {
    if (!selectedOrder) return;

    try {
      await updateOrderPaymentStatus(selectedOrder.id, confirmed, adminNotes);
      await loadOrders();
      setShowPaymentDialog(false);
      setSelectedOrder(null);
      setAdminNotes("");
      toast({ 
        title: confirmed ? "Payment confirmed successfully" : "Payment marked as pending",
        description: confirmed ? "Customer will be notified of payment confirmation" : "Payment status updated"
      });
    } catch (error) {
      toast({ title: "Failed to update payment status", variant: "destructive" });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string, confirmed?: boolean) => {
    if (confirmed) return 'bg-green-100 text-green-800';
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">Manage orders and payment confirmations</p>
        </div>
        <Button variant="outline" onClick={loadOrders}>
          <Download className="h-4 w-4 mr-2" />
          Refresh Orders
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Search Orders</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by order number, customer name, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status-filter">Filter by Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold">Order Details</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Order Status</th>
                <th className="text-left p-4 font-semibold">Payment Status</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(order.items) ? order.items.length : 0} items
                      </p>
                      {order.challan_number && (
                        <p className="text-xs text-blue-600">Challan: {order.challan_number}</p>
                      )}
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
                    <p className="font-bold text-lg">₹{order.total_amount}</p>
                  </td>
                  
                  <td className="p-4">
                    <Select 
                      value={order.order_status}
                      onValueChange={(value) => handleUpdateStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(order.order_status)}>
                          {order.order_status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  
                  <td className="p-4">
                    <div className="space-y-2">
                      <Badge className={getPaymentStatusColor(order.payment_status, order.manual_payment_confirmed)}>
                        {order.manual_payment_confirmed ? 'Confirmed' : order.payment_status}
                      </Badge>
                      {order.payment_status === 'pending' && !order.manual_payment_confirmed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowPaymentDialog(true);
                          }}
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          Confirm Payment
                        </Button>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString()}</p>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found matching your criteria.</p>
          </div>
        )}
      </Card>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Payment Confirmation</DialogTitle>
            <DialogDescription>
              Confirm or reject payment for order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedOrder && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">Order Details</h4>
                <p>Customer: {selectedOrder.customer_name}</p>
                <p>Amount: ₹{selectedOrder.total_amount}</p>
                <p>Email: {selectedOrder.customer_email}</p>
                <p>Phone: {selectedOrder.customer_phone}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this payment confirmation..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handlePaymentConfirmation(false)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Mark as Pending
            </Button>
            <Button onClick={() => handlePaymentConfirmation(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};