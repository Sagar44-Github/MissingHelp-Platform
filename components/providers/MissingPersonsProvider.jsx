"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Mock data for standalone functionality
const MOCK_MISSING_PERSONS = [
  {
    _id: "1",
    name: "John Doe",
    age: 25,
    gender: "male",
    description:
      "Last seen wearing a blue jacket and jeans. Has a small scar on his left cheek.",
    lastSeenDate: "2023-10-15",
    lastSeenLocation: "Central Park, New York",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    reportDate: "2023-10-16",
    region: "North America",
    country: "United States",
    coordinates: { lat: 40.7812, lng: -73.9665 },
    contact: {
      name: "Jane Doe",
      phone: "+1-555-123-4567",
      email: "jane.doe@example.com",
    },
  },
  {
    _id: "2",
    name: "Maria Garcia",
    age: 17,
    gender: "female",
    description:
      "Student missing after school. Was wearing school uniform - white shirt and navy skirt.",
    lastSeenDate: "2023-11-02",
    lastSeenLocation: "Main Street, Madrid, Spain",
    status: "found",
    photoUrl: "https://randomuser.me/api/portraits/women/46.jpg",
    reportDate: "2023-11-03",
    region: "Europe",
    country: "Spain",
    coordinates: { lat: 40.4168, lng: -3.7038 },
    contact: {
      name: "Luis Garcia",
      phone: "+34-555-987-6543",
      email: "luis.garcia@example.com",
    },
  },
  {
    _id: "3",
    name: "Amit Patel",
    age: 32,
    gender: "male",
    description:
      "Software engineer, last seen leaving work. Was wearing business casual attire.",
    lastSeenDate: "2023-09-28",
    lastSeenLocation: "Tech Park, Bangalore, India",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/men/72.jpg",
    reportDate: "2023-09-29",
    region: "Asia",
    country: "India",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    contact: {
      name: "Priya Patel",
      phone: "+91-555-234-5678",
      email: "priya.patel@example.com",
    },
  },
  {
    _id: "4",
    name: "Sophie Chen",
    age: 28,
    gender: "female",
    description:
      "Tourist missing during vacation. Last seen at beach. Has a butterfly tattoo on right shoulder.",
    lastSeenDate: "2023-11-12",
    lastSeenLocation: "Bondi Beach, Sydney, Australia",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/women/79.jpg",
    reportDate: "2023-11-13",
    region: "Australia/Oceania",
    country: "Australia",
    coordinates: { lat: -33.8915, lng: 151.2767 },
    contact: {
      name: "Wei Chen",
      phone: "+61-555-876-5432",
      email: "wei.chen@example.com",
    },
  },
  {
    _id: "5",
    name: "Mohammed Al-Farsi",
    age: 45,
    gender: "male",
    description:
      "Business executive missing after meeting. Last seen in business suit carrying black briefcase.",
    lastSeenDate: "2023-10-05",
    lastSeenLocation: "Downtown, Dubai, UAE",
    status: "found",
    photoUrl: "https://randomuser.me/api/portraits/men/19.jpg",
    reportDate: "2023-10-06",
    region: "Asia",
    country: "UAE",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    contact: {
      name: "Fatima Al-Farsi",
      phone: "+971-555-345-6789",
      email: "fatima.alfarsi@example.com",
    },
  },
  {
    _id: "6",
    name: "Isabella Martinez",
    age: 19,
    gender: "female",
    description:
      "College student missing after party. Last seen wearing red dress and black heels.",
    lastSeenDate: "2023-11-07",
    lastSeenLocation: "University District, Mexico City, Mexico",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    reportDate: "2023-11-08",
    region: "North America",
    country: "Mexico",
    coordinates: { lat: 19.4326, lng: -99.1332 },
    contact: {
      name: "Carlos Martinez",
      phone: "+52-555-456-7890",
      email: "carlos.martinez@example.com",
    },
  },
  {
    _id: "7",
    name: "Jamal Nkosi",
    age: 22,
    gender: "male",
    description:
      "Athlete missing after training. Last seen in track suit and running shoes.",
    lastSeenDate: "2023-10-22",
    lastSeenLocation: "Sports Complex, Nairobi, Kenya",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/men/40.jpg",
    reportDate: "2023-10-23",
    region: "Africa",
    country: "Kenya",
    coordinates: { lat: -1.2864, lng: 36.8172 },
    contact: {
      name: "Amara Nkosi",
      phone: "+254-555-567-8901",
      email: "amara.nkosi@example.com",
    },
  },
  {
    _id: "8",
    name: "Elena Petrova",
    age: 34,
    gender: "female",
    description:
      "Journalist missing while investigating story. Last seen in casual attire with press badge.",
    lastSeenDate: "2023-09-15",
    lastSeenLocation: "Central District, Moscow, Russia",
    status: "found",
    photoUrl: "https://randomuser.me/api/portraits/women/53.jpg",
    reportDate: "2023-09-16",
    region: "Europe",
    country: "Russia",
    coordinates: { lat: 55.7558, lng: 37.6173 },
    contact: {
      name: "Dmitri Petrov",
      phone: "+7-555-678-9012",
      email: "dmitri.petrov@example.com",
    },
  },
  {
    _id: "9",
    name: "Liam Johnson",
    age: 8,
    gender: "male",
    description:
      "Child missing from playground. Last seen wearing blue t-shirt, jeans, and red sneakers.",
    lastSeenDate: "2023-11-18",
    lastSeenLocation: "City Park, Toronto, Canada",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/boys/15.jpg",
    reportDate: "2023-11-18",
    region: "North America",
    country: "Canada",
    coordinates: { lat: 43.6532, lng: -79.3832 },
    contact: {
      name: "Sarah Johnson",
      phone: "+1-555-789-0123",
      email: "sarah.johnson@example.com",
    },
  },
  {
    _id: "10",
    name: "Ana Silva",
    age: 29,
    gender: "female",
    description:
      "Environmental activist missing during protest. Last seen wearing green jacket with organization logo.",
    lastSeenDate: "2023-10-10",
    lastSeenLocation: "Downtown, Rio de Janeiro, Brazil",
    status: "missing",
    photoUrl: "https://randomuser.me/api/portraits/women/85.jpg",
    reportDate: "2023-10-11",
    region: "South America",
    country: "Brazil",
    coordinates: { lat: -22.9068, lng: -43.1729 },
    contact: {
      name: "Paulo Silva",
      phone: "+55-555-890-1234",
      email: "paulo.silva@example.com",
    },
  },
];

