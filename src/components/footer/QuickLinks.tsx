import Link from "next/link";
import React from "react";
// import { BookOpen, Users, Briefcase, Map } from "lucide-react";
import { Briefcase, Map } from "lucide-react";

interface QuickLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const QUICK_LINKS: QuickLink[] = [
  // {
  //   name: "Our Story",
  //   path: "/about",
  //   icon: <BookOpen className="w-4 h-4" />,
  // },
  // {
  //   name: "Meet the Team",
  //   path: "/team",
  //   icon: <Users className="w-4 h-4" />,
  // },
  {
    name: "Business Inquiries",
    path: "mailto:lucas@drinkgenie.com",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    name: "Sitemap",
    path: "/sitemap.xml",
    icon: <Map className="w-4 h-4" />,
  },
];

export function QuickLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Quick Links</h3>
      <ul className="space-y-3">
        {QUICK_LINKS.map((link) => (
          <li key={link.name}>
            <Link
              href={link.path}
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
