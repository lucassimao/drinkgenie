import Link from "next/link";
import React from "react";

interface SocialPlatform {
  name: string;
  url: string;
  icon: string;
  followers: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "Instagram",
    url: "https://instagram.com/drinkgenie",
    icon: "/icons/instagram.svg",
    followers: "125K",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@drinkgenie",
    icon: "/icons/youtube.svg",
    followers: "89K",
  },
  {
    name: "Pinterest",
    url: "https://pinterest.com/drinkgenie",
    icon: "/icons/pinterest.svg",
    followers: "250K",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@drinkgenie",
    icon: "/icons/tiktok.svg",
    followers: "500K",
  },
];

export function SocialLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
      <div className="grid grid-cols-2 gap-4">
        {SOCIAL_PLATFORMS.map((platform) => (
          <Link
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
          >
            <img
              src={platform.icon}
              alt={platform.name}
              className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <div className="text-sm text-white/90">{platform.name}</div>
              <div className="text-xs text-white/60">
                {platform.followers} followers
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
