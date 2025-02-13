import React from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Michael Brown",
    role: "Home Bartender",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    content:
      "DrinkGenie transformed my home bar experience. The AI suggestions are spot-on!",
    rating: 5,
  },
  {
    id: 2,
    name: "Lisa Chen",
    role: "Cocktail Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    content:
      "I love how it suggests drinks based on what I already have. No more wasted ingredients!",
    rating: 5,
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Professional Bartender",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    content:
      "The recipe variations are creative and the presentation suggestions are excellent.",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <div className="bg-primary rounded-xl shadow-lg p-8 text-white">
      <h2 className="text-2xl font-display mb-8">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white/10 backdrop-blur-xs rounded-lg p-6 relative"
          >
            <Quote className="absolute top-4 right-4 h-12 w-12 text-white/10" />
            <div className="flex items-start gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-white/70">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-warning fill-current" />
              ))}
            </div>
            <p className="text-white/90">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
