"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Upload,
  Calendar,
  Info,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { useRouter } from "next/navigation";
import { MissingPerson } from "@/types/missing-person";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import Image from "next/image";

export default function ReportPage() {
  const { addMissingPerson } = useMissingPersons();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
    lastSeenDate: "",
    lastSeenLocation: "",
    country: "",
    state: "",
    address: "",
    city: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    photoUrl: "", // Will be set based on the uploaded image
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Countries for location selection
  const COUNTRIES = [
    "United States", "Canada", "Mexico", "Brazil", "Argentina", 
    "United Kingdom", "France", "Germany", "Spain", "Italy",
    "Russia", "China", "India", "Japan", "Australia",
    "South Africa", "Nigeria", "Kenya", "Egypt", "UAE"
  ];

  // States/provinces by country
  const STATES_BY_COUNTRY = {
    "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    "Canada": ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    "Australia": ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"],
    // Other countries would have their own states/provinces
  };
  
  // Available states for selected country
  const availableStates = formData.country && STATES_BY_COUNTRY[formData.country] ? 
    STATES_BY_COUNTRY[formData.country] : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // In a real app, you would upload the image to a server
      // Here we're just simulating it with a fake URL
      setFormData((prev) => ({
        ...prev,
        photoUrl: previewUrl,
      }));
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure we have required data
      if (
        !formData.name ||
        !formData.age ||
        !formData.lastSeenDate ||
        (!formData.lastSeenLocation && !formData.address)
      ) {
        alert("Please fill out all required fields");
        setIsSubmitting(false);
        return;
      }

      // Format the location with structured data if available
      const formattedLocation = formData.lastSeenLocation || [
        formData.address,
        formData.city,
        formData.state,
        formData.country
      ].filter(Boolean).join(", ");

      // In a real app, we would upload the image and validate the form
      // For now, create a new person object
      const photoUrl =
        imagePreview || "https://randomuser.me/api/portraits/men/1.jpg";

      const newPerson = {
        _id: uuidv4(),
        name: formData.name,
        age: parseInt(formData.age) || 0,
        gender: formData.gender || "unknown",
        description: formData.description,
        lastSeenDate: formData.lastSeenDate,
        lastSeenLocation: formattedLocation,
        locationDetails: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address
        },
        status: "missing",
        photoUrl: photoUrl,
        reportDate: format(new Date(), "yyyy-MM-dd"),
        contact: {
          name: formData.contactName,
          phone: formData.contactPhone,
          email: formData.contactEmail,
        },
        region: formData.country ? getRegionFromCountry(formData.country) : "North America",
        coordinates: {
          lat: 40.7128, // Would be geocoded from address in production
          lng: -74.006,
        },
      };

      // Add to context - but make sure addMissingPerson exists
      if (addMissingPerson) {
        await addMissingPerson(newPerson);
        setSubmitSuccess(true);

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/map");
        }, 2000);
      } else {
        console.error("addMissingPerson function is not available");
        alert("Error adding report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error adding report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to map country to region
  const getRegionFromCountry = (country) => {
    const regionMap = {
      "United States": "North America",
      "Canada": "North America",
      "Mexico": "North America",
      "Brazil": "South America",
      "Argentina": "South America",
      "United Kingdom": "Europe",
      "France": "Europe",
      "Germany": "Europe",
      "Spain": "Europe",
      "Italy": "Europe",
      "Russia": "Europe",
      "China": "Asia",
      "India": "Asia",
      "Japan": "Asia",
      "UAE": "Asia",
      "South Africa": "Africa",
      "Nigeria": "Africa",
      "Kenya": "Africa",
      "Egypt": "Africa",
      "Australia": "Australia/Oceania"
    };
    
    return regionMap[country] || "North America";
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">
                    Report Submitted Successfully
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Your missing person report has been added to our database.
                    You'll be redirected to the map page in a moment.
                  </p>
                  <Button onClick={() => router.push("/map")}>
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2">
                Submit Report
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Report a Missing Person
              </h1>
              <p className="text-muted-foreground">
                Please provide as much information as possible to help locate
                the missing individual.
              </p>
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Missing Person Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        Missing Person Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            name="gender"
                            value={formData.gender}
                            onValueChange={(value) =>
                              handleSelectChange("gender", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor="description">Physical Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Height, weight, hair color, eye color, distinguishing features, clothing worn when last seen, etc."
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Last Seen Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        Last Seen Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastSeenDate">
                          Date Last Seen
                        </Label>
                        <Input
                          id="lastSeenDate"
                          name="lastSeenDate"
                          type="date"
                          value={formData.lastSeenDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2 space-y-4">
                        <h3 className="font-medium">Last Seen Location</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                              value={formData.country}
                              onValueChange={(value) => handleSelectChange("country", value)}
                            >
                              <SelectTrigger id="country">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Select
                              value={formData.state}
                              onValueChange={(value) => handleSelectChange("state", value)}
                              disabled={!formData.country || availableStates.length === 0}
                            >
                              <SelectTrigger id="state">
                                <SelectValue placeholder="Select state/province" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              placeholder="City"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Street Address/Landmark</Label>
                            <Input
                              id="address"
                              name="address"
                              placeholder="Street address, landmark, or specific area"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastSeenLocation">
                            Or Enter Full Location (if above details unknown)
                          </Label>
                          <Input
                            id="lastSeenLocation"
                            name="lastSeenLocation"
                            placeholder="Example: Near Central Park, New York"
                            value={formData.lastSeenLocation}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Photo Upload */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Photo Upload</h2>
                    </div>

                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/10 transition-colors"
                      onClick={triggerFileInput}
                    >
                      {imagePreview ? (
                        <div className="relative w-40 h-40 mx-auto">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setFormData((prev) => ({
                                ...prev,
                                photoUrl: "",
                              }));
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-3">
                            Drag and drop a recent photo, or click to select a
                            file
                          </p>
                        </>
                      )}
                      <Input
                        ref={fileInputRef}
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {!imagePreview && (
                        <div className="mx-auto max-w-xs">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                          >
                            Select File
                          </Button>
                          <p className="text-xs text-muted-foreground mt-3">
                            Supported formats: JPG, PNG. Max file size: 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        Contact Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="contactName">Contact Person Name</Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          placeholder="Your full name"
                          value={formData.contactName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          placeholder="Phone number with country code"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Address</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          placeholder="Your email address"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 items-start mt-6">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 dark:text-amber-500">
                        Important Note
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Please also report this case to your local law
                        enforcement agency. This platform complements official
                        efforts but does not replace them.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.push("/")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
