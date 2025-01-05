import { Instagram } from "@/components/icons/Instagram";
import { Pinterest } from "../icons/Pinterest";
import { Tiktok } from "../icons/Tiktok";
import { X } from "../icons/X";
import { Youtube } from "../icons/Youtube";

interface SocialPlatform {
  name: string;
  url: string;
  icon: () => React.ReactNode;
  followers: string;
  visible?: boolean;
  displayFollowersCount?: boolean;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "Instagram",
    url: "https://instagram.com/drinkgenie",
    icon: Instagram,
    followers: "125K",
    displayFollowersCount: false,
    visible: true,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@drinkgenie",
    icon: Youtube,
    followers: "89K",
  },
  {
    name: "Pinterest",
    url: "https://pinterest.com/drinkgenie",
    icon: Pinterest,
    followers: "250K",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@drinkgenie",
    icon: Tiktok,
    followers: "500K",
  },
  {
    name: "X",
    url: "https://x.com/drinkgenieapp",
    icon: X,
    followers: "500K",
    visible: true,
  },
];

export function SocialLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
      <div className="grid grid-cols-2 gap-4">
        {SOCIAL_PLATFORMS.filter((item) => item.visible).map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="w-6 h-6 group-hover:scale-110 transition-transform duration-300">
              <platform.icon />
            </div>
            <div>
              <div className="text-sm text-white/90">{platform.name}</div>
              {platform.displayFollowersCount && (
                <div className="text-xs text-white/60">
                  {platform.followers} followers
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
