import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export const StickyOrderButton = () => {
  const { getCartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Order Now Button - Royal Purple - Smaller Size */}
      <Button 
        onClick={() => navigate('/products')}
        className="bg-[#7F00FF] hover:bg-[#6600CC] text-white shadow-lg rounded-full px-4 py-2 font-semibold text-sm transition-all duration-300 hover:scale-105"
        size="sm"
      >
        <Package className="h-4 w-4 mr-1" />
        Order Now
      </Button>
      
      {/* Cart Button with Enhanced Info - Smaller Size */}
      <Button 
        onClick={() => navigate('/cart')}
        variant="outline" 
        className="relative shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-105 bg-white border-2 border-[#7F00FF] hover:bg-[#7F00FF] hover:text-white min-w-[60px] flex flex-col items-center"
        size="sm"
      >
        <ShoppingCart className="h-4 w-4" />
        <div className="text-[10px] mt-1 flex flex-col items-center">
          <span className="font-medium">{cartCount}</span>
          {cartTotal > 0 && <span className="text-[8px]">₹{cartTotal}</span>}
        </div>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
            {cartCount}
          </span>
        )}
      </Button>
    </div>
  );
};