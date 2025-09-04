import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export const PasswordManager = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    const success = await changePassword(formData.currentPassword, formData.newPassword);
    if (success) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    setIsLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your account password. Make sure to use a strong password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
        
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Password Requirements:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• At least 6 characters long</li>
            <li>• Use a combination of letters and numbers</li>
            <li>• Avoid using personal information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};