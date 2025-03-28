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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  User,
  Clock,
  Heart,
  Share,
  Flag,
  Send,
  Filter,
  Plus,
  Search,
  MapPin,
  RefreshCw,
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import Link from "next/link";

// Mock data for community forum posts
const MOCK_POSTS = [
  {
    id: "post1",
    title: "Missing Person: Rajesh (18) - Bangalore",
    content:
      "Missing person details:\nName: Rajesh\nAge: 18\nGender: Male\nDescription: Tall male\nLast seen: Bangalore, Karnataka\nPlease contact if you have any information.",
    author: {
      name: "Community Admin",
      avatar: "/avatars/avatar-default.png",
    },
    category: "Case Updates",
    location: "Bangalore, Karnataka, India",
    locationDetails: {
      country: "India",
      state: "Karnataka",
      place: "Bangalore",
      coordinates: {
        lat: 12.9716,
        lng: 77.5946,
      },
      formattedAddress: "Bangalore, Karnataka, India",
    },
    timestamp: "Just now",
    likes: 0,
    comments: 0,
    isBookmarked: false,
    images: [],
  },
  {
    id: "post2",
    title: "Volunteer Search Team in Central Park Area",
    content:
      "We're organizing a volunteer search team for the Central Park area this weekend. Looking for 10-15 people to help search for John Doe who was last seen in the area. Please reply if you're interested in joining!",
    author: {
      name: "Sarah Johnson",
      avatar: "/avatars/avatar-1.png",
    },
    category: "Search Coordination",
    region: "North America",
    location: "New York, USA",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    isBookmarked: false,
  },
  {
    id: "post3",
    title: "Possible Sighting in Madrid - Need Confirmation",
    content:
      "I believe I saw Maria Garcia yesterday near Plaza Mayor around 5pm. She was wearing a white shirt and jeans. I couldn't approach because I wasn't 100% sure, but it looked like her. Can anyone else confirm or check security cameras in the area?",
    author: {
      name: "Carlos Mendez",
      avatar: "/avatars/avatar-2.png",
    },
    category: "Sighting Reports",
    region: "Europe",
    location: "Madrid, Spain",
    timestamp: "5 hours ago",
    likes: 18,
    comments: 12,
    isBookmarked: true,
  },
  {
    id: "post4",
    title: "Community Awareness Initiative for Missing Children",
    content:
      "I'm starting a community awareness program focused on child safety and prevention of missing children cases. Looking for volunteers to help distribute information and organize workshops in schools. Let's work together to make our communities safer!",
    author: {
      name: "Emily Parker",
      avatar: "/avatars/avatar-3.png",
    },
    category: "Awareness & Prevention",
    region: "North America",
    location: "Toronto, Canada",
    timestamp: "1 day ago",
    likes: 45,
    comments: 23,
    isBookmarked: false,
  },
  {
    id: "post5",
    title: "Transportation Help Needed for Family of Missing Person",
    content:
      "A family from out of town needs help with transportation to assist in the search for their missing family member. They need rides between their hotel and various search locations for the next week. If you have a vehicle and some spare time, please reach out.",
    author: {
      name: "David Wilson",
      avatar: "/avatars/avatar-4.png",
    },
    category: "Support & Resources",
    region: "North America",
    location: "Chicago, USA",
    timestamp: "2 days ago",
    likes: 32,
    comments: 9,
    isBookmarked: false,
  },
  {
    id: "post6",
    title: "New Information on Sophie Chen Case",
    content:
      "I've spoken with a witness who may have important information about Sophie Chen's disappearance. The witness reported seeing someone matching her description at Bondi Beach around 7pm on the day she went missing, which is later than previously thought. Law enforcement has been notified.",
    author: {
      name: "Michael Tran",
      avatar: "/avatars/avatar-5.png",
    },
    category: "Case Updates",
    region: "Australia/Oceania",
    location: "Sydney, Australia",
    timestamp: "3 days ago",
    likes: 56,
    comments: 31,
    isBookmarked: true,
  },
];

