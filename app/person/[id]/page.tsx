"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  ArrowLeft,
  AlertTriangle,
  Check,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import("@/components/map-with-markers"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center bg-muted">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const { missingPersons, updateMissingPerson } = useMissingPersons();
  const [person, setPerson] = useState<MissingPerson | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const { theme } = useTheme();

  // Create a unique map key to ensure proper initialization/cleanup
  const mapKey = `person-map-${theme}-${person?._id || "none"}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  useEffect(() => {
    if (params.id) {
      const foundPerson = missingPersons.find((p) => p._id === params.id);
      if (foundPerson) {
        setPerson(foundPerson);
      }
    }
  }, [params.id, missingPersons]);

  useEffect(() => {
    // Clear person data when component unmounts to prevent stale references
    return () => {
      setPerson(null);
    };
  }, []);

  if (!person) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Person Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The person you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/map")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    setIsStatusUpdating(true);
    try {
      // Update status to the opposite of current status
      const newStatus = person.status === "missing" ? "found" : "missing";
      const updatedData = {
        ...person,
        status: newStatus,
        updatedAt: new Date(),
      };

      // If the person is now found, add found date and location
      if (newStatus === "found") {
        updatedData.foundDate = new Date();
        updatedData.foundLocation = "Reported via website";
      }

      await updateMissingPerson(person._id, updatedData);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsStatusUpdating(false);
    }
  };

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate report date (using createdAt)
  const reportDate = formatDate(person.createdAt);
  const lastSeenDate = formatDate(person.lastSeenDate);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Image and key details */}
            <div className="w-full md:w-1/3 space-y-6">
              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={person.photoUrl}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={
                          person.status === "missing"
                            ? "destructive"
                            : "outline"
                        }
                        className="px-3 py-1 text-sm font-medium shadow-sm"
                      >
                        {person.status === "missing" ? "Missing" : "Found Safe"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Share This Case</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                  >
                    <Twitter className="h-5 w-5 text-sky-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                  >
                    <Instagram className="h-5 w-5 text-rose-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Button
                    variant={
                      person.status === "missing" ? "destructive" : "outline"
                    }
                    className="w-full justify-start"
                    disabled={isStatusUpdating}
                    onClick={handleStatusUpdate}
                  >
                    {isStatusUpdating ? (
                      <>Loading...</>
                    ) : person.status === "missing" ? (
                      <>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Report Sighting
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Missing Again
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Authorities
                  </Button>
                </div>
              </div>
            </div>

            {/* Right column - Details */}
            <div className="w-full md:w-2/3">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">
                      Case #{person._id.substring(0, 8)}
                    </Badge>
                    <Badge variant="outline">
                      {person.region || "Unknown"}
                    </Badge>
                    <Badge variant="secondary">Report Date: {reportDate}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold">{person.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{person.age} years old</span>
                    <span>•</span>
                    <span>{person.gender}</span>
                  </div>
                </div>

                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-6">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-3">
                            Physical Description
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {person.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">Last Seen Date</p>
                                <p className="text-muted-foreground">
                                  {lastSeenDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">
                                  Last Seen Location
                                </p>
                                <p className="text-muted-foreground">
                                  {person.lastSeenLocation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {person.status === "found" && (
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-3">
                              <Check className="inline-block mr-2 h-5 w-5 text-green-500" />
                              Found Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">Date Found</p>
                                  <p className="text-muted-foreground">
                                    {formatDate(person.foundDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">Location Found</p>
                                  <p className="text-muted-foreground">
                                    {person.foundLocation || "Not specified"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="pt-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4">
                          Last Known Location
                        </h3>
                        <div className="rounded-lg overflow-hidden border h-[300px]">
                          {person && person.coordinates && (
                            <DynamicMap
                              key={mapKey}
                              persons={[person]}
                              selectedPerson={person}
                              onMarkerClick={() => {}}
                              mapTheme={theme === "dark" ? "dark" : "light"}
                            />
                          )}
                        </div>
                        <p className="mt-4 text-muted-foreground">
                          {person.lastSeenLocation}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contact" className="pt-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4">
                          Contact Information
                        </h3>
                        {person.contactInfo ? (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">Contact Person</p>
                                <p className="text-muted-foreground">
                                  {person.contactInfo.name} (
                                  {person.contactInfo.relationship})
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-muted-foreground">
                                  {person.contactInfo.phone}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">Email</p>
                                <p className="text-muted-foreground">
                                  {person.contactInfo.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No contact information available. Please contact
                            local authorities if you have information about this
                            person.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
