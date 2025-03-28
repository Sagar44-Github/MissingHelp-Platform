"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonCard } from "@/components/person-card";
import {
  MapPin,
  List,
  Grid,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import("@/components/map-with-markers"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-muted">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { theme } = useTheme();
  const { missingPersons, isLoading } = useMissingPersons();
  const [activeTab, setActiveTab] = useState<string>("map");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 9;

  // Filter persons based on search term
  const filteredPersons = missingPersons.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastSeenLocation
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      person.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPersons.slice(startIndex, endIndex);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Create a unique map key based on dependencies that would require a map re-mount
  const mapKey = `map-${theme}-${selectedPerson?._id || "none"}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  useEffect(() => {
    // Clear selected person when component unmounts to prevent stale references
    return () => {
      setSelectedPerson(null);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  Global Map
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight">
                  Missing Persons Map
                </h1>
                <p className="text-muted-foreground mt-1">
                  Locate missing individuals on our interactive global map
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="map"
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">Map View</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex items-center gap-1"
                    >
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">List View</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {activeTab === "list" && (
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 ${
                        viewMode === "grid" ? "bg-muted" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 ${
                        viewMode === "list" ? "bg-muted" : ""
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="map" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <Card className="border-none shadow-md overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-[600px]">
                        <DynamicMap
                          key={mapKey}
                          persons={filteredPersons}
                          onMarkerClick={handlePersonClick}
                          selectedPerson={selectedPerson}
                          mapTheme={theme === "dark" ? "dark" : "light"}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1 order-1 lg:order-2">
                  <div className="sticky top-4">
                    <Card className="border-none shadow-md">
                      <CardContent className="p-5">
                        {selectedPerson ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Badge
                                variant={
                                  selectedPerson.status === "missing"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {selectedPerson.status === "missing"
                                  ? "Missing"
                                  : "Found"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedPerson(null)}
                                className="h-8 w-8"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-center">
                              <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-background mb-3">
                                <img
                                  src={selectedPerson.photoUrl}
                                  alt={selectedPerson.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <h2 className="text-xl font-bold">
                                {selectedPerson.name}
                              </h2>
                              <p className="text-muted-foreground">
                                {selectedPerson.age} years old
                              </p>
                            </div>

                            <div className="space-y-3 pt-3 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Last seen:
                                </p>
                                <p className="font-medium">
                                  {new Date(
                                    selectedPerson.lastSeenDate
                                  ).toLocaleDateString()}{" "}
                                  - {selectedPerson.lastSeenLocation}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Description:
                                </p>
                                <p className="font-medium line-clamp-3">
                                  {selectedPerson.description}
                                </p>
                              </div>

                              <Button
                                className="w-full mt-2"
                                onClick={() =>
                                  (window.location.href = `/person/${selectedPerson._id}`)
                                }
                              >
                                View Full Details
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium mb-1">
                              Select a Marker
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              Click on any marker on the map to view details
                              about that person.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>{" "}
                              Red markers indicate missing persons
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>{" "}
                              Green markers indicate found persons
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              {isLoading ? (
                <div className="grid gap-6 py-8">
                  {[...Array(6)].map((_, i) => (
                    <Card
                      key={i}
                      className="animate-pulse border-none shadow-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-[100px] h-[100px] bg-muted rounded-md"></div>
                          <div className="flex-1">
                            <div className="h-6 w-2/3 bg-muted rounded mb-2"></div>
                            <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
                            <div className="h-4 w-full bg-muted rounded mb-2"></div>
                            <div className="h-4 w-full bg-muted rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPersons.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No missing persons match your search criteria. Try adjusting
                    your filters or search terms.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4"
                        : "grid grid-cols-1 gap-4 py-4"
                    }
                  >
                    {currentItems.map((person, index) => (
                      <PersonCard
                        key={person._id}
                        person={person}
                        index={index}
                        listView={viewMode === "list"}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>

                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          // Only show a few pages and ellipsis for many pages
                          if (
                            totalPages <= 5 ||
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="icon"
                                onClick={() => handlePageChange(pageNum)}
                                className="h-8 w-8"
                              >
                                {pageNum}
                              </Button>
                            );
                          } else if (
                            (pageNum === 2 && currentPage > 3) ||
                            (pageNum === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <span
                                key={pageNum}
                                className="px-1 text-muted-foreground"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