// Mock comments data
const MOCK_COMMENTS = {
  post1: [
    {
      id: "comment1",
      content:
        "I can join the search team on Saturday morning. What time are you planning to meet?",
      author: {
        name: "Jessica Miller",
        avatar: "/avatars/avatar-6.png",
      },
      timestamp: "1 hour ago",
      likes: 3,
    },
    {
      id: "comment2",
      content:
        "I live nearby and know the area well. Count me in for both days if needed.",
      author: {
        name: "Robert Chen",
        avatar: "/avatars/avatar-7.png",
      },
      timestamp: "1 hour ago",
      likes: 2,
    },
  ],
  post2: [
    {
      id: "comment3",
      content:
        "I was in the area yesterday too but didn't notice anyone matching the description. Did you take any photos?",
      author: {
        name: "Ana Rodriguez",
        avatar: "/avatars/avatar-8.png",
      },
      timestamp: "3 hours ago",
      likes: 1,
    },
    {
      id: "comment4",
      content:
        "I work at a shop near Plaza Mayor. I'll check our security footage and let you know if I find anything.",
      author: {
        name: "Miguel Fernandez",
        avatar: "/avatars/avatar-9.png",
      },
      timestamp: "4 hours ago",
      likes: 7,
    },
  ],
};

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General Discussion",
    authorName: "",
    country: "",
    state: "",
    place: "",
    images: [] as string[],
  });
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Community post categories
  const POST_CATEGORIES = [
    "General Discussion",
    "Search Coordination",
    "Sighting Reports",
    "Case Updates",
    "Support & Resources",
    "Awareness & Prevention",
  ];

  // Locations organized by regions
  const LOCATIONS_BY_REGION = {
    "North America": [
      "New York, USA",
      "Los Angeles, USA",
      "Toronto, Canada",
      "Mexico City, Mexico",
      "Chicago, USA",
    ],
    "South America": [
      "Rio de Janeiro, Brazil",
      "São Paulo, Brazil",
      "Buenos Aires, Argentina",
      "Lima, Peru",
    ],
    Europe: [
      "London, UK",
      "Madrid, Spain",
      "Paris, France",
      "Berlin, Germany",
      "Moscow, Russia",
    ],
    Asia: [
      "Tokyo, Japan",
      "Beijing, China",
      "Mumbai, India",
      "Dubai, UAE",
      "Bangkok, Thailand",
    ],
    Africa: [
      "Nairobi, Kenya",
      "Cairo, Egypt",
      "Lagos, Nigeria",
      "Cape Town, South Africa",
    ],
    "Australia/Oceania": [
      "Sydney, Australia",
      "Melbourne, Australia",
      "Auckland, New Zealand",
    ],
  };

  // Available regions for posts
  const REGIONS = Object.keys(LOCATIONS_BY_REGION);
  const [selectedRegion, setSelectedRegion] = useState("North America");

  // Countries for location selection
  const COUNTRIES = [
    "United States",
    "Canada",
    "Mexico",
    "Brazil",
    "Argentina",
    "United Kingdom",
    "France",
    "Germany",
    "Spain",
    "Italy",
    "Russia",
    "China",
    "India",
    "Japan",
    "Australia",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Egypt",
    "UAE",
  ];

  // States/provinces by country
  const STATES_BY_COUNTRY: Record<string, string[]> = {
    "United States": [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
    India: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
    ],
    Canada: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Northwest Territories",
      "Nova Scotia",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon",
    ],
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    Australia: [
      "New South Wales",
      "Queensland",
      "South Australia",
      "Tasmania",
      "Victoria",
      "Western Australia",
    ],
    // Other countries would have their own states/provinces
  };

  // Add coordinates mapping for major cities
  const CITY_COORDINATES: Record<
    string,
    Record<string, Record<string, { lat: number; lng: number }>>
  > = {
    India: {
      Karnataka: {
        Bangalore: { lat: 12.9716, lng: 77.5946 },
        Mysore: { lat: 12.2958, lng: 76.6394 },
        Hubli: { lat: 15.3647, lng: 75.124 },
      },
      Maharashtra: {
        Mumbai: { lat: 19.076, lng: 72.8777 },
        Pune: { lat: 18.5204, lng: 73.8567 },
      },
      // Add more cities as needed
    },
    // Add more countries and their cities
  };

  // Selected country and corresponding states
  const [selectedCountry, setSelectedCountry] = useState("");
  const availableStates =
    selectedCountry && STATES_BY_COUNTRY[selectedCountry]
      ? STATES_BY_COUNTRY[selectedCountry]
      : [];

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const searchTerms = searchQuery.toLowerCase().trim();

    if (searchTerms === "") {
      // If no search term, just filter by category
      return selectedCategory === null || post.category === selectedCategory;
    }

    // Search in title, content, author name, and location
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerms) ||
      post.content?.toLowerCase().includes(searchTerms) ||
      post.author?.name?.toLowerCase().includes(searchTerms) ||
      post.location?.toLowerCase().includes(searchTerms);

    const matchesCategory =
      selectedCategory === null || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Toggle bookmark status
  const toggleBookmark = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes + (post.liked ? -1 : 1),
              liked: !post.liked,
            }
          : post
      )
    );
  };

  // Handle comment submission
  const handleCommentSubmit = (postId: string) => {
    if (!newComment.trim()) return;

    // In a real app, this would send the comment to a backend
    console.log(`New comment on post ${postId}: ${newComment}`);

    // Clear comment input
    setNewComment("");

    // Show success message or update UI
    alert("Comment submitted successfully!");
  };

  // Add image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to base64 strings
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Add image preview component
  const ImagePreview = ({
    images,
    onRemove,
  }: {
    images: string[];
    onRemove: (index: number) => void;
  }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image}
            alt={`Preview ${index + 1}`}
            className="w-full h-24 object-cover rounded-md"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
            title="Remove image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("communityPosts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(MOCK_POSTS);
      localStorage.setItem("communityPosts", JSON.stringify(MOCK_POSTS));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("communityPosts", JSON.stringify(posts));
    }
  }, [posts]);

  // Handle new post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newPost.title.trim() ||
      !newPost.content.trim() ||
      !newPost.authorName.trim()
    )
      return;

    setIsLoading(true);

    // Format location with structured data including the place
    const formattedLocation = [newPost.place, newPost.state, newPost.country]
      .filter(Boolean)
      .join(", ");

    // Get coordinates for the location
    let coordinates = { lat: 0, lng: 0 };
    try {
      if (newPost.country && newPost.state && newPost.place) {
        const countryData =
          CITY_COORDINATES[newPost.country as keyof typeof CITY_COORDINATES];
        if (
          countryData &&
          countryData[newPost.state as keyof typeof countryData]
        ) {
          const stateData =
            countryData[newPost.state as keyof typeof countryData];
          const cityData = stateData[newPost.place as keyof typeof stateData];
          if (cityData) {
            coordinates = cityData;
          }
        }
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }

    // Create location details object with proper structure
    const locationDetails = {
      country: newPost.country,
      state: newPost.state,
      place: newPost.place,
      coordinates: coordinates,
      formattedAddress: formattedLocation,
    };

    // Generate a unique ID for the new post
    const newPostId = `post${Date.now()}`;

    // Create new post
    const post = {
      id: newPostId,
      title: newPost.title,
      content: newPost.content,
      author: {
        name: newPost.authorName,
        avatar: "/avatars/avatar-default.png",
      },
      category: newPost.category,
      location: formattedLocation,
      locationDetails: locationDetails,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      isBookmarked: false,
      images: newPost.images,
    };

    // Add new post to the list and update localStorage
    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));

    // Reset form and state
    setNewPost({
      title: "",
      content: "",
      category: "General Discussion",
      authorName: "",
      country: "",
      state: "",
      place: "",
      images: [],
    });
    setSelectedCountry("");
    setIsCreatingPost(false);
    setIsLoading(false);

    // Show success message and clear any search
    setSearchQuery("");
    alert(
      "Post successfully added! Your post is now visible in the community."
    );
  };

  // Handle post deletion
  const handleDeletePost = (postId: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (shouldDelete) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2">
                Community
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Community Forum
              </h1>
              <p className="text-muted-foreground">
                Connect with others, share information, and coordinate efforts
                to help find missing persons
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <CardTitle>Community Posts</CardTitle>
                        <CardDescription>
                          Share information and coordinate with others
                        </CardDescription>
                      </div>
                      <Button onClick={() => setIsCreatingPost(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-1">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search posts by title, content, name or location..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex gap-2">
                            <Filter className="h-4 w-4" />
                            {selectedCategory || "All Categories"}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px]">
                          <DropdownMenuItem
                            onClick={() => setSelectedCategory(null)}
                          >
                            All Categories
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedCategory("Search Coordination")
                            }
                          >
                            Search Coordination
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedCategory("Sighting Reports")
                            }
                          >
                            Sighting Reports
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedCategory("Case Updates")}
                          >
                            Case Updates
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedCategory("Support & Resources")
                            }
                          >
                            Support & Resources
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedCategory("Awareness & Prevention")
                            }
                          >
                            Awareness & Prevention
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedCategory("General Discussion")
                            }
                          >
                            General Discussion
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {isCreatingPost ? (
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Create New Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form
                            onSubmit={handlePostSubmit}
                            className="space-y-4"
                          >
                            <div>
                              <Input
                                placeholder="Post title"
                                value={newPost.title}
                                onChange={(e) =>
                                  setNewPost({
                                    ...newPost,
                                    title: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Input
                                placeholder="Your Name"
                                value={newPost.authorName}
                                onChange={(e) =>
                                  setNewPost({
                                    ...newPost,
                                    authorName: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Textarea
                                placeholder="Post content..."
                                rows={5}
                                value={newPost.content}
                                onChange={(e) =>
                                  setNewPost({
                                    ...newPost,
                                    content: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Category
                                </label>
                                <select
                                  className="w-full p-2 border rounded-md"
                                  value={newPost.category}
                                  onChange={(e) =>
                                    setNewPost({
                                      ...newPost,
                                      category: e.target.value,
                                    })
                                  }
                                  aria-label="Post category"
                                >
                                  {POST_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Country
                                </label>
                                <select
                                  className="w-full p-2 border rounded-md"
                                  value={selectedCountry}
                                  onChange={(e) => {
                                    const country = e.target.value;
                                    setSelectedCountry(country);
                                    setNewPost({
                                      ...newPost,
                                      country: country,
                                      state: "", // Reset state when country changes
                                      place: "", // Reset place when country changes
                                    });
                                  }}
                                  aria-label="Country selection"
                                >
                                  <option value="">Select a country</option>
                                  {COUNTRIES.map((country) => (
                                    <option key={country} value={country}>
                                      {country}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  State/Province
                                </label>
                                <select
                                  className="w-full p-2 border rounded-md"
                                  value={newPost.state}
                                  onChange={(e) =>
                                    setNewPost({
                                      ...newPost,
                                      state: e.target.value,
                                      place: "", // Reset place when state changes
                                    })
                                  }
                                  disabled={!selectedCountry}
                                  aria-label="State/Province selection"
                                >
                                  <option value="">
                                    Select a state/province
                                  </option>
                                  {selectedCountry &&
                                    STATES_BY_COUNTRY[selectedCountry]?.map(
                                      (state: string) => (
                                        <option key={state} value={state}>
                                          {state}
                                        </option>
                                      )
                                    )}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Place/City
                                </label>
                                <Input
                                  placeholder="Enter city or place name"
                                  value={newPost.place}
                                  onChange={(e) =>
                                    setNewPost({
                                      ...newPost,
                                      place: e.target.value,
                                    })
                                  }
                                  disabled={!newPost.state}
                                  aria-label="Place/City input"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Images
                              </label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  id="image-upload"
                                />
                                <label
                                  htmlFor="image-upload"
                                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted/50"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>Upload Images</span>
                                </label>
                              </div>
                              {newPost.images.length > 0 && (
                                <ImagePreview
                                  images={newPost.images}
                                  onRemove={(index) => {
                                    setNewPost((prev) => ({
                                      ...prev,
                                      images: prev.images.filter(
                                        (_, i) => i !== index
                                      ),
                                    }));
                                  }}
                                />
                              )}
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreatingPost(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                  </>
                                ) : (
                                  "Post"
                                )}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    ) : null}

                    <div className="space-y-4">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                          <Card
                            key={post.id}
                            className="border-l-4 border-l-primary hover:bg-muted/10 transition-colors"
                          >
                            <CardHeader className="py-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">
                                    {post.title}
                                  </CardTitle>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline">
                                      {post.category}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {post.location}
                                    </div>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => toggleBookmark(post.id)}
                                    >
                                      {post.isBookmarked
                                        ? "Unbookmark"
                                        : "Bookmark"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          `${window.location.origin}/community?post=${post.id}`
                                        )
                                      }
                                    >
                                      Copy Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeletePost(post.id)}
                                      className="text-red-500"
                                    >
                                      Delete Post
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="py-2">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {post.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {post.author.name}
                                  </div>
                                  <p className="mt-1 text-sm line-clamp-3">
                                    {post.content}
                                  </p>
                                  {post.images && post.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                      {post.images.map(
                                        (image: string, index: number) => (
                                          <img
                                            key={index}
                                            src={image}
                                            alt={`Post image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() =>
                                              window.open(image, "_blank")
                                            }
                                          />
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2 pb-4 flex justify-between">
                              <div className="flex gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => toggleLike(post.id)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() =>
                                    setSelectedPost(
                                      selectedPost === post.id ? null : post.id
                                    )
                                  }
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1"
                              >
                                <Share className="h-4 w-4" />
                                <span>Share</span>
                              </Button>
                            </CardFooter>

                            {selectedPost === post.id && (
                              <div className="bg-muted/20 px-6 py-4 border-t">
                                <h4 className="font-medium mb-3">Comments</h4>
                                <div className="space-y-4 mb-4">
                                  {MOCK_COMMENTS[
                                    post.id as keyof typeof MOCK_COMMENTS
                                  ] ? (
                                    MOCK_COMMENTS[
                                      post.id as keyof typeof MOCK_COMMENTS
                                    ].map((comment: any) => (
                                      <div
                                        key={comment.id}
                                        className="flex gap-3"
                                      >
                                        <Avatar className="h-8 w-8 mt-0.5">
                                          <AvatarFallback>
                                            {comment.author.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="bg-muted/50 rounded-lg px-3 py-2">
                                            <div className="flex justify-between text-sm">
                                              <span className="font-medium">
                                                {comment.author.name}
                                              </span>
                                              <span className="text-muted-foreground text-xs">
                                                {comment.timestamp}
                                              </span>
                                            </div>
                                            <p className="text-sm mt-1">
                                              {comment.content}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 mt-1 ml-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 text-xs"
                                            >
                                              <Heart className="h-3 w-3 mr-1" />
                                              {comment.likes}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 text-xs"
                                            >
                                              Reply
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-muted-foreground text-sm">
                                      No comments yet. Be the first to comment!
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) =>
                                      setNewComment(e.target.value)
                                    }
                                  />
                                  <Button
                                    onClick={() => handleCommentSubmit(post.id)}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="text-lg font-medium mb-1">
                            No posts found
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {selectedCategory
                              ? `No posts found in ${selectedCategory} category.`
                              : "No posts match your search criteria."}
                          </p>
                          <Button
                            onClick={() => {
                              setSelectedCategory(null);
                              setSearchQuery("");
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="font-medium mb-1">Members</div>
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">
                        Join our community to participate in discussions
                      </p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="font-medium mb-1">Active Searches</div>
                      <div className="text-2xl font-bold">16</div>
                      <p className="text-xs text-muted-foreground">
                        Ongoing community search efforts
                      </p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="font-medium mb-1">Success Stories</div>
                      <div className="text-2xl font-bold">42</div>
                      <p className="text-xs text-muted-foreground">
                        Persons found with community assistance
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">Be Respectful</div>
                      <p className="text-muted-foreground text-xs">
                        Treat others with respect and compassion.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-medium">Verify Information</div>
                      <p className="text-muted-foreground text-xs">
                        Share only verified information. Indicate if something
                        is unconfirmed.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-medium">Protect Privacy</div>
                      <p className="text-muted-foreground text-xs">
                        Respect privacy. Don't share sensitive personal
                        information.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-medium">Report Concerns</div>
                      <p className="text-muted-foreground text-xs">
                        Contact authorities first for urgent matters. Report
                        inappropriate content.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-3">
                        <div className="font-medium">
                          Community Search - Central Park
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 mb-2">
                          Saturday, July 15 • 9:00 AM - 2:00 PM
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            window.alert(
                              "Event details: Join our community search team at Central Park's Bethesda Fountain. We'll be organizing into small groups to cover the surrounding area. Bring water, comfortable shoes, and a fully charged phone. Contact Sarah at 555-123-4567 for more details."
                            )
                          }
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="font-medium">
                          Missing Persons Awareness Workshop
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 mb-2">
                          Tuesday, July 18 • 6:30 PM - 8:30 PM
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            window.alert(
                              "Event details: Workshop at the Community Center (123 Main St) focusing on prevention and awareness. Topics include child safety, creating effective missing person reports, and utilizing social media. Registration required, contact workshop@findthem.org."
                            )
                          }
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="font-medium">
                          Virtual Support Group Meeting
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 mb-2">
                          Thursday, July 20 • 7:00 PM - 8:30 PM
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            window.alert(
                              "Event details: Online Zoom support group for families of missing persons. This is a safe space to share experiences and receive emotional support. This month's topic: Coping with uncertainty. Meeting ID: 123-456-7890, Passcode: support"
                            )
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
