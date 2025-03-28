"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  UserPlus,
  Sun,
  Moon,
  Menu,
  Search,
  BarChart,
  Camera,
  Globe,
  ThermometerSun,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { NotificationCenter } from "@/components/notification-center";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          <Logo />

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Regions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {regions.map((region) => (
                      <ListItem
                        key={region.title}
                        title={region.title}
                        href={region.href}
                      >
                        {region.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/map" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <MapPin className="mr-2 h-4 w-4" />
                    Map View
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/search" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <Search className="mr-2 h-4 w-4" />
                    Advanced Search
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/facial-recognition" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Facial Recognition
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/heatmap" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <ThermometerSun className="h-4 w-4 mr-2" />
                    Heatmap
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/community" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Community
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="mr-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Mobile report button */}
          <Link href="/report" className="md:hidden">
            <Button variant="default" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Report
            </Button>
          </Link>

          {/* Desktop action buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <Link href="/report">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Report Missing Person
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Logo className="mb-8" />

                <Link
                  href="/"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  href="/map"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="font-medium">Map View</span>
                </Link>
                <Link
                  href="/search"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span className="font-medium">Advanced Search</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  <span className="font-medium">Analytics</span>
                </Link>
                <Link
                  href="/report"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="font-medium">Report Missing Person</span>
                </Link>
                <Link
                  href="/facial-recognition"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Facial Recognition
                </Link>
                <Link
                  href="/heatmap"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <ThermometerSun className="h-4 w-4" />
                  Heatmap
                </Link>
                <Link
                  href="/community"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Community
                </Link>

                <div className="mt-6 border-t pt-6">
                  <h3 className="mb-2 text-sm font-medium">Regions</h3>
                  {regions.map((region) => (
                    <Link
                      key={region.title}
                      href={region.href}
                      className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                    >
                      <span className="text-sm">{region.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const regions = [
  {
    title: "North America",
    href: "/regions/north-america",
    description: "Missing persons in the USA, Canada, and Mexico.",
  },
  {
    title: "South America",
    href: "/regions/south-america",
    description:
      "Missing persons in Brazil, Argentina, and other South American countries.",
  },
  {
    title: "Europe",
    href: "/regions/europe",
    description:
      "Missing persons in the UK, France, Germany, and other European countries.",
  },
  {
    title: "Asia",
    href: "/regions/asia",
    description:
      "Missing persons in Japan, China, India, and other Asian countries.",
  },
  {
    title: "Africa",
    href: "/regions/africa",
    description: "Missing persons across the African continent.",
  },
  {
    title: "Oceania",
    href: "/regions/oceania",
    description:
      "Missing persons in Australia, New Zealand, and Pacific islands.",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
