"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

// Custom marker for missing persons
const createCustomMarker = (status: "active" | "found" | "missing") => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="h-6 w-6 rounded-full bg-${
      status === "active" || status === "missing" ? "red-500" : "green-500"
    } flex items-center justify-center text-white shadow-lg border-2 border-white">
      <span class="h-2 w-2 rounded-full bg-white"></span>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

type MarkerData = {
  id: string;
  position: [number, number];
  name: string;
  location: string;
  status: "active" | "found" | "missing";
};

type LeafletMapProps = {
  center: [number, number];
  zoom: number;
  markers: MarkerData[];
  onMarkerClick: (id: string) => void;
};

export default function LeafletMap({
  center,
  zoom,
  markers,
  onMarkerClick,
}: LeafletMapProps) {
  const [mapElement, setMapElement] = useState<HTMLElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Generate a unique ID for this instance
  const instanceId = useRef(
    `map-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );

  // Function to initialize the map
  const initializeMap = useCallback(() => {
    if (!mapElement) return;

    // Make sure to destroy any existing map first
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create the map (with a slight delay to ensure DOM ready)
    setTimeout(() => {
      try {
        const map = L.map(mapElement, {
          center,
          zoom,
          zoomControl: false,
        });

        // Add the tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add markers
        markers.forEach((marker) => {
          const leafletMarker = L.marker(marker.position, {
            icon: createCustomMarker(marker.status),
            title: marker.name,
          });

          // Add popup with proper HTML
          leafletMarker.bindPopup(`
            <div class="p-1">
              <div class="flex items-center justify-between">
                <h3 class="font-medium">${marker.name}</h3>
                <span class="text-xs px-2 py-1 rounded-full bg-${
                  marker.status === "active" || marker.status === "missing"
                    ? "red-100 text-red-800"
                    : "green-100 text-green-800"
                }">
                  ${
                    marker.status === "active" || marker.status === "missing"
                      ? "Missing"
                      : "Found"
                  }
                </span>
              </div>
              <p class="text-xs text-gray-500">
                ${marker.location}
              </p>
            </div>
          `);

          // Add click handler
          leafletMarker.on("click", () => onMarkerClick(marker.id));

          // Add marker to map
          leafletMarker.addTo(map);
        });

        // Store map reference
        mapRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 50);
  }, [mapElement, center, zoom, markers, onMarkerClick]);

  // Initialize map when element is set
  useEffect(() => {
    if (mapElement) {
      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapElement, initializeMap]);

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Handle reference to map DOM element
  const setMapContainer = useCallback((element: HTMLDivElement | null) => {
    setMapElement(element);
  }, []);

  return (
    <div className="w-full h-full relative">
      <div
        id={instanceId.current}
        ref={setMapContainer}
        className="w-full h-full"
      />
    </div>
  );
}
