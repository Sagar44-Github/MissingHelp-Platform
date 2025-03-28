"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PersonCard } from "@/components/person-card";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import {
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Calendar,
  User,
  Clock,
  X,
} from "lucide-react";

export default function SearchPage() {
  const { missingPersons } = useMissingPersons();
  const [searchResults, setSearchResults] = useState(missingPersons || []);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search parameters
  const [searchParams, setSearchParams] = useState({
    query: "",
    status: "all",
    gender: "all",
    region: "all",
    ageRange: [0, 100],
    dateFrom: "",
    dateTo: "",
    sortBy: "recent",
  });

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    if (!field) return;
    setSearchParams((prev) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };

  // Run search with current parameters
  const handleSearch = () => {
    setIsSearching(true);

    // Build active filters list for display
    const filters = [];
    if (searchParams?.query)
      filters.push({ name: "Keyword", value: `"${searchParams.query}"` });
    if (searchParams?.status && searchParams.status !== "all")
      filters.push({ name: "Status", value: searchParams.status });
    if (searchParams?.gender && searchParams.gender !== "all")
      filters.push({ name: "Gender", value: searchParams.gender });
    if (searchParams?.region && searchParams.region !== "all")
      filters.push({ name: "Region", value: searchParams.region });
    if (
      searchParams?.ageRange &&
      (searchParams.ageRange[0] > 0 || searchParams.ageRange[1] < 100)
    )
      filters.push({
        name: "Age",
        value: `${searchParams.ageRange[0]}-${searchParams.ageRange[1]} years`,
      });
    if (searchParams?.dateFrom)
      filters.push({
        name: "From",
        value: new Date(searchParams.dateFrom).toLocaleDateString(),
      });
    if (searchParams?.dateTo)
      filters.push({
        name: "To",
        value: new Date(searchParams.dateTo).toLocaleDateString(),
      });

    setActiveFilters(filters);

    // Filter results based on search parameters
    let results = missingPersons ? [...missingPersons] : [];

    // Make sure each item in the results is valid
    results = results.filter(
      (person) => person !== null && person !== undefined
    );

    // Text search
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      results = results.filter(
        (person) =>
          (person?.name && person.name.toLowerCase().includes(query)) ||
          (person?.description &&
            person.description.toLowerCase().includes(query)) ||
          (person?.lastSeenLocation &&
            person.lastSeenLocation.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (searchParams.status && searchParams.status !== "all") {
      results = results.filter(
        (person) => person?.status === searchParams.status
      );
    }

    // Gender filter
    if (searchParams.gender && searchParams.gender !== "all") {
      results = results.filter(
        (person) => person?.gender === searchParams.gender
      );
    }

    // Region filter
    if (searchParams.region && searchParams.region !== "all") {
      results = results.filter(
        (person) => person?.region === searchParams.region
      );
    }

    // Age range filter
    results = results.filter(
      (person) =>
        person?.age !== undefined &&
        person.age >= searchParams.ageRange[0] &&
        person.age <= searchParams.ageRange[1]
    );

    // Date filters
    if (searchParams.dateFrom) {
      results = results.filter(
        (person) =>
          person?.lastSeenDate && person.lastSeenDate >= searchParams.dateFrom
      );
    }

    if (searchParams.dateTo) {
      results = results.filter(
        (person) =>
          person?.lastSeenDate && person.lastSeenDate <= searchParams.dateTo
      );
    }

    // Sort results
    if (searchParams.sortBy === "recent") {
      results.sort(
        (a, b) =>
          (b?.reportDate ? new Date(b.reportDate).getTime() : 0) -
          (a?.reportDate ? new Date(a.reportDate).getTime() : 0)
      );
    } else if (searchParams.sortBy === "oldest") {
      results.sort(
        (a, b) =>
          (a?.reportDate ? new Date(a.reportDate).getTime() : 0) -
          (b?.reportDate ? new Date(b.reportDate).getTime() : 0)
      );
    } else if (searchParams.sortBy === "name") {
      results.sort((a, b) =>
        a?.name && b?.name ? a.name.localeCompare(b.name) : 0
      );
    } else if (searchParams.sortBy === "age") {
      results.sort((a, b) => (b?.age || 0) - (a?.age || 0));
    }

    // Simulate API delay
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      query: "",
      status: "all",
      gender: "all",
      region: "all",
      ageRange: [0, 100],
      dateFrom: "",
      dateTo: "",
      sortBy: "recent",
    });
    setActiveFilters([]);
    // Make sure we have valid search results
    setSearchResults(missingPersons?.filter((p) => p) || []);
  };

  // Remove a single filter
  const removeFilter = (filter: string) => {
    if (!filter) return;

    // Convert field name to lowercase for comparison
    const field = filter.toLowerCase();

    if (field === "keyword") {
      handleChange("query", "");
    } else if (field === "status") {
      handleChange("status", "all");
    } else if (field === "gender") {
      handleChange("gender", "all");
    } else if (field === "region") {
      handleChange("region", "all");
    } else if (field === "age") {
      handleChange("ageRange", [0, 100]);
    } else if (field === "from") {
      handleChange("dateFrom", "");
    } else if (field === "to") {
      handleChange("dateTo", "");
    }

    // Update active filters
    setActiveFilters(
      activeFilters.filter((f) => {
        if (typeof f === "object" && f !== null) {
          return f.name.toLowerCase() !== field.toLowerCase();
        }
        return !f.toLowerCase().startsWith(field.toLowerCase());
      })
    );

    // Re-run search with updated filters
    handleSearch();
  };

  // Set initial results
  useEffect(() => {
    if (missingPersons) {
      // Apply all filters
      let filtered = [...missingPersons].filter((person) => person);

      // Filter by search query
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        filtered = filtered.filter(
          (person) =>
            person?.name?.toLowerCase().includes(query) ||
            person?.description?.toLowerCase().includes(query)
        );
      }

      // Filter by status
      if (searchParams.status && searchParams.status !== "all") {
        filtered = filtered.filter(
          (person) => person?.status === searchParams.status
        );
      }

      // Filter by gender
      if (searchParams.gender && searchParams.gender !== "all") {
        filtered = filtered.filter(
          (person) => person?.gender === searchParams.gender
        );
      }

      // Filter by region
      if (searchParams.region && searchParams.region !== "all") {
        filtered = filtered.filter(
          (person) => person?.region === searchParams.region
        );
      }

      // Filter by age range
      if (
        searchParams.ageRange &&
        (searchParams.ageRange[0] > 0 || searchParams.ageRange[1] < 100)
      ) {
        filtered = filtered.filter((person) => {
          const age = person?.age;
          return (
            age >= searchParams.ageRange[0] && age <= searchParams.ageRange[1]
          );
        });
      }

      // Filter by date range
      if (searchParams.dateFrom || searchParams.dateTo) {
        filtered = filtered.filter((person) => {
          if (!person?.dateOfDisappearance) return false;

          const disappearanceDate = new Date(person.dateOfDisappearance);
          let isAfterFrom = true;
          let isBeforeTo = true;

          if (searchParams.dateFrom) {
            const fromDate = new Date(searchParams.dateFrom);
            isAfterFrom = disappearanceDate >= fromDate;
          }

          if (searchParams.dateTo) {
            const toDate = new Date(searchParams.dateTo);
            isBeforeTo = disappearanceDate <= toDate;
          }

          return isAfterFrom && isBeforeTo;
        });
      }

      // Sort results
      if (searchParams.sortBy === "recent") {
        filtered.sort((a, b) => {
          const dateA = a?.dateOfDisappearance
            ? new Date(a.dateOfDisappearance)
            : new Date(0);
          const dateB = b?.dateOfDisappearance
            ? new Date(b.dateOfDisappearance)
            : new Date(0);
          return dateB - dateA;
        });
      } else if (searchParams.sortBy === "oldest") {
        filtered.sort((a, b) => {
          const dateA = a?.dateOfDisappearance
            ? new Date(a.dateOfDisappearance)
            : new Date(0);
          const dateB = b?.dateOfDisappearance
            ? new Date(b.dateOfDisappearance)
            : new Date(0);
          return dateA - dateB;
        });
      }

      setSearchResults(filtered);

      // Update active filters
      const filters = [];

      if (searchParams.status && searchParams.status !== "all") {
        filters.push({ name: "Status", value: searchParams.status });
      }

      if (searchParams.gender && searchParams.gender !== "all") {
        filters.push({ name: "Gender", value: searchParams.gender });
      }

      if (searchParams.region && searchParams.region !== "all") {
        filters.push({ name: "Region", value: searchParams.region });
      }

      if (
        searchParams.ageRange &&
        (searchParams.ageRange[0] > 0 || searchParams.ageRange[1] < 100)
      ) {
        filters.push({
          name: "Age",
          value: `${searchParams.ageRange[0]}-${searchParams.ageRange[1]}`,
        });
      }

      if (searchParams.dateFrom) {
        filters.push({
          name: "From",
          value: new Date(searchParams.dateFrom).toLocaleDateString(),
        });
      }

      if (searchParams.dateTo) {
        filters.push({
          name: "To",
          value: new Date(searchParams.dateTo).toLocaleDateString(),
        });
      }

      setActiveFilters(filters);
    }
  }, [searchParams, missingPersons]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-2">
                  Advanced Search
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight">
                  Find Missing Persons
                </h1>
                <p className="text-muted-foreground mt-1">
                  Use advanced search options to filter missing persons cases
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle>Search Criteria</CardTitle>
                      <CardDescription>
                        Enter keywords or use filters to find specific cases
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Main search input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, description, or location"
                        className="pl-10"
                        value={searchParams?.query ?? ""}
                        onChange={(e) => handleChange("query", e.target.value)}
                      />
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="filters">
                        <AccordionTrigger className="text-sm font-medium">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Additional Filters
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            {/* Status filter */}
                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={searchParams?.status ?? ""}
                                onValueChange={(value) =>
                                  handleChange("status", value)
                                }
                              >
                                <SelectTrigger id="status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="missing">
                                    Missing
                                  </SelectItem>
                                  <SelectItem value="found">Found</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Gender filter */}
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Select
                                value={searchParams?.gender ?? ""}
                                onValueChange={(value) =>
                                  handleChange("gender", value)
                                }
                              >
                                <SelectTrigger id="gender">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Region filter */}
                            <div className="space-y-2">
                              <Label htmlFor="region">Region</Label>
                              <Select
                                value={searchParams?.region ?? ""}
                                onValueChange={(value) =>
                                  handleChange("region", value)
                                }
                              >
                                <SelectTrigger id="region">
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">
                                    All Regions
                                  </SelectItem>
                                  <SelectItem value="North America">
                                    North America
                                  </SelectItem>
                                  <SelectItem value="South America">
                                    South America
                                  </SelectItem>
                                  <SelectItem value="Europe">Europe</SelectItem>
                                  <SelectItem value="Africa">Africa</SelectItem>
                                  <SelectItem value="Asia">Asia</SelectItem>
                                  <SelectItem value="Oceania">
                                    Oceania
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Age range filter */}
                            <div className="space-y-4 lg:col-span-3">
                              <div className="flex justify-between items-center">
                                <Label>Age Range</Label>
                                <span className="text-sm text-muted-foreground">
                                  {searchParams?.ageRange?.[0] ?? 0} -{" "}
                                  {searchParams?.ageRange?.[1] ?? 100} years
                                </span>
                              </div>
                              <Slider
                                defaultValue={[0, 100]}
                                max={100}
                                step={1}
                                value={searchParams?.ageRange ?? [0, 100]}
                                onValueChange={(value) =>
                                  handleChange("ageRange", value)
                                }
                                className="py-4"
                              />
                            </div>

                            {/* Date range filters */}
                            <div className="space-y-2">
                              <Label htmlFor="dateFrom">Date From</Label>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input
                                  id="dateFrom"
                                  type="date"
                                  value={searchParams?.dateFrom ?? ""}
                                  onChange={(e) =>
                                    handleChange("dateFrom", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dateTo">Date To</Label>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input
                                  id="dateTo"
                                  type="date"
                                  value={searchParams?.dateTo ?? ""}
                                  onChange={(e) =>
                                    handleChange("dateTo", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            {/* Sort options */}
                            <div className="space-y-2">
                              <Label htmlFor="sortBy">Sort By</Label>
                              <Select
                                value={searchParams?.sortBy ?? "recent"}
                                onValueChange={(value) =>
                                  handleChange("sortBy", value)
                                }
                              >
                                <SelectTrigger id="sortBy">
                                  <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="recent">
                                    Most Recent
                                  </SelectItem>
                                  <SelectItem value="oldest">
                                    Oldest First
                                  </SelectItem>
                                  <SelectItem value="name">
                                    Name (A-Z)
                                  </SelectItem>
                                  <SelectItem value="age">
                                    Age (Oldest First)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/10 py-4 px-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Results update in real-time as you change filters
                    </span>
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {activeFilters.map((filter, index) => {
                    // Check if filter is an object or string
                    const isObject =
                      typeof filter === "object" && filter !== null;
                    const filterKey = isObject
                      ? `${filter.name}-${index}`
                      : filter;
                    const filterText = isObject
                      ? `${filter.name}: ${filter.value}`
                      : filter;
                    const filterValue = isObject
                      ? filter.name
                      : filter.split(":")?.[0]?.trim();

                    return (
                      <Badge
                        key={filterKey}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {filterText}
                        <button
                          onClick={() => removeFilter(filterValue)}
                          className="ml-1 h-4 w-4 rounded-full bg-muted/30 flex items-center justify-center hover:bg-muted"
                          aria-label={`Remove filter: ${filterText}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {isSearching
                    ? "Searching..."
                    : `Results (${searchResults?.length || 0})`}
                </h2>
              </div>

              {!searchResults || searchResults.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Try adjusting your search criteria or filters to find what
                      you're looking for.
                    </p>
                    <Button onClick={clearFilters}>Clear all filters</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults && searchResults.length > 0 ? (
                    searchResults.map(
                      (person, index) =>
                        person && (
                          <PersonCard
                            key={person?._id || index}
                            person={person}
                            index={index}
                          />
                        )
                    )
                  ) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-muted-foreground">
                        No results match your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
