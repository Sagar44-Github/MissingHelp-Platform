"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Info,
  Filter,
  Calendar,
  RefreshCw,
  MapPin,
  Eye,
  EyeOff,
  AlertTriangle,
  BarChart4,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";

// Mock data for the heatmap visualization
const MOCK_HEATMAP_DATA = [
  {
    region: "North America",
    cases: 42,
    coordinates: [40, -100],
    intensity: 0.8,
  },
  {
    region: "South America",
    cases: 24,
    coordinates: [-20, -60],
    intensity: 0.5,
  },
  { region: "Europe", cases: 38, coordinates: [50, 10], intensity: 0.7 },
  { region: "Africa", cases: 31, coordinates: [0, 20], intensity: 0.6 },
  { region: "Asia", cases: 53, coordinates: [30, 100], intensity: 0.9 },
  {
    region: "Australia/Oceania",
    cases: 18,
    coordinates: [-25, 135],
    intensity: 0.4,
  },
];

// Country-level mock data
const MOCK_COUNTRY_DATA = [
  {
    country: "United States",
    region: "North America",
    cases: 28,
    coordinates: [37, -95],
    intensity: 0.75,
  },
  {
    country: "Canada",
    region: "North America",
    cases: 14,
    coordinates: [56, -106],
    intensity: 0.4,
  },
  {
    country: "Mexico",
    region: "North America",
    cases: 18,
    coordinates: [23, -102],
    intensity: 0.5,
  },
  {
    country: "Brazil",
    region: "South America",
    cases: 16,
    coordinates: [-14, -51],
    intensity: 0.45,
  },
  {
    country: "Argentina",
    region: "South America",
    cases: 8,
    coordinates: [-34, -64],
    intensity: 0.25,
  },
  {
    country: "United Kingdom",
    region: "Europe",
    cases: 12,
    coordinates: [54, -2],
    intensity: 0.35,
  },
  {
    country: "France",
    region: "Europe",
    cases: 10,
    coordinates: [46, 2],
    intensity: 0.3,
  },
  {
    country: "Germany",
    region: "Europe",
    cases: 9,
    coordinates: [51, 10],
    intensity: 0.28,
  },
  {
    country: "Spain",
    region: "Europe",
    cases: 7,
    coordinates: [40, -4],
    intensity: 0.22,
  },
  {
    country: "Nigeria",
    region: "Africa",
    cases: 11,
    coordinates: [9, 8],
    intensity: 0.32,
  },
  {
    country: "South Africa",
    region: "Africa",
    cases: 9,
    coordinates: [-30, 25],
    intensity: 0.28,
  },
  {
    country: "Kenya",
    region: "Africa",
    cases: 7,
    coordinates: [1, 38],
    intensity: 0.22,
  },
  {
    country: "Egypt",
    region: "Africa",
    cases: 4,
    coordinates: [27, 30],
    intensity: 0.15,
  },
  {
    country: "China",
    region: "Asia",
    cases: 14,
    coordinates: [35, 105],
    intensity: 0.4,
  },
  {
    country: "India",
    region: "Asia",
    cases: 18,
    coordinates: [20, 77],
    intensity: 0.5,
  },
  {
    country: "Japan",
    region: "Asia",
    cases: 8,
    coordinates: [36, 138],
    intensity: 0.25,
  },
  {
    country: "Indonesia",
    region: "Asia",
    cases: 7,
    coordinates: [-5, 120],
    intensity: 0.22,
  },
  {
    country: "Australia",
    region: "Australia/Oceania",
    cases: 13,
    coordinates: [-25, 133],
    intensity: 0.38,
  },
  {
    country: "New Zealand",
    region: "Australia/Oceania",
    cases: 5,
    coordinates: [-40, 174],
    intensity: 0.18,
  },
];

// Statistics by region
const regionStats = MOCK_HEATMAP_DATA.map((region) => ({
  region: region.region,
  cases: region.cases,
  resolved: Math.floor(region.cases * (0.3 + Math.random() * 0.4)), // 30-70% resolved
  avgTimeToResolve: Math.floor(20 + Math.random() * 40), // 20-60 days
  highRiskAreas: Math.floor(2 + Math.random() * 4), // 2-5 high risk areas
}));

