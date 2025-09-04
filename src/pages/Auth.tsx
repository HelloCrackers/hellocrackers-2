import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [resetForm, setResetForm] = useState({ email: '' });
  const [changeEmailForm, setChangeEmailForm] = useState({ currentPassword: '', newEmail: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, resetPassword, changeEmail, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    const success = await signup(signupForm.email, signupForm.password, signupForm.name);
    if (success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await resetPassword(resetForm.email);
    
    setIsLoading(false);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await changeEmail(changeEmailForm.currentPassword, changeEmailForm.newEmail);
    if (success) {
      setChangeEmailForm({ currentPassword: '', newEmail: '' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="reset">Reset Password</TabsTrigger>
              <TabsTrigger value="change-email">Change Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Welcome back to Hello Crackers! Sign in to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    
                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-sm text-primary"
                        onClick={() => {
                          const tabsList = document.querySelector('[role="tablist"]');
                          const resetTab = tabsList?.querySelector('[value="reset"]') as HTMLElement;
                          resetTab?.click();
                        }}
                      >
                        Forgot your password?
                      </Button>
                    </div>
                    
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Demo Credentials:</p>
                      <p className="text-xs text-muted-foreground">
                        Admin: admin@hellocrackers.com / admin123<br />
                        Customer: customer@test.com / customer123
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>
                    Create a new account to start shopping with Hello Crackers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reset">
              <Card>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email address and we'll send you instructions to reset your password.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="your@email.com"
                        value={resetForm.email}
                        onChange={(e) => setResetForm({ email: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
                    </Button>
                    
                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-sm text-primary"
                        onClick={() => {
                          const tabsList = document.querySelector('[role="tablist"]');
                          const loginTab = tabsList?.querySelector('[value="login"]') as HTMLElement;
                          loginTab?.click();
                        }}
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="change-email">
              <Card>
                <CardHeader>
                  <CardTitle>Change Email</CardTitle>
                  <CardDescription>
                    {user ? `Current email: ${user.email}` : 'Please sign in to change your email address.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <form onSubmit={handleChangeEmail} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Enter your current password"
                          value={changeEmailForm.currentPassword}
                          onChange={(e) => setChangeEmailForm({ ...changeEmailForm, currentPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">New Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="Enter your new email"
                          value={changeEmailForm.newEmail}
                          onChange={(e) => setChangeEmailForm({ ...changeEmailForm, newEmail: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Changing Email...' : 'Change Email'}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">Please sign in to change your email address.</p>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          const tabsList = document.querySelector('[role="tablist"]');
                          const loginTab = tabsList?.querySelector('[value="login"]') as HTMLElement;
                          loginTab?.click();
                        }}
                      >
                        Go to Sign In
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;