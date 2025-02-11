import React from "react";
import { User } from "lucide-react";
import { getRelativeTimeString } from "@/lib/dateUtils";
import Image from "next/image";

interface DrinkCreatorProps {
  creator?: string | null;
  creatorAvatarUrl?: string;
  created: Date;
}

export function DrinkCreator({
  creator,
  creatorAvatarUrl,
  created,
}: DrinkCreatorProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {creator && creatorAvatarUrl ? (
          <>
            <Image
              src={creatorAvatarUrl}
              alt={creator}
              width={48}
              height={48}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-primary/70">{creator}</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-3 w-3 text-primary/40" />
            </div>
            <span className="text-xs text-primary/50">Anonymous</span>
          </>
        )}
      </div>
      <span className="text-xs text-primary/60">
        {getRelativeTimeString(created)}
      </span>
    </div>
  );
}
