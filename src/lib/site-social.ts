/** Public social profile URLs — set in Coolify / .env.local (NEXT_PUBLIC_*) */
export type SocialNetwork = "facebook" | "instagram" | "tiktok" | "pinterest";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

export const SITE_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "#",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "#",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "#",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    href: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST ?? "#",
  },
];
