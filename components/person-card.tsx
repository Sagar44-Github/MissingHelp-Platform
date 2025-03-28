"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, Share2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  person: {
    _id: string;
    name: string;
    age: number;
    status: "missing" | "found";
    region: string;
    photoUrl: string;
    description: string;
    lastSeenLocation: string;
    lastSeenDate: string;
  };
  index?: number;
}

export function PersonCard({ person, index = 0 }: PersonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      custom={index}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="absolute top-0 left-0 w-full p-3 flex justify-between z-10">
            <Badge
              variant={person.status === "missing" ? "destructive" : "outline"}
            >
              {person.status === "missing" ? "Missing" : "Found"}
            </Badge>
            <Badge variant="outline">{person.region}</Badge>
          </div>

          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={person.photoUrl}
              alt={person.name}
              loading="lazy"
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 filter-none shadow-none",
                isHovered && "scale-110"
              )}
              style={{ imageRendering: "high-quality" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <h3 className="text-xl font-bold mb-1 truncate">{person.name}</h3>
            <div className="flex items-center text-sm space-x-2 text-white/80">
              <Clock className="h-3.5 w-3.5" />
              <span>{person.age} years old</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <span className="truncate">
              Last seen:{" "}
              <span className="font-medium">{person.lastSeenLocation}</span>
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <span>Date: {person.lastSeenDate}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {person.description}
          </p>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-primary hover:bg-primary/10"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Link href={`/person/${person._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
