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
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

type Props = { drink: Drink };

export function SocialShare({ drink }: Props) {
  const url = `https://drinkgenie.app/drink/${drink.slug}`;

  return (
    <div>
      <FacebookShareButton url={url} hashtag="#dringenie" content={drink.name}>
        <FacebookIcon />
      </FacebookShareButton>
      <PinterestShareButton
        media={drink.imageUrl}
        url={url}
        description={drink.name}
      >
        <PinterestIcon />
      </PinterestShareButton>
      <RedditShareButton title={drink.name} url={url}>
        <RedditIcon />
      </RedditShareButton>
      <TelegramShareButton title={drink.name} url={url}>
        <TelegramIcon />
      </TelegramShareButton>
      <TumblrShareButton
        caption={drink.description}
        tags={[`drinkgenie`, `drink`]}
        url={url}
        title={drink.name}
      >
        <TumblrIcon />
      </TumblrShareButton>
      <TwitterShareButton
        title={drink.name}
        hashtags={[`drink`, `drinkgenie`]}
        url={url}
      >
        <TwitterIcon />
      </TwitterShareButton>

      <WhatsappShareButton title={drink.name} url={url}>
        <WhatsappIcon />
      </WhatsappShareButton>
    </div>
  );
}
