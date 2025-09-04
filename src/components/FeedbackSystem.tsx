import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, User, MessageSquare, ThumbsUp } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const FeedbackSystem = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: ""
  });


  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Amazing quality crackers at unbeatable prices! 90% OFF is genuine. My family had the best Diwali ever.",
      date: "2024-11-15",
      verified: true
    },
    {
      id: "2", 
      name: "Priya Sharma",
      rating: 5,
      comment: "Supreme Court compliant crackers with excellent packaging. Delivery was on time and professional.",
      date: "2024-11-12",
      verified: true
    },
    {
      id: "3",
      name: "Anand Raj",
      rating: 4,
      comment: "Good variety of crackers for all age groups. Kids loved the sparklers and adults enjoyed the fancy ones.",
      date: "2024-11-10", 
      verified: true
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add new feedback to the list
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      name: formData.name,
      rating: rating,
      comment: formData.comment,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };
    
    setFeedbacks(prev => [newFeedback, ...prev]);
    
    console.log("Feedback submitted:", { ...formData, rating });
    // Reset form
    setFormData({ name: "", email: "", comment: "" });
    setRating(0);
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            starValue <= (interactive ? (hoveredRating || rating) : currentRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Feedback Form */}
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Share Your Experience</h2>
          <p className="text-gray-600">
            Your feedback helps us serve you better. Rate your experience out of 5 stars.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center gap-1">
              {renderStars(rating, true)}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Comments *
            </label>
            <Textarea
              required
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with Hello Crackers - quality, delivery, service, etc."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-festive text-white hover:opacity-90"
            disabled={rating === 0}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </form>
      </Card>

      {/* Customer Reviews */}
      <Card className="p-8" data-reviews-section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(5)}
              <span className="ml-2 font-semibold">4.8/5</span>
            </div>
            <span className="text-gray-600">Based on {feedbacks.length}+ reviews</span>
          </div>
        </div>

        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-orange/10 rounded-full p-2">
                    <User className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{feedback.name}</h4>
                      {feedback.verified && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          ✓ Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(feedback.rating)}
                      <span className="text-sm text-gray-500">{feedback.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
              <div className="flex items-center gap-4 mt-3">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline">
            Load More Reviews
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-500"
            onClick={() => {
              // Move reviews section up
              const reviewsSection = document.querySelector('[data-reviews-section]');
              if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Move to Top
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackSystem;