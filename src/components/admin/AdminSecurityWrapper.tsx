import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
}

export const AdminSecurityWrapper: React.FC<AdminSecurityWrapperProps> = ({ children }) => {
  const { user, isAdmin, login, logout } = useAuth();
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  useEffect(() => {
    // Check for HTTPS in production
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      toast({
        title: "Security Warning",
        description: "Admin panel should be accessed via HTTPS for security",
        variant: "destructive",
      });
    }

    // Set session expiry (4 hours)
    if (user && isAdmin) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 4);
      setSessionExpiry(expiry);
    }
  }, [user, isAdmin, toast]);

  useEffect(() => {
    // Auto logout on session expiry
    if (sessionExpiry && new Date() > sessionExpiry) {
      toast({
        title: "Session Expired",
        description: "Please login again for security",
        variant: "destructive",
      });
      logout();
    }
  }, [sessionExpiry, logout, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (!success) {
        setError('Invalid credentials or insufficient permissions');
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        });
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been safely logged out",
    });
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Secure login required for admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="Enter admin email"
                  required
                  className="transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter admin password"
                  required
                  className="transition-all duration-200"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Secure Login
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Protected by enterprise-grade security</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session Status Bar */}
      <div className="bg-primary text-primary-foreground px-4 py-2 text-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Admin Session Active - {user.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {sessionExpiry && (
            <span className="text-xs opacity-75">
              Session expires: {sessionExpiry.toLocaleTimeString()}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
          >
            Logout
          </Button>
        </div>
      </div>
      
      {children}
    </div>
  );
};