"use client";

import React from "react";
interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareButtons = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "/icons/facebook.svg",
      bgColor: "bg-[#1877F2] hover:bg-[#0C63D4]",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "/icons/twitter.svg",
      bgColor: "bg-[#1DA1F2] hover:bg-[#0C85D0]",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: "/icons/whatsapp.svg",
      bgColor: "bg-[#25D366] hover:bg-[#20BD5C]",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "/icons/telegram.svg",
      bgColor: "bg-[#0088CC] hover:bg-[#006DAA]",
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: "/icons/email.svg",
      bgColor: "bg-[#EA4335] hover:bg-[#D62516]",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-primary/60">Share:</span>
      <div className="flex flex-wrap gap-2">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${button.bgColor} text-white transition-all duration-300 transform hover:scale-110`}
            onClick={(e) => {
              e.preventDefault();
              window.open(button.href, "_blank", "width=600,height=400");
            }}
            title={`Share on ${button.name}`}
          >
            <img src={button.icon} alt={button.name} className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
