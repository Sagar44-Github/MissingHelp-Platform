"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  onSearch?: (term: string) => void;
}

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setFilters } = useMissingPersons();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = [
    "North America",
    "South America",
    "Europe",
    "Africa",
    "Asia",
    "Australia/Oceania",
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const selectRegion = (region: string) => {
    setSelectedRegion(region);
    setFilters((prev) => ({ ...prev, region }));
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="flex items-center p-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or description..."
              className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-1">
                <MapPin className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Region</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {regions.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => selectRegion(region)}
                  className={cn(selectedRegion === region && "bg-muted")}
                >
                  {region}
                </DropdownMenuItem>
              ))}
              {selectedRegion && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRegion(null);
                      setFilters((prev) => {
                        const newFilters = { ...prev };
                        delete newFilters.region;
                        return newFilters;
                      });
                    }}
                    className="text-destructive"
                  >
                    Clear Selection
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-1">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setFilters((prev) => ({ ...prev, status: "missing" }))
                }
              >
                Missing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setFilters((prev) => ({ ...prev, status: "found" }))
                }
              >
                Found
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({})}>
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleSearch}>Search</Button>
        </div>

        {selectedRegion && (
          <div className="px-4 py-2 bg-muted/30 border-t flex items-center justify-between">
            <div className="flex items-center text-sm">
              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>
                Region: <span className="font-medium">{selectedRegion}</span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                setSelectedRegion(null);
                setFilters((prev) => {
                  const newFilters = { ...prev };
                  delete newFilters.region;
                  return newFilters;
                });
              }}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
