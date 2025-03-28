"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";

// Mock data for demonstration
const MOCK_MISSING_PERSONS = [
  {
    id: "1",
    name: "John Smith",
    age: 32,
    gender: "Male",
    height: 180,
    weight: 75,
    hairColor: "Brown",
    eyeColor: "Blue",
    lastSeen: "2023-06-15",
    lastSeenTime: "7:30 PM",
    location: "Central Park, New York",
    clothingDescription: "Blue jeans, white t-shirt, and a black jacket",
    distinguishingFeatures:
      "Scar on right forearm, tribal tattoo on left shoulder",
    additionalInfo:
      "John was last seen walking his dog in Central Park. The dog was found alone near the Bethesda Fountain.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    reportedBy: "Mary Smith (Sister)",
    contactPhone: "(555) 123-4567",
    contactEmail: "mary.smith@example.com",
    caseNumber: "NYC-2023-06-15-001",
    status: "active",
    updates: [
      { date: "2023-06-16", text: "Search initiated in Central Park area" },
      {
        date: "2023-06-17",
        text: "Witness reported possible sighting near Columbus Circle",
      },
      {
        date: "2023-06-18",
        text: "Police reviewing CCTV footage from surrounding areas",
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 17,
    gender: "Female",
    height: 165,
    weight: 55,
    hairColor: "Blonde",
    eyeColor: "Green",
    lastSeen: "2023-06-18",
    lastSeenTime: "3:15 PM",
    location: "Downtown Seattle, WA",
    clothingDescription: "Black hoodie, gray sweatpants, and white sneakers",
    distinguishingFeatures: "Small birthmark on left cheek",
    additionalInfo:
      "Sarah was last seen leaving Seattle Central College after her classes. She did not return home and has not contacted family or friends.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    reportedBy: "Robert Johnson (Father)",
    contactPhone: "(555) 987-6543",
    contactEmail: "robert.johnson@example.com",
    caseNumber: "SEA-2023-06-18-003",
    status: "active",
    updates: [
      {
        date: "2023-06-19",
        text: "Missing person report filed with Seattle PD",
      },
      {
        date: "2023-06-20",
        text: "Search expanded to include surrounding neighborhoods",
      },
    ],
  },
];

export default function PersonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    const fetchData = () => {
      const foundPerson = MOCK_MISSING_PERSONS.find((p) => p.id === params.id);
      if (foundPerson) {
        setPerson(foundPerson);
      } else {
        // Person not found, redirect to 404 or home
        router.push("/");
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <p>Person not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Link
        href="/"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={person.imageUrl || "/placeholder.svg"}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button variant="outline" size="sm">
                Report Sighting
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Reported by</p>
                <p>{person.reportedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p>{person.contactPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{person.contactEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Case Number</p>
                <p>{person.caseNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{person.name}</CardTitle>
                  <CardDescription>
                    Age: {person.age} • {person.gender}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    person.status === "active" ? "destructive" : "outline"
                  }
                  className="ml-2"
                >
                  {person.status === "active" ? "Missing" : "Found"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Last seen: {person.lastSeen}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Time: {person.lastSeenTime}</span>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Location: {person.lastSeenLocation || person.location}
                </span>
              </div>

              <Separator />

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Height</p>
                      <p>{person.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weight</p>
                      <p>{person.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hair Color</p>
                      <p>{person.hairColor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Eye Color</p>
                      <p>{person.eyeColor}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Distinguishing Features
                    </p>
                    <p>{person.distinguishingFeatures}</p>
                  </div>
                </TabsContent>
                <TabsContent value="description" className="space-y-4 pt-4">
                  <div>
                    <p className="text-sm font-medium">
                      Clothing When Last Seen
                    </p>
                    <p>{person.clothingDescription}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Additional Information
                    </p>
                    <p>{person.additionalInfo}</p>
                  </div>
                </TabsContent>
                <TabsContent value="updates" className="pt-4">
                  <div className="space-y-4">
                    {person.updates.map((update, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-muted pl-4 py-1"
                      >
                        <p className="text-sm font-medium">{update.date}</p>
                        <p>{update.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Map showing last known location would be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
