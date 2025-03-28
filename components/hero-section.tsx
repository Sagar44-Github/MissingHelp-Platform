"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/60 pt-16 pb-24">
      {/* Background pattern/grid */}
      <div className="absolute inset-0 bg-grid-small-background/[0.02] bg-[size:20px_20px]" />

      {/* Gradient orbs */}
      <div className="absolute -top-24 -left-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] opacity-20" />
      <div className="absolute -bottom-24 -right-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px] opacity-20" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-sm rounded-full border-primary/20"
            >
              <span className="text-primary mr-1">•</span>
              Together we can make a difference
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Help{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                locate
              </span>{" "}
              missing individuals worldwide
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our global platform connects communities to find missing persons
              through collaborative reporting, mapping, and sharing of critical
              information.
            </p>

            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <Link href="/report">
                <Button size="lg" className="rounded-full px-8">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Report Missing Person
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  View Global Map
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">1,250+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Active Cases
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">82</div>
              <div className="text-sm text-muted-foreground mt-1">
                Countries
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">432</div>
              <div className="text-sm text-muted-foreground mt-1">
                Found Safe
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
