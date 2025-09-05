import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export const EnhancedCartButton = () => {
  const { cart, cartTotal, getCartCount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState(false);
  const cartCount = getCartCount();

  const toggleQuickView = () => {
    setShowQuickView(!showQuickView);
  };

  if (cartCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={toggleQuickView}
            className="bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-red/80 hover:to-brand-orange/80 text-white shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <ShoppingCart className="h-6 w-6" />
            <div className="ml-2 flex flex-col items-start">
              <span className="text-sm font-bold">{cartCount} Items</span>
              <span className="text-xs">₹{cartTotal.toLocaleString()}</span>
            </div>
          </Button>
          
          {/* Cart Count Badge */}
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-none">
            {cartCount}
          </Badge>
        </div>
      </div>

      {/* Quick View Cart Overlay */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] bg-white rounded-t-2xl md:rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-brand-red to-brand-orange text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Your Cart ({cartCount})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleQuickView}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm opacity-90">Total: ₹{cartTotal.toLocaleString()}</p>
            </div>

            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.productCode} className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">₹{item.finalRate} × {item.quantity}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.productCode, item.quantity - 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.productCode, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productCode)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold">Total: ₹{cartTotal.toLocaleString()}</span>
                <Badge variant={cartTotal >= 3000 ? "default" : "destructive"}>
                  {cartTotal >= 3000 ? "Free Delivery" : `₹${3000 - cartTotal} for free delivery`}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/cart');
                    setShowQuickView(false);
                  }}
                >
                  View Cart
                </Button>
                <Button
                  onClick={() => {
                    navigate('/order');
                    setShowQuickView(false);
                  }}
                  className="bg-gradient-to-r from-brand-red to-brand-orange"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};