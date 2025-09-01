import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export const StickyOrderButton = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Order Now Button */}
      <Button 
        onClick={() => navigate('/products')}
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-2xl rounded-full px-6 py-4 font-bold text-lg transition-all duration-300 hover:scale-105"
        size="lg"
      >
        <Package className="h-6 w-6 mr-2" />
        Order Now
      </Button>
      
      {/* Cart Button */}
      <Button 
        onClick={() => navigate('/cart')}
        variant="cart" 
        className="relative shadow-2xl rounded-full p-4 transition-all duration-300 hover:scale-105"
        size="lg"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </Button>
    </div>
  );
};