const MissingPersonsContext = createContext();

export function MissingPersonsProvider({ children }) {
  const [missingPersons, setMissingPersons] = useState(MOCK_MISSING_PERSONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  // Active filters with defaults
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    ageRange: [0, 100],
    gender: "any",
    dateFrom: null,
    location: {
      region: undefined,
      country: undefined,
      city: undefined,
    },
    recentOnly: false,
  });

  // Mock location data
  const regions = [
    { id: "north_america", name: "North America" },
    { id: "south_america", name: "South America" },
    { id: "europe", name: "Europe" },
    { id: "africa", name: "Africa" },
    { id: "asia", name: "Asia" },
    { id: "australia", name: "Australia/Oceania" },
  ];

  const countries = [
    { id: "us", name: "United States", region: "north_america" },
    { id: "ca", name: "Canada", region: "north_america" },
    { id: "mx", name: "Mexico", region: "north_america" },
    { id: "br", name: "Brazil", region: "south_america" },
    { id: "ar", name: "Argentina", region: "south_america" },
    { id: "uk", name: "United Kingdom", region: "europe" },
    { id: "fr", name: "France", region: "europe" },
    { id: "de", name: "Germany", region: "europe" },
    { id: "za", name: "South Africa", region: "africa" },
    { id: "ng", name: "Nigeria", region: "africa" },
    { id: "in", name: "India", region: "asia" },
    { id: "cn", name: "China", region: "asia" },
    { id: "jp", name: "Japan", region: "asia" },
    { id: "au", name: "Australia", region: "australia" },
    { id: "nz", name: "New Zealand", region: "australia" },
  ];

  const cities = [
    { id: "nyc", name: "New York", country: "us" },
    { id: "la", name: "Los Angeles", country: "us" },
    { id: "tor", name: "Toronto", country: "ca" },
    { id: "van", name: "Vancouver", country: "ca" },
    { id: "mex", name: "Mexico City", country: "mx" },
    { id: "rio", name: "Rio de Janeiro", country: "br" },
    { id: "sp", name: "São Paulo", country: "br" },
    { id: "ba", name: "Buenos Aires", country: "ar" },
    { id: "lon", name: "London", country: "uk" },
    { id: "par", name: "Paris", country: "fr" },
    { id: "ber", name: "Berlin", country: "de" },
    { id: "jb", name: "Johannesburg", country: "za" },
    { id: "cpt", name: "Cape Town", country: "za" },
    { id: "lag", name: "Lagos", country: "ng" },
    { id: "del", name: "New Delhi", country: "in" },
    { id: "mum", name: "Mumbai", country: "in" },
    { id: "bj", name: "Beijing", country: "cn" },
    { id: "sh", name: "Shanghai", country: "cn" },
    { id: "tok", name: "Tokyo", country: "jp" },
    { id: "syd", name: "Sydney", country: "au" },
    { id: "mel", name: "Melbourne", country: "au" },
    { id: "auk", name: "Auckland", country: "nz" },
  ];

  // Filter setter functions
  const setSearchFilter = (value) => {
    setActiveFilters((prev) => ({ ...prev, search: value }));
  };

  const setAgeRangeFilter = (value) => {
    setActiveFilters((prev) => ({ ...prev, ageRange: value }));
  };

  const setGenderFilter = (value) => {
    setActiveFilters((prev) => ({ ...prev, gender: value }));
  };

  const setDateFromFilter = (value) => {
    setActiveFilters((prev) => ({ ...prev, dateFrom: value }));
  };

  const setLocationFilter = (location) => {
    setActiveFilters((prev) => ({
      ...prev,
      location: { ...prev.location, ...location },
    }));
  };

  const setRecentOnlyFilter = (value) => {
    setActiveFilters((prev) => ({ ...prev, recentOnly: value }));
  };

  const resetFilters = () => {
    setActiveFilters({
      search: "",
      ageRange: [0, 100],
      gender: "any",
      dateFrom: null,
      location: {
        region: undefined,
        country: undefined,
        city: undefined,
      },
      recentOnly: false,
    });
  };

  const fetchMissingPersons = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In standalone mode, we just simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use our mock data
      setMissingPersons(MOCK_MISSING_PERSONS);
    } catch (error) {
      console.error("Error fetching missing persons:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addMissingPerson = async (personData) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // If an ID is already provided, use it, otherwise generate one
      const newPerson = {
        ...personData,
        _id: personData._id || Math.random().toString(36).substr(2, 9),
        reportDate:
          personData.reportDate || new Date().toISOString().split("T")[0],
      };

      console.log("Adding new missing person:", newPerson);

      setMissingPersons((prev) => [newPerson, ...prev]);
      setIsLoading(false);
      return newPerson;
    } catch (error) {
      console.error("Error adding missing person:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const updateMissingPerson = async (id, updates) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedPersons = missingPersons.map((person) =>
        person._id === id ? { ...person, ...updates } : person
      );

      setMissingPersons(updatedPersons);
      setIsLoading(false);
      return updatedPersons.find((p) => p._id === id);
    } catch (error) {
      console.error("Error updating missing person:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const deleteMissingPerson = async (id) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setMissingPersons((prev) => prev.filter((person) => person._id !== id));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error deleting missing person:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const getMissingPersonById = (id) => {
    return missingPersons.find((person) => person._id === id);
  };

  // Filter the missing persons based on filters and search term
  const filteredMissingPersons = missingPersons.filter((person) => {
    if (!person) return false;

    // Search term filter
    if (
      searchTerm &&
      !(
        (person.name &&
          person.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.description &&
          person.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (person.lastSeenLocation &&
          person.lastSeenLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      )
    ) {
      return false;
    }

    // Status filter
    if (filters.status && person.status !== filters.status) {
      return false;
    }

    // Region filter
    if (filters.region && person.region !== filters.region) {
      return false;
    }

    // Gender filter
    if (filters.gender && person.gender !== filters.gender) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    fetchMissingPersons();
  }, []);

  const value = {
    missingPersons: filteredMissingPersons,
    allMissingPersons: missingPersons, // Original unfiltered list
    isLoading,
    error,
    filters,
    searchTerm,
    setFilters,
    setSearchTerm,
    fetchMissingPersons,
    addMissingPerson,
    updateMissingPerson,
    deleteMissingPerson,
    getMissingPersonById,
    // Add new filter-related data and functions
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
  };

  return (
    <MissingPersonsContext.Provider value={value}>
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
