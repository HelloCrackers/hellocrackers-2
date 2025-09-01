import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Volume2 } from "lucide-react";
import familyCelebration from "@/assets/family-diwali-celebration.jpg";
import kidsCelebration from "@/assets/kids-celebration.jpg";
import adultCelebration from "@/assets/adult-celebration.jpg";
import familyVideo from "@/assets/family-diwali-video.jpg";
import kidsVideo from "@/assets/kids-sparklers-video.jpg";
import adultVideo from "@/assets/adult-fireworks-video.jpg";

// Mock celebration data with proper video and GIF assets
const celebrations = [
  {
    id: 1,
    type: "image",
    src: familyCelebration,
    title: "Family Diwali Celebration",
    category: "Family",
    description: "Joyful family celebrating with sparklers and diyas",
    duration: null
  },
  {
    id: 2,
    type: "gif",
    src: kidsCelebration,
    title: "Children's Sparkler Fun",
    category: "Kids", 
    description: "Kids safely enjoying sparklers with parents",
    duration: "5s loop"
  },
  {
    id: 3,
    type: "video",
    src: familyVideo,
    title: "Family Diwali Video",
    category: "Family",
    description: "Beautiful family celebration with sparklers and diyas",
    duration: "0:05"
  },
  {
    id: 4,
    type: "gif",
    src: adultCelebration,
    title: "Adult Fireworks GIF",
    category: "Adult",
    description: "Adults celebrating with premium fireworks display",
    duration: "5s loop"
  },
  {
    id: 5,
    type: "video",
    src: kidsVideo,
    title: "Kids Sparkler Video",
    category: "Kids",
    description: "Children safely enjoying sparklers with supervision",
    duration: "0:05"
  },
  {
    id: 6,
    type: "video",
    src: adultVideo,
    title: "Premium Fireworks Video",
    category: "Adult",
    description: "Professional fireworks display for adult celebrations",
    duration: "0:05"
  },
  {
    id: 7,
    type: "gif",
    src: familyCelebration,
    title: "Family Diya Lighting",
    category: "Family",
    description: "Traditional diya lighting ceremony",
    duration: "5s loop"
  },
  {
    id: 8,
    type: "image",
    src: adultCelebration,
    title: "Adult Premium Collection",
    category: "Adult",
    description: "Premium crackers for adult celebrations",
    duration: null
  }
];

export const CelebrationGallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const filters = ["All", "Family", "Kids", "Adult"];

  const filteredCelebrations = celebrations.filter(
    (item) => activeFilter === "All" || item.category === activeFilter
  );

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleMediaClick = (item: typeof celebrations[0]) => {
    if (item.type === "video") {
      setPlayingVideo(playingVideo === item.id ? null : item.id);
    } else if (item.type === "gif") {
      // For GIFs, show play animation
      setPlayingVideo(item.id);
      setTimeout(() => setPlayingVideo(null), 3000);
    }
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

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-gradient-festive text-white shadow-festive"
                  : "bg-white text-gray-600 hover:bg-brand-orange hover:text-white shadow-md"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Celebration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCelebrations.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden bg-white shadow-lg hover:shadow-celebration transition-all duration-300 transform hover:-translate-y-2">
              {/* Image/Video Container */}
              <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => handleMediaClick(item)}>
                <img
                  src={item.src}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    playingVideo === item.id ? 'scale-105' : 'group-hover:scale-110'
                  }`}
                />
                
                {/* Playing Animation Overlay */}
                {playingVideo === item.id && (
                  <div className="absolute inset-0 bg-black/30 animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item.type === "video" ? (
                        <div className="bg-brand-red/90 rounded-full p-6 animate-scale-in">
                          <Volume2 className="h-12 w-12 text-white" />
                        </div>
                      ) : (
                        <div className="bg-brand-gold/90 rounded-full p-6 animate-scale-in">
                          <Play className="h-12 w-12 text-black" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                  playingVideo === item.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {/* Play Button for Videos/GIFs */}
                  {(item.type === "video" || item.type === "gif") && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        favorites.includes(item.id) 
                          ? "text-red-500 fill-current" 
                          : "text-white"
                      }`} 
                    />
                  </button>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="secondary" 
                    className={`${
                      item.type === "gif" 
                        ? "bg-brand-gold text-black" 
                        : item.type === "video"
                        ? "bg-brand-orange text-white"
                        : "bg-brand-purple text-white"
                    } font-medium`}
                  >
                    {item.type.toUpperCase()}
                    {item.duration && ` ${item.duration}`}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className="border-brand-red text-brand-red"
                  >
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-brand-red transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <div className="space-y-4">
            <button className="bg-gradient-royal text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg">
              View More Celebrations
            </button>
            <div className="text-center">
              <label htmlFor="user-images" className="bg-gradient-festive text-white px-6 py-2 rounded-full font-medium cursor-pointer hover:opacity-90 transition-opacity shadow-md inline-block">
                Add Your Celebration Images
              </label>
              <input
                type="file"
                id="user-images"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                  const files = Array.from(e.target.files || []);
                  console.log("User uploaded files:", files);
                }}
              />
              <p className="text-sm text-gray-500 mt-2">Share your celebration moments with us!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};