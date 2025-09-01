import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react";
import helloCrackersLogo from "@/assets/hello-crackers-logo.jpg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-orange/20 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top Banner */}
        <div className="bg-gradient-festive text-white text-center py-2 text-sm font-medium animate-glow">
          🎆 Direct Factory Outlet - Celebrate with 90% OFF! 🎆
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={helloCrackersLogo} 
              alt="Hello Crackers" 
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Hello Crackers
              </h1>
              <p className="text-xs text-brand-orange font-medium">Direct Factory Outlet</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Products
            </Link>
            <button onClick={() => navigate('/price-list')} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Price List
            </button>
            <button onClick={() => navigate('/track-order')} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Track Order
            </button>
            <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              About Us
            </button>
            <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Contact
            </button>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <Button variant="cart" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Cart</span>
              <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-orange/20 py-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors" onClick={toggleMenu}>
                Products
              </Link>
              <button onClick={() => {navigate('/price-list'); toggleMenu();}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left">
                Price List
              </button>
              <button onClick={() => {navigate('/track-order'); toggleMenu();}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left">
                Track Order
              </button>
              <button onClick={() => {navigate('/about'); toggleMenu();}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left">
                About Us
              </button>
              <button onClick={() => {navigate('/contact'); toggleMenu();}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left">
                Contact
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};