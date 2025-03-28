"use client";

import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { PersonCard } from "@/components/person-card";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  TrendingUp,
  Activity,
  Globe,
  Share,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Home() {
  const { missingPersons, isLoading } = useMissingPersons();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter persons based on search term
  const filteredPersons = missingPersons.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastSeenLocation
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      person.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredPersons = filteredPersons.slice(0, 3);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        {/* Search Section */}
        <section className="py-12 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Featured Cases */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="outline" className="mb-2">
                  Recent Cases
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Recent Missing Persons
                </h2>
              </div>
              <Link href="/map">
                <Button variant="outline" className="gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] bg-muted"></div>
                      <div className="p-4">
                        <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                        <div className="h-6 w-3/4 bg-muted rounded mb-4"></div>
                        <div className="h-3 w-full bg-muted rounded mb-2"></div>
                        <div className="h-3 w-full bg-muted rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPersons.map((person, index) => (
                  <PersonCard key={person._id} person={person} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge variant="outline" className="mb-2">
                How it works
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Help find missing individuals in 3 simple steps
              </h2>
              <p className="text-muted-foreground">
                Our platform connects communities globally to help locate
                missing individuals through a simple process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle>1. Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Submit a detailed report with information and photos of the
                    missing person.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-transparent">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Globe className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle>2. Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View interactive maps showing reported missing individuals
                    across the globe.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-transparent">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Share className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle>3. Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Share information on social media to increase visibility and
                    aid in location efforts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Global Reach */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-2">
                  Global Network
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  Connecting communities worldwide
                </h2>
                <p className="text-muted-foreground mb-6">
                  Our platform spans across continents, leveraging the power of
                  community collaboration to help find missing individuals
                  globally.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Global Database</h3>
                      <p className="text-sm text-muted-foreground">
                        Access information on missing persons across multiple
                        countries
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Location-Based Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about cases in your local area
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Real-Time Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Stay informed with the latest information on active
                        cases
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/map">
                    <Button>
                      <MapPin className="mr-2 h-4 w-4" />
                      Explore Global Map
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-small-background/[0.05] bg-[size:20px_20px]" />
                <div className="w-3/4 h-3/4 bg-primary/10 backdrop-blur-sm backdrop-filter rounded-lg flex items-center justify-center p-6">
                  <span className="text-lg font-medium text-center">
                    Interactive world map with real-time data visualization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6 max-w-2xl mx-auto">
              Every report counts. Help us reunite families.
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join our global community in making a difference. Report a missing
              person or explore our map to help locate someone in need.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/report">
                <Button variant="secondary" size="lg">
                  <Users className="mr-2 h-5 w-5" />
                  Report Missing Person
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  View Global Map
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
