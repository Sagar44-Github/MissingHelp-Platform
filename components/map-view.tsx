"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Info, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

// Define types for our missing person and leaflet map
type MissingPerson = {
  _id: string;
  name: string;
  age: number;
  description: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  status: "missing" | "found";
  photoUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type LeafletMapProps = {
  center: [number, number];
  zoom: number;
  markers: Array<{
    id: string;
    position: [number, number];
    name: string;
    location: string;
    status: "missing" | "found";
  }>;
  onMarkerClick: (id: string) => void;
};

// Dynamically import the Map component to avoid SSR issues with Leaflet
const LeafletMap = dynamic<LeafletMapProps>(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <Skeleton className="h-[600px] w-full" />
    </div>
  ),
});

// Global map configuration
const DEFAULT_CENTER = [20, 0]; // Center on the world map
const DEFAULT_ZOOM = 2;

export function MapView() {
  const { missingPersons } = useMissingPersons();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"global" | "regional" | "country">(
    "global"
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    DEFAULT_CENTER as [number, number]
  );
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // Find the selected person
  const selectedPerson = selectedMarker
    ? missingPersons.find((p: MissingPerson) => p._id === selectedMarker)
    : null;

  // Handle marker click
  const handleMarkerClick = (id: string) => {
    setSelectedMarker(id);
    const person = missingPersons.find((p: MissingPerson) => p._id === id);
    if (person) {
      setMapCenter([person.coordinates.lat, person.coordinates.lng]);
      setMapZoom(12); // Zoom in when a marker is selected
    }
  };

  // Reset map view
  const resetMapView = () => {
    setSelectedMarker(null);
    setMapCenter(DEFAULT_CENTER as [number, number]);
    setMapZoom(DEFAULT_ZOOM);
    setMapView("global");
  };

  // Change map view
  const changeMapView = (
    view: "global" | "regional" | "country",
    center: [number, number],
    zoom: number
  ) => {
    setMapView(view);
    setMapCenter(center);
    setMapZoom(zoom);
  };

  return (
    <div className="w-full h-full relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={resetMapView}
          className="bg-background"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Reset View
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="bg-background">
              Map View <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]">
            <div className="space-y-2">
              <Button
                size="sm"
                variant={mapView === "global" ? "default" : "outline"}
                className="w-full"
                onClick={() =>
                  changeMapView(
                    "global",
                    DEFAULT_CENTER as [number, number],
                    DEFAULT_ZOOM
                  )
                }
              >
                Global
              </Button>
              <Button
                size="sm"
                variant={mapView === "regional" ? "default" : "outline"}
                className="w-full"
                onClick={() => changeMapView("regional", [40, -95], 4)} // North America
              >
                North America
              </Button>
              <Button
                size="sm"
                variant={mapView === "regional" ? "default" : "outline"}
                className="w-full"
                onClick={() => changeMapView("regional", [48, 10], 4)} // Europe
              >
                Europe
              </Button>
              <Button
                size="sm"
                variant={mapView === "regional" ? "default" : "outline"}
                className="w-full"
                onClick={() => changeMapView("regional", [35, 105], 4)} // Asia
              >
                Asia
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Leaflet Map */}
      <LeafletMap
        center={mapCenter}
        zoom={mapZoom}
        markers={missingPersons.map((person: MissingPerson) => ({
          id: person._id,
          position: [person.coordinates.lat, person.coordinates.lng],
          name: person.name,
          location: person.lastSeenLocation,
          status: person.status,
        }))}
        onMarkerClick={handleMarkerClick}
      />

      {/* Selected Person Info Panel */}
      {selectedPerson && (
        <div className="absolute bottom-4 left-4 z-10 w-[350px]">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedPerson.name}</CardTitle>
                  <CardDescription>Age: {selectedPerson.age}</CardDescription>
                </div>
                <Badge
                  variant={
                    selectedPerson.status === "missing"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {selectedPerson.status === "missing" ? "Missing" : "Found"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex gap-3">
                <div className="w-1/3 relative h-[80px]">
                  <Image
                    src={selectedPerson.photoUrl}
                    alt={selectedPerson.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="w-2/3 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Last seen:</span>{" "}
                    {new Date().getDate() -
                      new Date(selectedPerson.lastSeenDate).getDate()}{" "}
                    days ago
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {selectedPerson.lastSeenLocation}
                  </p>
                  <p className="line-clamp-2">
                    <span className="font-medium">Description:</span>{" "}
                    {selectedPerson.description}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Link href={`/person/${selectedPerson._id}`} className="w-full">
                <Button variant="default" size="sm" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