// Create a dynamically loaded map component to avoid SSR issues
const HeatmapVisualization = dynamic(
  () =>
    Promise.resolve(() => (
      <div className="aspect-[16/9] w-full bg-gray-100 dark:bg-slate-900 rounded-lg border overflow-hidden relative">
        {/* World map background with higher contrast */}
        <div className="absolute inset-0 opacity-90 bg-[url('/world-map-outline.svg')] bg-no-repeat bg-center bg-contain"></div>

        {/* Render heat points as absolute positioned divs */}
        {MOCK_HEATMAP_DATA.map((point, i) => (
          <div
            key={i}
            className="group absolute rounded-full bg-red-500 animate-pulse cursor-pointer transition-all duration-300 hover:z-10"
            style={{
              width: `${point.intensity * 100}px`,
              height: `${point.intensity * 100}px`,
              left: `calc(${((point.coordinates[1] + 180) / 360) * 100}% - ${
                point.intensity * 50
              }px)`,
              top: `calc(${((90 - point.coordinates[0]) / 180) * 100}% - ${
                point.intensity * 50
              }px)`,
              opacity: point.intensity * 0.7,
              boxShadow: `0 0 ${point.intensity * 40}px ${
                point.intensity * 20
              }px rgba(239, 68, 68, 0.5)`,
            }}
          >
            {/* Add tooltip that appears on hover */}
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded pointer-events-none whitespace-nowrap transition-opacity">
              <strong>{point.region}</strong>: {point.cases} cases
            </div>
          </div>
        ))}

        {/* Add country-level labels for additional context */}
        {MOCK_COUNTRY_DATA.filter((country) => country.cases > 10).map(
          (country, i) => (
            <div
              key={`country-${i}`}
              className="absolute text-xs font-medium pointer-events-none"
              style={{
                left: `calc(${((country.coordinates[1] + 180) / 360) * 100}%)`,
                top: `calc(${((90 - country.coordinates[0]) / 180) * 100}%)`,
                transform: "translate(-50%, -50%)",
                textShadow:
                  "0 0 2px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.8)",
                color: "white",
                zIndex: 5,
              }}
            >
              {country.country}
            </div>
          )
        )}

        {/* Improved legend with more context */}
        <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 rounded-md shadow-xl text-sm border border-gray-200 dark:border-gray-800 z-20 max-w-[200px]">
          <div className="font-semibold mb-3 text-base">Heat Intensity</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 opacity-30"></div>
              <span>Low (1-10 cases)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 opacity-50"></div>
              <span>Medium (11-25 cases)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 opacity-80"></div>
              <span>High (26+ cases)</span>
            </div>
          </div>
          <div className="mt-3 text-xs font-medium">
            Hover over hotspots for details
          </div>
        </div>
      </div>
    )),
  { ssr: false }
);

