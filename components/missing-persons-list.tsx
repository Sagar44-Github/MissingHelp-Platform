"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Calendar, Globe, MapPin, Share2 } from "lucide-react";
import { useMissingPersons } from "@/components/providers/MissingPersonsProvider";
import { format } from "date-fns";

export function MissingPersonsList() {
  const { missingPersons } = useMissingPersons();
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate pagination
  const totalPages = Math.ceil(missingPersons.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = missingPersons.slice(startIndex, endIndex);

  // Navigate pages
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentItems.length > 0 ? (
          currentItems.map((person) => (
            <Card key={person._id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-1/3 h-[150px] sm:h-auto">
                  <Image
                    src={person.photoUrl || "/placeholder.svg"}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{person.name}</CardTitle>
                        <CardDescription>Age: {person.age}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          person.status === "missing"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {person.status === "missing" ? "Missing" : "Found"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Last seen{" "}
                        {new Date().getDate() -
                          new Date(person.lastSeenDate).getDate()}{" "}
                        days ago (
                        {format(new Date(person.lastSeenDate), "MMM d, yyyy")})
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{person.lastSeenLocation}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {person.coordinates.lat.toFixed(2)},{" "}
                        {person.coordinates.lng.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/person/${person._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center border rounded-lg bg-muted">
            <p className="text-muted-foreground">
              No results match your search criteria.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {missingPersons.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(endIndex, missingPersons.length)}
            </span>{" "}
            of <span className="font-medium">{missingPersons.length}</span>{" "}
            results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
