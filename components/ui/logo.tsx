"use client";

import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <MapPin
          className={cn("text-primary fill-primary/30", sizeClasses[size])}
        />
        <Search
          className={cn(
            "absolute text-primary h-3 w-3",
            size === "sm" ? "h-2 w-2" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
          )}
          style={{ transform: "translate(-30%, -30%) rotate(-45deg)" }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight leading-none text-foreground",
              textSizeClasses[size]
            )}
          >
            FindThem
          </span>
          <span className="text-xs text-muted-foreground leading-none mt-0.5">
            Missing Persons Locator
          </span>
        </div>
      )}
    </Link>
  );
}
