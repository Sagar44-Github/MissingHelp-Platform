"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  MISSING_PERSONS,
  GLOBAL_REGIONS,
  COUNTRIES,
  MAJOR_CITIES,
} from "./data";
import { MissingPerson } from "@/types/missing-person";

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationFilter = {
  region?: string;
  country?: string;
  city?: string;
};

type MissingPersonsContextType = {
  persons: MissingPerson[];
  filteredPersons: MissingPerson[];
  activeFilters: {
    search: string;
    ageRange: [number, number];
    gender?: string;
    dateFrom?: Date;
    location: LocationFilter;
    recentOnly: boolean;
  };
  regions: typeof GLOBAL_REGIONS;
  countries: typeof COUNTRIES;
  cities: typeof MAJOR_CITIES;
  setSearchFilter: (search: string) => void;
  setAgeRangeFilter: (range: [number, number]) => void;
  setGenderFilter: (gender?: string) => void;
  setDateFromFilter: (date?: Date) => void;
  setLocationFilter: (location: LocationFilter) => void;
  setRecentOnlyFilter: (recent: boolean) => void;
  resetFilters: () => void;
  markAsFound: (id: string) => void;
  addPerson: (person: MissingPerson) => void;
  updatePersonStatus: (id: string, status: "missing" | "found") => void;
};

const MissingPersonsContext = createContext<
  MissingPersonsContextType | undefined
>(undefined);

export function MissingPersonsProvider({ children }: { children: ReactNode }) {
  const [persons, setPersons] = useState<MissingPerson[]>(MISSING_PERSONS);
  const [filters, setFilters] = useState({
    search: "",
    ageRange: [0, 100] as [number, number],
    gender: undefined as string | undefined,
    dateFrom: undefined as Date | undefined,
    location: {} as LocationFilter,
    recentOnly: true,
  });

  // Filter persons based on active filters
  const filteredPersons = persons.filter((person) => {
    // Search filter
    if (
      filters.search &&
      !person.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !person.lastSeenLocation
        ?.toLowerCase()
        .includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Age range filter
    if (person.age < filters.ageRange[0] || person.age > filters.ageRange[1]) {
      return false;
    }

    // Gender filter
    if (filters.gender && filters.gender !== "any") {
      // In a real app, you would have a gender field
      // This is a mock implementation
      const mockGenderMap: Record<string, string[]> = {
        male: ["1", "3", "5", "7", "10"],
        female: ["2", "4", "6", "8", "9"],
      };

      if (!mockGenderMap[filters.gender].includes(person._id)) {
        return false;
      }
    }

    // Date filter
    if (filters.dateFrom) {
      const lastSeenDate = new Date(person.lastSeenDate);
      if (lastSeenDate < filters.dateFrom) {
        return false;
      }
    }

    // Location filter
    if (
      filters.location.region ||
      filters.location.country ||
      filters.location.city
    ) {
      // In a real app, you would have region, country, city fields
      // This is a mock implementation for filtering by location
      const locationLower = person.lastSeenLocation?.toLowerCase() || "";

      if (filters.location.city) {
        const city = MAJOR_CITIES.find((c) => c.id === filters.location.city);
        if (city && !locationLower.includes(city.name.toLowerCase())) {
          return false;
        }
      } else if (filters.location.country) {
        const country = COUNTRIES.find(
          (c) => c.id === filters.location.country
        );
        if (country && !locationLower.includes(country.name.toLowerCase())) {
          return false;
        }
      } else if (filters.location.region) {
        const region = GLOBAL_REGIONS.find(
          (r) => r.id === filters.location.region
        );
        const countriesInRegion = COUNTRIES.filter(
          (c) => c.region === filters.location.region
        );
        const countryNames = countriesInRegion.map((c) => c.name.toLowerCase());

        if (
          region &&
          !countryNames.some((name) => locationLower.includes(name))
        ) {
          return false;
        }
      }
    }

    // Recent only filter
    if (filters.recentOnly && person.daysAgo > 7) {
      return false;
    }

    return true;
  });

  const setSearchFilter = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const setAgeRangeFilter = (ageRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, ageRange }));
  };

  const setGenderFilter = (gender?: string) => {
    setFilters((prev) => ({ ...prev, gender }));
  };

  const setDateFromFilter = (dateFrom?: Date) => {
    setFilters((prev) => ({ ...prev, dateFrom }));
  };

  const setLocationFilter = (location: LocationFilter) => {
    setFilters((prev) => ({ ...prev, location }));
  };

  const setRecentOnlyFilter = (recentOnly: boolean) => {
    setFilters((prev) => ({ ...prev, recentOnly }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      ageRange: [0, 100],
      gender: undefined,
      dateFrom: undefined,
      location: {},
      recentOnly: true,
    });
  };

  const markAsFound = (id: string) => {
    setPersons((prev) =>
      prev.map((person) =>
        person._id === id ? { ...person, status: "found" } : person
      )
    );
  };

  const addPerson = (person: MissingPerson) => {
    setPersons((prev) => [...prev, person]);
  };

  const updatePersonStatus = (id: string, status: "missing" | "found") => {
    setPersons((prev) =>
      prev.map((person) => (person._id === id ? { ...person, status } : person))
    );
  };

  return (
    <MissingPersonsContext.Provider
      value={{
        persons,
        filteredPersons,
        activeFilters: filters,
        regions: GLOBAL_REGIONS,
        countries: COUNTRIES,
        cities: MAJOR_CITIES,
        setSearchFilter,
        setAgeRangeFilter,
        setGenderFilter,
        setDateFromFilter,
        setLocationFilter,
        setRecentOnlyFilter,
        resetFilters,
        markAsFound,
        addPerson,
        updatePersonStatus,
      }}
    >
      {children}
    </MissingPersonsContext.Provider>
  );
}

export function useMissingPersons() {
  const context = useContext(MissingPersonsContext);
  if (context === undefined) {
    throw new Error(
      "useMissingPersons must be used within a MissingPersonsProvider"
    );
  }
  return context;
}
