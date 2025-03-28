"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationPickerProps = {
  initialLocation: Coordinates | null;
  onLocationSelect: (location: Coordinates) => void;
};

// Component to handle map clicks
function LocationMarker({
  position,
  setPosition,
}: {
  position: Coordinates | null;
  setPosition: (position: Coordinates) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPosition);
      // Optional: You can also center the map on the clicked position
      // map.flyTo(e.latlng, map.getZoom())
    },
  });

  // Fix Leaflet icon issue
  useEffect(() => {
    // Fix for the missing Leaflet marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });
  }, []);

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]} />
  );
}

export default function LocationPicker({
  initialLocation,
  onLocationSelect,
}: LocationPickerProps) {
  const [position, setPosition] = useState<Coordinates | null>(initialLocation);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [40, -95] // Default to USA
  );
  const zoom = 4;

  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
      setMapCenter([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  const handlePositionChange = (newPosition: Coordinates) => {
    setPosition(newPosition);
    onLocationSelect(newPosition);
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={handlePositionChange} />
    </MapContainer>
  );
}
