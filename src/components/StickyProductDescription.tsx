import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Package, Shield, Truck } from 'lucide-react';

interface StickyProductDescriptionProps {
  selectedProduct?: {
    product_code: string;
    product_name: string;
    category: string;
    user_for: string;
    description?: string;
    final_rate: number;
    mrp: number;
    discount: number;
    rating?: number;
    reviews_count?: number;
    image_url?: string;
  } | null;
  className?: string;
}

export const StickyProductDescription = ({ selectedProduct, className = "" }: StickyProductDescriptionProps) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!selectedProduct) {
    return (
      <Card className={`${className} ${isSticky ? 'fixed top-4 right-4 z-50 w-80' : 'relative'} p-4 bg-gradient-to-r from-brand-gold/10 to-brand-orange/10 border-brand-orange/20`}>
        <div className="text-center text-gray-500">
          <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Click on any product to view details here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isSticky ? 'fixed top-4 right-4 z-50 w-80 shadow-xl' : 'relative'} p-4 bg-white border transition-all duration-300`}>
      <div className="space-y-3">
        {/* Product Header */}
        <div className="flex items-start gap-3">
          {selectedProduct.image_url && (
            <img 
              src={selectedProduct.image_url} 
              alt={selectedProduct.product_name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="border-brand-red text-brand-red mb-1">
              {selectedProduct.product_code}
            </Badge>
            <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
              {selectedProduct.product_name}
            </h4>
          </div>
        </div>

        {/* Category & User Type */}
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedProduct.category}
          </Badge>
          <Badge 
            className={`text-xs ${
              selectedProduct.user_for === "Family" ? "bg-brand-gold text-black" :
              selectedProduct.user_for === "Adult" ? "bg-brand-red text-white" :
              "bg-brand-purple text-white"
            }`}
          >
            {selectedProduct.user_for}
          </Badge>
        </div>

        {/* Rating */}
        {selectedProduct.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {selectedProduct.rating} ({selectedProduct.reviews_count || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-red">₹{selectedProduct.final_rate}</span>
            <span className="text-sm text-gray-500 line-through">₹{selectedProduct.mrp}</span>
          </div>
          <Badge className="bg-brand-orange text-white text-xs">
            {selectedProduct.discount}% OFF
          </Badge>
        </div>

        {/* Description */}
        {selectedProduct.description && (
          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
            <p className="line-clamp-3">{selectedProduct.description}</p>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Shield className="h-3 w-3 text-green-600" />
            <span>SC Compliant</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Truck className="h-3 w-3 text-blue-600" />
            <span>Free Delivery</span>
          </div>
        </div>

        {isSticky && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 text-center">
              Product Details • Scroll to see more
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};