export default function HeatmapPage() {
  const { missingPersons } = useMissingPersons();
  const [isLoading, setIsLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("heatmap");

  // Simulate loading the data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Calculate regional stats from the missing persons data
  const getRegionalDistribution = () => {
    const distribution: Record<string, number> = {};

    missingPersons.forEach((person) => {
      if (person.region) {
        distribution[person.region] = (distribution[person.region] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Generate reports for the selected region
  const getRegionReport = (region: string | null) => {
    if (!region) return null;

    const regionData = regionStats.find((r) => r.region === region);
    if (!regionData) return null;

    const countryData = MOCK_COUNTRY_DATA.filter(
      (c) => c.region === region
    ).sort((a, b) => b.cases - a.cases);

    return {
      ...regionData,
      countries: countryData,
      trends: [
        { month: "Jan", cases: Math.floor(Math.random() * 10) },
        { month: "Feb", cases: Math.floor(Math.random() * 10) },
        { month: "Mar", cases: Math.floor(Math.random() * 10) },
        { month: "Apr", cases: Math.floor(Math.random() * 10) },
        { month: "May", cases: Math.floor(Math.random() * 10) },
        { month: "Jun", cases: Math.floor(Math.random() * 10) },
      ],
    };
  };

  const regionReport = getRegionReport(activeRegion);
  const regionalDistribution = getRegionalDistribution();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2">
                Data Analysis
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Missing Persons Heatmap
              </h1>
              <p className="text-muted-foreground">
                Visualize missing person cases by geographic region and identify
                hotspots
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="lg:col-span-3">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle>Global Distribution</CardTitle>
                      <CardDescription>
                        Heat intensity shows concentration of cases
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 90 days</SelectItem>
                          <SelectItem value="year">Last year</SelectItem>
                          <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={viewMode} onValueChange={setViewMode}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="View mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="heatmap">Heatmap</SelectItem>
                          <SelectItem value="markers">Markers</SelectItem>
                          <SelectItem value="regions">Regions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="aspect-[16/9] w-full flex flex-col items-center justify-center bg-muted rounded-lg border">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Loading visualization...
                      </p>
                    </div>
                  ) : (
                    <HeatmapVisualization />
                  )}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      <span>
                        Data represents{" "}
                        {MOCK_HEATMAP_DATA.reduce(
                          (acc, curr) => acc + curr.cases,
                          0
                        )}
                        total cases across {MOCK_HEATMAP_DATA.length} regions
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Stats</CardTitle>
                  <CardDescription>Cases by geographic region</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4 p-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-1 animate-pulse">
                          <div className="flex justify-between mb-1">
                            <div className="h-4 w-28 bg-muted rounded"></div>
                            <div className="h-4 w-10 bg-muted rounded"></div>
                          </div>
                          <div className="h-2 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {MOCK_HEATMAP_DATA.map((region) => (
                        <button
                          key={region.region}
                          onClick={() => setActiveRegion(region.region)}
                          className={`w-full space-y-1 text-left hover:bg-muted/50 p-2 rounded-md transition-colors ${
                            activeRegion === region.region ? "bg-muted/60" : ""
                          }`}
                        >
                          <div className="flex justify-between mb-1">
                            <div className="font-medium text-sm">
                              {region.region}
                            </div>
                            <div className="text-sm">{region.cases}</div>
                          </div>
                          <Progress
                            value={(region.cases / 53) * 100}
                            className="h-1"
                          />
                        </button>
                      ))}
                    </>
                  )}
                </CardContent>
                <CardFooter className="border-t text-xs text-muted-foreground pt-4">
                  Click on a region for detailed statistics
                </CardFooter>
              </Card>
            </div>

            {activeRegion && regionReport && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{activeRegion} Detailed Analysis</CardTitle>
                      <CardDescription>
                        In-depth statistics and trends for {activeRegion}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveRegion(null)}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Total Cases</div>
                      <div className="text-3xl font-bold">
                        {regionReport.cases}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          Across {regionReport.countries.length} countries
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Resolved Cases</div>
                      <div className="text-3xl font-bold text-green-500">
                        {regionReport.resolved}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(
                          (regionReport.resolved / regionReport.cases) * 100
                        )}
                        % resolution rate
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        Avg. Time to Resolve
                      </div>
                      <div className="text-3xl font-bold">
                        {regionReport.avgTimeToResolve} days
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>From report to resolution</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">High-Risk Areas</div>
                      <div className="text-3xl font-bold text-amber-500">
                        {regionReport.highRiskAreas}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Areas with high concentration</span>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="countries">
                    <TabsList className="mb-4">
                      <TabsTrigger value="countries">
                        <Globe className="h-4 w-4 mr-1" />
                        Countries
                      </TabsTrigger>
                      <TabsTrigger value="trends">
                        <BarChart4 className="h-4 w-4 mr-1" />
                        Trends
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="countries">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {regionReport.countries.map((country) => (
                          <Card key={country.country} className="bg-muted/30">
                            <CardHeader className="py-3 px-4">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">
                                  {country.country}
                                </CardTitle>
                                <Badge variant="outline">{country.cases}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-3 px-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Intensity
                                  </span>
                                  <span>
                                    {Math.round(country.intensity * 100)}%
                                  </span>
                                </div>
                                <Progress
                                  value={country.intensity * 100}
                                  className="h-1"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="trends">
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Monthly Case Trends
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 flex items-end justify-around">
                            {regionReport.trends.map((month) => (
                              <div
                                key={month.month}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className="w-12 bg-primary/80 rounded-t-sm"
                                  style={{ height: `${month.cases * 14}px` }}
                                ></div>
                                <div className="mt-2 text-sm">
                                  {month.month}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            <div className="bg-muted/20 rounded-lg p-4 border">
              <div className="flex gap-3 items-start">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">About This Visualization</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This heatmap shows the geographical distribution of missing
                    persons cases around the world. Areas with higher
                    concentrations of cases appear as brighter hotspots on the
                    map.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use this visualization to identify patterns and high-risk
                    areas that may require additional attention from law
                    enforcement and community outreach programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
