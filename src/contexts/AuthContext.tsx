import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Force rebuild - Auth Context with user management

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo - in production, this would connect to Supabase
const mockUsers = [
  { id: '1', email: 'admin@hellocrackers.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { id: '2', email: 'customer@test.com', password: 'customer123', name: 'Test Customer', role: 'customer' as const },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hellocrackers_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('hellocrackers_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const authUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };
      
      setUser(authUser);
      localStorage.setItem('hellocrackers_user', JSON.stringify(authUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      toast({
        title: "Signup Failed",
        description: "User with this email already exists.",
        variant: "destructive",
      });
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'customer' as const,
    };

    mockUsers.push(newUser);

    const authUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    setUser(authUser);
    localStorage.setItem('hellocrackers_user', JSON.stringify(authUser));

    toast({
      title: "Signup Successful",
      description: `Welcome, ${name}!`,
    });

    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      // In a real app, this would send an email with reset link
      // For demo purposes, we'll just show a success message
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      return true;
    } else {
      toast({
        title: "Email Not Found",
        description: "No account found with this email address.",
        variant: "destructive",
      });
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password.",
        variant: "destructive",
      });
      return false;
    }

    const foundUser = mockUsers.find(u => u.email === user.email && u.password === currentPassword);
    
    if (foundUser) {
      // Update password in mock users array
      foundUser.password = newPassword;
      
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      return true;
    } else {
      toast({
        title: "Invalid Password",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hellocrackers_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        resetPassword,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};