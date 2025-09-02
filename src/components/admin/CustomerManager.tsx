import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSupabase, Customer } from "@/hooks/useSupabase";
import { Search, Download, Users, Mail, Phone } from "lucide-react";
import { exportToExcel } from "@/utils/fileProcessing";

export const CustomerManager = () => {
  const { fetchCustomers } = useSupabase();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await fetchCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleExport = () => {
    const exportData = customers.map(customer => ({
      'Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone,
      'Address': customer.address || 'N/A',
      'Total Orders': customer.total_orders,
      'Total Spent': customer.total_spent,
      'Status': customer.status,
      'Join Date': new Date(customer.created_at).toLocaleDateString()
    }));
    
    exportToExcel(exportData, 'customers_export', 'Customers');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Customers
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold">{customers.length}</p>
          <p className="text-sm text-muted-foreground">Total Customers</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="h-8 w-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Active Customers</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="h-8 w-8 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {customers.filter(c => c.total_orders > 0).length}
          </p>
          <p className="text-sm text-muted-foreground">Customers with Orders</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="h-8 w-8 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            ₹{Math.round(customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length || 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Avg Customer Value</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Customers List */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Orders</th>
                <th className="text-left p-4">Total Spent</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      {customer.address && (
                        <p className="text-sm text-muted-foreground truncate max-w-48">
                          {customer.address}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-48">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold">{customer.total_orders}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">
                      ₹{customer.total_spent.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={customer.status === 'active' ? 'default' : 'secondary'}
                      className={customer.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No customers found
          </div>
        )}
      </Card>
    </div>
  );
};