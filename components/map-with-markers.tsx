"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import { MissingPerson } from "@/types/missing-person";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Marker for missing persons
const MissingPersonMarker = L.icon({
  iconUrl: "/marker-red.png",
  iconRetinaUrl: "/marker-red-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Marker for found persons
const FoundPersonMarker = L.icon({
  iconUrl: "/marker-green.png",
  iconRetinaUrl: "/marker-green-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface MapWithMarkersProps {
  persons: MissingPerson[];
  selectedPerson: MissingPerson | null;
  onMarkerClick: (person: MissingPerson) => void;
  mapTheme?: "light" | "dark";
}

export default function MapWithMarkers({
  persons,
  selectedPerson,
  onMarkerClick,
  mapTheme = "light",
}: MapWithMarkersProps) {
  const [mapElement, setMapElement] = useState<HTMLElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Generate a unique ID for this instance
  const instanceId = useRef(
    `map-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );

  // Set map center
  const defaultCenter: [number, number] = [40.7128, -74.006]; // New York by default
  const center = selectedPerson
    ? ([selectedPerson.coordinates.lat, selectedPerson.coordinates.lng] as [
        number,
        number
      ])
    : defaultCenter;

  // Choose the appropriate map style based on theme
  const tileUrl =
    mapTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    mapTheme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

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
          zoom: 3,
        });

        // Add the tile layer
        L.tileLayer(tileUrl, {
          attribution,
          maxZoom: 19,
        }).addTo(map);

        // Add markers
        persons.forEach((person) => {
          const marker = L.marker(
            [person.coordinates.lat, person.coordinates.lng],
            {
              icon:
                person.status === "missing"
                  ? MissingPersonMarker
                  : FoundPersonMarker,
              title: person.name,
            }
          );

          // Add popup
          marker.bindPopup(`
            <div class="text-center">
              <strong>${person.name}</strong><br />
              Age: ${person.age}<br />
              <span class="${
                person.status === "missing" ? "text-red-500" : "text-green-500"
              }">
                ${person.status === "missing" ? "Missing" : "Found"}
              </span>
              <div class="mt-2">
                <img 
                  src="${person.photoUrl}" 
                  alt="${person.name}" 
                  style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; margin: 0 auto;"
                />
              </div>
            </div>
          `);

          // Add click handler
          marker.on("click", () => onMarkerClick(person));

          // Add marker to map
          marker.addTo(map);
        });

        // Handle selected person
        if (selectedPerson) {
          map.flyTo(
            [selectedPerson.coordinates.lat, selectedPerson.coordinates.lng],
            13,
            { animate: true, duration: 1 }
          );
        }

        // Store map reference
        mapRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 50);
  }, [
    mapElement,
    center,
    tileUrl,
    attribution,
    persons,
    selectedPerson,
    onMarkerClick,
  ]);

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
