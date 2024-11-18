"use client";

import { Drink } from "@/lib/drinks";
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

type Props = { drink: Drink };

export function SocialShare({ drink }: Props) {
  const url = `https://drinkgenie.app/drink/${drink.slug}`;

  return (
    <div className="flex flex-row">
      <FacebookShareButton url={url} hashtag="#dringenie" content={drink.name}>
        <FacebookIcon className="w-[30px] ml-2 md:w-[50px]" />
      </FacebookShareButton>
      <PinterestShareButton
        media={drink.imageUrl}
        url={url}
        description={drink.name}
      >
        <PinterestIcon className="w-[30px] ml-2 md:w-[50px]" />
      </PinterestShareButton>
      <RedditShareButton title={drink.name} url={url}>
        <RedditIcon className="w-[30px] ml-2 md:w-[50px]" />
      </RedditShareButton>
      <TelegramShareButton title={drink.name} url={url}>
        <TelegramIcon className="w-[30px] ml-2 md:w-[50px]" />
      </TelegramShareButton>

      <TwitterShareButton
        title={drink.name}
        hashtags={[`drink`, `drinkgenie`]}
        url={url}
      >
        <TwitterIcon className="w-[30px] ml-2 md:w-[50px]" />
      </TwitterShareButton>

      <WhatsappShareButton title={drink.name} url={url}>
        <WhatsappIcon className="w-[30px] ml-2 md:w-[50px]" />
      </WhatsappShareButton>
    </div>
  );
}
