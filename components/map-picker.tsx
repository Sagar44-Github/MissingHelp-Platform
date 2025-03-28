"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import L from "leaflet";

type Coordinates = {
  lat: number;
  lng: number;
};

// Dynamically import the Map component to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center bg-muted">
      <Skeleton className="h-[300px] w-full" />
    </div>
  ),
});

interface MapPickerProps {
  initialLocation?: Coordinates;
  onLocationChange?: (location: Coordinates) => void;
}

export function MapPicker({
  initialLocation,
  onLocationChange,
}: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    initialLocation ? initialLocation : null
  );

  // Update selected location when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  // Inject Leaflet CSS
  useEffect(() => {
    // Only add the CSS if it hasn't been added already
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // Handle location selection
  const handleLocationSelect = (location: Coordinates) => {
    setSelectedLocation(location);
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  return (
    <Card className="w-full h-[300px] relative overflow-hidden">
      {/* Leaflet Map */}
      <LocationPicker
        initialLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
      />

      {/* Selected Location Badge */}
      {selectedLocation && (
        <div className="absolute bottom-2 left-2 z-50">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm shadow-md"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </Badge>
        </div>
      )}
    </Card>
  );
}
