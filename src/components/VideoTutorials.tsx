"use client";
import React, { useState } from "react";
import { Play, GraduationCap, Clock, BookOpen } from "lucide-react";

interface Tutorial {
  id: number;
  title: string;
  description: string;
  author: string;
  duration: string;
  thumbnail: string;
  views: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  learningTime: string;
}

const TUTORIALS: Tutorial[] = [
  {
    id: 1,
    title: "Mastering the Perfect Martini",
    description:
      "Learn the art of crafting a classic martini, from choosing the right gin to perfecting the garnish.",
    author: "Sarah Martinez",
    duration: "4:35",
    thumbnail:
      "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=800&q=80",
    views: "12K",
    difficulty: "Beginner",
    learningTime: "15 mins",
  },
  {
    id: 2,
    title: "Essential Bar Tools Guide",
    description:
      "A comprehensive overview of must-have bar tools and their proper usage for crafting professional cocktails.",
    author: "Tom Wilson",
    duration: "6:15",
    thumbnail:
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80",
    views: "8.5K",
    difficulty: "Intermediate",
    learningTime: "20 mins",
  },
  {
    id: 3,
    title: "Cocktail Garnishing Tips",
    description:
      "Advanced techniques for creating stunning garnishes that elevate your cocktail presentation.",
    author: "Emily Chen",
    duration: "5:45",
    thumbnail:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
    views: "15K",
    difficulty: "Expert",
    learningTime: "25 mins",
  },
];

export function VideoTutorials() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: Tutorial["difficulty"]) => {
    switch (difficulty) {
      case "Expert":
        return "bg-red-50 text-red-600 border-red-100";
      case "Intermediate":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-green-50 text-green-600 border-green-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-display text-primary mb-6">
        Master the Art of Mixology
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TUTORIALS.map((tutorial) => (
          <div
            key={tutorial.id}
            className="group cursor-pointer bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-300"
            onMouseEnter={() => setHoveredId(tutorial.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative rounded-t-xl overflow-hidden">
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
              />

              {/* Duration Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/75 rounded-lg backdrop-blur-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {tutorial.duration}
                  </span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div
                className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg border ${getDifficultyColor(tutorial.difficulty)}`}
              >
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>

              {/* Video Preview Overlay */}
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center
                           transition-opacity duration-300 ${hoveredId === tutorial.id ? "opacity-100" : "opacity-0"}`}
              >
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-md" />
                  <div className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-8 w-8 text-primary fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-medium text-lg text-primary group-hover:text-accent transition-colors mb-2">
                {tutorial.title}
              </h3>
              <p className="text-sm text-primary/60 mb-4 line-clamp-2">
                {tutorial.description}
              </p>

              <div className="flex items-center justify-between text-sm text-primary/60 pt-4 border-t border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{tutorial.learningTime}</span>
                  </div>
                  <span>{tutorial.views} views</span>
                </div>
                <span>{tutorial.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
