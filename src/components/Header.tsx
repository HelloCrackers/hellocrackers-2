import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, Sparkles, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import helloCrackersLogo from "@/assets/hello-crackers-logo.jpg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Auth and Cart hooks with error handling
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();

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
            <Link to="/" className="text-gray-700 hover:text-brand-red font-medium transition-colors" onClick={() => window.scrollTo(0, 0)}>
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-brand-red font-medium transition-colors" onClick={() => window.scrollTo(0, 0)}>
              Products
            </Link>
            <button onClick={() => {navigate('/price-list'); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Price List
            </button>
            <button onClick={() => {navigate('/track-order'); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Track Order
            </button>
            <button onClick={() => {navigate('/about'); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              About Us
            </button>
            <button onClick={() => {navigate('/contact'); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium transition-colors">
              Contact
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Cart Button with Count */}
            <Button
              variant="outline"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Button>

            {/* Auth Section - Only show for admins */}
            {isAuthenticated && isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/sk.admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-orange/20 py-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors" onClick={() => {setIsMenuOpen(false); window.scrollTo(0, 0);}}>
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors" onClick={() => {setIsMenuOpen(false); window.scrollTo(0, 0);}}>
                Products
              </Link>
              <button onClick={() => {navigate('/price-list'); setIsMenuOpen(false); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full">
                Price List
              </button>
              <button onClick={() => {navigate('/track-order'); setIsMenuOpen(false); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full">
                Track Order
              </button>
              <button onClick={() => {navigate('/about'); setIsMenuOpen(false); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full">
                About Us
              </button>
              <button onClick={() => {navigate('/contact'); setIsMenuOpen(false); window.scrollTo(0, 0);}} className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full">
                Contact
              </button>
              <button 
                className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full"
                onClick={() => {
                  navigate('/cart');
                  setIsMenuOpen(false);
                }}
              >
                Cart ({getCartCount()})
              </button>
              {/* Only show admin options for admins */}
              {isAuthenticated && isAdmin && (
                <>
                  <button 
                    className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full"
                    onClick={() => {
                      navigate('/sk.admin');
                      setIsMenuOpen(false);
                    }}
                  >
                    Admin Panel
                  </button>
                  <button 
                    className="text-gray-700 hover:text-brand-red font-medium py-2 transition-colors text-left w-full"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout ({user?.name})
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};