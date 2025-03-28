"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { MissingPerson } from "@/types/missing-person";
import {
  BarChart,
  LineChart,
  PieChart,
  MapIcon,
  Globe,
  Users,
  Activity,
  Clock,
  Calendar,
  Filter,
  Download,
  Printer,
  Database,
  RefreshCw,
  Flag,
} from "lucide-react";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

export default function AnalyticsPage() {
  const { persons } = useMissingPersons();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    foundCases: 0,
    recentActivity: 0,
    regionData: [] as { region: string; count: number }[],
    genderData: [] as { gender: string; count: number }[],
    ageGroups: [] as { group: string; count: number }[],
    monthlyTrends: [] as {
      month: string;
      newCases: number;
      resolved: number;
    }[],
  });

  // Calculate statistics based on persons data and time range
  useEffect(() => {
    setIsLoading(true);

    // Simple timeout to simulate data processing/API call
    setTimeout(() => {
      // Count metrics
      const totalCases = persons.length;
      const activeCases = persons.filter((p) => p.status === "missing").length;
      const foundCases = persons.filter((p) => p.status === "found").length;

      // Region distribution
      const regionCounts: Record<string, number> = {};
      persons.forEach((person) => {
        regionCounts[person.region] = (regionCounts[person.region] || 0) + 1;
      });

      const regionData = Object.entries(regionCounts)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count);

      // Gender distribution
      const genderCounts: Record<string, number> = {};
      persons.forEach((person) => {
        genderCounts[person.gender] = (genderCounts[person.gender] || 0) + 1;
      });

      const genderData = Object.entries(genderCounts).map(
        ([gender, count]) => ({ gender, count })
      );

      // Age groups
      const ageGroupCounts: Record<string, number> = {
        "0-12": 0,
        "13-17": 0,
        "18-25": 0,
        "26-40": 0,
        "41-60": 0,
        "60+": 0,
      };

      persons.forEach((person) => {
        if (person.age <= 12) ageGroupCounts["0-12"]++;
        else if (person.age <= 17) ageGroupCounts["13-17"]++;
        else if (person.age <= 25) ageGroupCounts["18-25"]++;
        else if (person.age <= 40) ageGroupCounts["26-40"]++;
        else if (person.age <= 60) ageGroupCounts["41-60"]++;
        else ageGroupCounts["60+"]++;
      });

      const ageGroups = Object.entries(ageGroupCounts).map(
        ([group, count]) => ({ group, count })
      );

      // Monthly trends (mocked data for demo)
      const monthlyTrends = [
        { month: "Jan", newCases: 14, resolved: 8 },
        { month: "Feb", newCases: 18, resolved: 12 },
        { month: "Mar", newCases: 25, resolved: 16 },
        { month: "Apr", newCases: 22, resolved: 19 },
        { month: "May", newCases: 28, resolved: 21 },
        { month: "Jun", newCases: 32, resolved: 24 },
      ];

      setStats({
        totalCases,
        activeCases,
        foundCases,
        recentActivity: 12, // Mocked value
        regionData,
        genderData,
        ageGroups,
        monthlyTrends,
      });

      setIsLoading(false);
    }, 500);
  }, [persons, timeRange]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-2">
                Admin Dashboard
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                Analytics & Insights
              </h1>
              <p className="text-muted-foreground mt-1">
                Track case statistics and identify patterns
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={timeRange}
                onValueChange={(value: TimeRange) => setTimeRange(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cases
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "-" : stats.totalCases}
                </div>
                <p className="text-xs text-muted-foreground">
                  All reported cases in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Cases
                </CardTitle>
                <Activity className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {isLoading ? "-" : stats.activeCases}
                </div>
                <div className="flex items-center pt-1">
                  <Progress
                    className="h-2"
                    value={
                      isLoading
                        ? 0
                        : (stats.activeCases / stats.totalCases) * 100
                    }
                  />
                  <span className="text-xs text-muted-foreground ml-2">
                    {isLoading
                      ? "-"
                      : Math.round(
                          (stats.activeCases / stats.totalCases) * 100
                        )}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Found/Resolved
                </CardTitle>
                <Flag className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {isLoading ? "-" : stats.foundCases}
                </div>
                <div className="flex items-center pt-1">
                  <Progress
                    className="h-2 bg-muted"
                    value={
                      isLoading
                        ? 0
                        : (stats.foundCases / stats.totalCases) * 100
                    }
                  />
                  <span className="text-xs text-muted-foreground ml-2">
                    {isLoading
                      ? "-"
                      : Math.round((stats.foundCases / stats.totalCases) * 100)}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Activity
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "-" : stats.recentActivity}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cases updated in the last 7 days
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span>Trends</span>
              </TabsTrigger>
              <TabsTrigger
                value="geography"
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                <span>Geography</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Cases</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Age Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of missing persons by age group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-[250px] flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {stats.ageGroups.map((group) => (
                          <div key={group.group} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">
                                {group.group}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {group.count} cases
                              </div>
                            </div>
                            <Progress
                              value={(group.count / stats.totalCases) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of missing persons by gender
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-[250px] flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
                      </div>
                    ) : (
                      <div className="flex h-[250px] items-center justify-center">
                        <div className="flex gap-8">
                          {stats.genderData.map((item) => (
                            <div key={item.gender} className="text-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`h-[150px] w-24 relative mb-2 rounded-t-lg ${
                                    item.gender === "male"
                                      ? "bg-blue-500"
                                      : item.gender === "female"
                                      ? "bg-pink-500"
                                      : "bg-purple-500"
                                  }`}
                                >
                                  <div
                                    className="absolute bottom-0 left-0 right-0 bg-primary/10"
                                    style={{
                                      height: `${
                                        (1 -
                                          item.count /
                                            Math.max(
                                              ...stats.genderData.map(
                                                (d) => d.count
                                              )
                                            )) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="font-medium capitalize">
                                  {item.gender}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {item.count} cases
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(
                                    (item.count / stats.totalCases) * 100
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                  <CardDescription>
                    Number of cases by geographic region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stats.regionData.map((region) => (
                        <div key={region.region} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapIcon className="h-4 w-4 text-muted-foreground" />
                              <div className="text-sm font-medium">
                                {region.region}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {region.count} cases
                            </div>
                          </div>
                          <Progress
                            value={(region.count / stats.totalCases) * 100}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    New and resolved cases over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
                    </div>
                  ) : (
                    <div className="h-[300px] mt-4">
                      <div className="flex h-[250px] items-end justify-around gap-2">
                        {stats.monthlyTrends.map((item) => (
                          <div
                            key={item.month}
                            className="relative flex flex-col items-center"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <div className="relative w-16 flex flex-col items-center gap-1">
                                <div
                                  className="w-6 bg-destructive rounded-t-sm"
                                  style={{
                                    height: `${
                                      (item.newCases /
                                        Math.max(
                                          ...stats.monthlyTrends.map((d) =>
                                            Math.max(d.newCases, d.resolved)
                                          )
                                        )) *
                                      200
                                    }px`,
                                  }}
                                />
                                <div
                                  className="w-6 bg-green-500 rounded-t-sm"
                                  style={{
                                    height: `${
                                      (item.resolved /
                                        Math.max(
                                          ...stats.monthlyTrends.map((d) =>
                                            Math.max(d.newCases, d.resolved)
                                          )
                                        )) *
                                      200
                                    }px`,
                                  }}
                                />
                              </div>
                              <div className="text-xs font-medium">
                                {item.month}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-destructive" />
                          <span className="text-sm">New Cases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-sm">Resolved Cases</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geography">
              <Card>
                <CardHeader>
                  <CardTitle>Geographical Heatmap</CardTitle>
                  <CardDescription>
                    Distribution of cases across the world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md border">
                    <div className="text-center">
                      <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Map Visualization
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        In a production environment, this would display a
                        heatmap of case locations using a mapping library like
                        Mapbox or Google Maps.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Cases</CardTitle>
                    <CardDescription>
                      Latest missing person reports
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Report Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : (
                        persons.slice(0, 10).map((person) => (
                          <TableRow key={person._id}>
                            <TableCell className="font-medium">
                              {person.name}
                            </TableCell>
                            <TableCell>{person.age}</TableCell>
                            <TableCell className="capitalize">
                              {person.gender}
                            </TableCell>
                            <TableCell>{person.lastSeenDate}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {person.lastSeenLocation}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  person.status === "missing"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {person.status === "missing"
                                  ? "Missing"
                                  : "Found"}
                              </Badge>
                            </TableCell>
                            <TableCell>{person.reportDate}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between border-t py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing 1-{Math.min(10, persons.length)} of {persons.length}{" "}
                    cases
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
