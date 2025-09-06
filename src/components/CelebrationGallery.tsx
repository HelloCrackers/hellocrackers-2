import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import familyCelebrationHero from "@/assets/family-celebration-hero.jpg";
import kidsCelebrationHero from "@/assets/kids-celebration-hero.jpg";
import adultsCelebrationHero from "@/assets/adults-celebration-hero.jpg";

export const CelebrationGallery = () => {
  const { isAdmin } = useAuth();
  const [userImages, setUserImages] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const celebrations = [
    {
      title: "Family Celebration",
      image: familyCelebrationHero,
      description: "Create magical moments with your loved ones using our premium family crackers collection."
    },
    {
      title: "Kids Special", 
      image: kidsCelebrationHero,
      description: "Safe and colorful crackers designed specifically for children's enjoyment and safety."
    },
    {
      title: "Adults Premium",
      image: adultsCelebrationHero,
      description: "Sophisticated fireworks for adult celebrations and grand festival displays."
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUserImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUserImage = (index: number) => {
    setUserImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-festive bg-clip-text text-transparent">
            Celebration Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the joy of Diwali with families, children, and adults celebrating safely with our premium crackers
          </p>
        </div>

        {/* Celebration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {celebrations.map((celebration, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <img 
                  src={celebration.image} 
                  alt={celebration.title}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{celebration.title}</h3>
                  <p className="text-gray-600">{celebration.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Uploaded Images - Admin Only */}
        {isAdmin && userImages.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-6">User Uploaded Celebrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userImages.map((image, index) => (
                <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0 relative">
                    <img 
                      src={image} 
                      alt={`User celebration ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeUserImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center space-y-4 mt-8">
          {isAdmin && (
            <div className="mb-4">
              {!showImageUpload ? (
                <Button 
                  onClick={() => setShowImageUpload(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white mr-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User Images (Admin Only)
                </Button>
              ) : (
                <Card className="max-w-md mx-auto p-4">
                  <div className="space-y-4">
                    <Label htmlFor="image-upload">Upload Celebration Images</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setShowImageUpload(false)} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
          
          <Button 
            size="lg"
            onClick={() => window.location.href = '/products'}
            className="bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-orange hover:to-brand-red text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            View More Celebrations
          </Button>
        </div>
      </div>
    </section>
  );
};