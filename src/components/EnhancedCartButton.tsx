import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export const EnhancedCartButton = () => {
  const { cartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleCartClick = () => {
    navigate('/cart');
  };

  if (cartCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={handleCartClick}
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

    </>
  );
};