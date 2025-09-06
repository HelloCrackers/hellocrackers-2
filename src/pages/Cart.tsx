import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, checkMinimumOrder } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMinOrderDialog, setShowMinOrderDialog] = useState(false);

  const handleCheckout = () => {
    if (!checkMinimumOrder()) {
      setShowMinOrderDialog(true);
      return;
    }
    navigate('/billing');
  };

  const handleQuantityChange = (productCode: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productCode, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <section className="bg-gradient-festive text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
              <p className="text-xl text-white/90">Review your selected crackers</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <Card className="p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some amazing crackers to get started!</p>
            <Button onClick={() => navigate('/products')} className="bg-gradient-festive text-white">
              Browse Products
            </Button>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-festive text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
            <p className="text-xl text-white/90">Review your selected crackers</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.productCode} className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.productName}</h3>
                        <Badge
                          className={`${
                            item.userFor === "Family" ? "bg-brand-gold text-black" :
                            item.userFor === "Adult" ? "bg-brand-red text-white" :
                            "bg-brand-purple text-white"
                          } mt-1`}
                        >
                          {item.userFor}
                        </Badge>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productCode)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.productCode, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productCode, parseInt(e.target.value) || 1)}
                          className="w-20 text-center"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.productCode, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">₹{item.finalRate} each</p>
                        <p className="font-bold text-lg text-brand-red">
                          ₹{(item.finalRate * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="bg-gradient-festive text-white p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total Items:</span>
                  <span className="text-xl font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand-red">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {!checkMinimumOrder() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Minimum order: ₹3,000</strong><br />
                    Add ₹{(3000 - cartTotal).toLocaleString()} more to proceed
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    clearCart();
                    navigate('/products');
                  }}
                  className="w-full border-red-500 text-red-500 hover:bg-red-50"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-festive text-white font-semibold py-3"
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Minimum Order Dialog */}
      <AlertDialog open={showMinOrderDialog} onOpenChange={setShowMinOrderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-brand-red">Hello Crackers</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Dear Customer, the minimum order value is ₹3000. Kindly add more items to proceed with your order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowMinOrderDialog(false);
                navigate('/products');
              }}
              className="bg-gradient-festive text-white"
            >
              Add More Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}