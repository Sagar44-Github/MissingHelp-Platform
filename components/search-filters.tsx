"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Search, X } from "lucide-react";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";

export function SearchFilters() {
  const {
    activeFilters,
    setSearchFilter,
    setAgeRangeFilter,
    setGenderFilter,
    setDateFromFilter,
    setLocationFilter,
    setRecentOnlyFilter,
    resetFilters,
    regions,
    countries,
    cities,
  } = useMissingPersons();

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchFilter) {
      setSearchFilter(e.target.value);
    }
  };

  // Handle reset button
  const handleReset = () => {
    if (resetFilters) {
      resetFilters();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="search"
            placeholder="Name or location..."
            className="pl-8"
            value={activeFilters?.search || ""}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Age Range: {activeFilters?.ageRange?.[0] || 0} -{" "}
          {activeFilters?.ageRange?.[1] || 100}
        </Label>
        <Slider
          max={100}
          step={1}
          value={activeFilters?.ageRange || [0, 100]}
          onValueChange={setAgeRangeFilter}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={activeFilters?.gender || "any"}
          onValueChange={setGenderFilter}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Last Seen Date (From)</Label>
        <DatePicker
          selected={activeFilters?.dateFrom || undefined}
          onSelect={setDateFromFilter}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select
          value={activeFilters?.location?.region || "any"}
          onValueChange={(value) =>
            setLocationFilter({
              region: value,
              country: undefined,
              city: undefined,
            })
          }
        >
          <SelectTrigger id="region">
            <SelectValue placeholder="Any region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any region</SelectItem>
            {regions &&
              regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {activeFilters?.location?.region && (
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={activeFilters?.location?.country || "any"}
            onValueChange={(value) =>
              setLocationFilter({
                ...activeFilters?.location,
                country: value,
                city: undefined,
              })
            }
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Any country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any country</SelectItem>
              {countries &&
                countries
                  .filter(
                    (country) =>
                      country.region === activeFilters?.location?.region
                  )
                  .map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {activeFilters?.location?.country && (
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select
            value={activeFilters?.location?.city || "any"}
            onValueChange={(value) =>
              setLocationFilter({
                ...activeFilters?.location,
                city: value,
              })
            }
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Any city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any city</SelectItem>
              {cities &&
                cities
                  .filter(
                    (city) => city.country === activeFilters?.location?.country
                  )
                  .map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="recent-only"
          checked={activeFilters?.recentOnly || false}
          onCheckedChange={setRecentOnlyFilter}
        />
        <Label htmlFor="recent-only">Recent reports only</Label>
      </div>

      <div className="pt-2 space-y-2">
        <Button className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleReset}
        >
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
