import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Bell } from "lucide-react";
import { useSupabase, Category } from "@/hooks/useSupabase";

export const CategoryNotification = () => {
  const { fetchCategories } = useSupabase();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      const activeCategories = data.filter(cat => cat.status === 'active');
      setCategories(activeCategories);
      
      // Show notification if there are active categories and not dismissed
      if (activeCategories.length > 0 && !dismissed) {
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
    setDismissed(true);
    // Store dismissal in localStorage
    localStorage.setItem('categoryNotificationDismissed', 'true');
  };

  useEffect(() => {
    // Check if user has dismissed the notification before
    const wasDismissed = localStorage.getItem('categoryNotificationDismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  if (!showNotification || categories.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 bg-gradient-festive text-white shadow-2xl border-0">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Category Updates</h4>
            <p className="text-sm text-white/90 mb-3">
              New product categories have been added! Check out our latest offerings:
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {categories.slice(0, 3).map((category) => (
                <Badge 
                  key={category.id} 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30"
                >
                  {category.name}
                </Badge>
              ))}
              {categories.length > 3 && (
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30"
                >
                  +{categories.length - 3} more
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-white/75">
              These categories are now available for browsing on our product pages.
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};