import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { Upload, Image, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageCategory {
  id: string;
  name: string;
  description: string;
  folder: string;
}

const imageCategories: ImageCategory[] = [
  {
    id: "transport",
    name: "Transport Images",
    description: "Images for transport and delivery section",
    folder: "transport"
  },
  {
    id: "homepage",
    name: "Homepage Images",
    description: "Hero images and banners for homepage",
    folder: "homepage"
  },
  {
    id: "giftbox",
    name: "Gift Box Images",
    description: "Images for gift box products",
    folder: "giftbox"
  },
  {
    id: "templates",
    name: "Template Images",
    description: "Images for various templates",
    folder: "templates"
  }
];

export const ImageUploadManager = () => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedImages, setUploadedImages] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { uploadFile } = useSupabase();

  const handleFileUpload = async (file: File, category: ImageCategory) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setUploading(prev => ({ ...prev, [category.id]: true }));

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { success, url } = await uploadFile('content', `${category.folder}/${fileName}`, file);

      if (success && url) {
        setUploadedImages(prev => ({
          ...prev,
          [category.id]: [...(prev[category.id] || []), url]
        }));

        toast({
          title: "Upload successful",
          description: `Image uploaded to ${category.name}`,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [category.id]: false }));
    }
  };

  const removeImage = (categoryId: string, imageUrl: string) => {
    setUploadedImages(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(url => url !== imageUrl)
    }));
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Image URL copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Upload Manager</CardTitle>
        <CardDescription>
          Upload and manage images for different sections of your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={imageCategories[0].id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {imageCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {imageCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>

              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor={`file-${category.id}`} className="cursor-pointer">
                      <div className="flex items-center justify-center">
                        <Upload className="h-5 w-5 mr-2" />
                        {uploading[category.id] ? 'Uploading...' : 'Choose image file'}
                      </div>
                    </Label>
                    <Input
                      id={`file-${category.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, category);
                        }
                      }}
                      disabled={uploading[category.id]}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {/* Uploaded Images */}
              {uploadedImages[category.id] && uploadedImages[category.id].length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Uploaded Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages[category.id].map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyImageUrl(imageUrl)}
                              className="text-white border-white hover:bg-white hover:text-black"
                            >
                              Copy URL
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(category.id, imageUrl)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};