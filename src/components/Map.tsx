import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Hello Crackers location (example coordinates for Tamil Nadu)
  const storeLocation = {
    lng: 77.7567,
    lat: 11.1271,
    name: "Hello Crackers - Main Store",
    address: "Sivakasi, Tamil Nadu, India"
  };

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [storeLocation.lng, storeLocation.lat],
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add marker for store location
    const marker = new mapboxgl.Marker({
      color: '#ff6b35'
    })
      .setLngLat([storeLocation.lng, storeLocation.lat])
      .addTo(map.current);

    // Add popup to marker
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="p-3">
          <h3 class="font-bold text-lg text-orange-600">${storeLocation.name}</h3>
          <p class="text-gray-600 mt-1">${storeLocation.address}</p>
          <div class="mt-3 space-y-2">
            <p class="text-sm"><strong>Phone:</strong> +91 9042132123</p>
            <p class="text-sm"><strong>Hours:</strong> 9:00 AM - 7:00 PM</p>
          </div>
        </div>
      `);

    marker.setPopup(popup);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="bg-brand-orange/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <MapPin className="h-8 w-8 text-brand-orange" />
          </div>
          <h3 className="text-xl font-bold">Interactive Map Setup</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            To display the interactive map with our store location, please enter your Mapbox public token.
            You can get it from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">mapbox.com</a>
          </p>
          <div className="max-w-md mx-auto space-y-3">
            <Input
              type="password"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={handleTokenSubmit} className="w-full bg-brand-orange hover:bg-brand-orange/90">
              <Navigation className="h-4 w-4 mr-2" />
              Load Map
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Map */}
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-orange" />
            Our Location
          </h3>
          <div 
            ref={mapContainer} 
            className="w-full h-64 rounded-lg border-2 border-gray-200"
          />
        </Card>

        {/* Store Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Visit Our Store</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-brand-orange">Hello Crackers - Main Store</h4>
              <p className="text-gray-600">Sivakasi, Tamil Nadu, India</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>+91 9042132123, +91 9629088412</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>Hellocrackers.official@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hours:</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Days:</span>
                <span>Monday - Saturday</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h5 className="font-semibold mb-2">Directions</h5>
              <p className="text-sm text-gray-600">
                Located in the heart of Sivakasi, Tamil Nadu. 
                Free parking available. Follow GPS directions for exact location.
              </p>
            </div>

            <Button 
              onClick={() => window.open(`https://www.google.com/maps?q=${storeLocation.lat},${storeLocation.lng}`, '_blank')}
              className="w-full bg-brand-orange hover:bg-brand-orange/90"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Map;