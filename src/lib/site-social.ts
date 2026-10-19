/** Public social profile URLs — set in Coolify / .env.local (NEXT_PUBLIC_*) */
export type SocialNetwork = "facebook" | "instagram" | "tiktok" | "pinterest";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

const DEFAULT_SOCIAL: Record<SocialNetwork, string> = {
  facebook: "https://www.facebook.com/share/1QCFT42wL4/",
  instagram: "https://www.instagram.com/print_works_sl",
  tiktok: "https://www.tiktok.com/@printworks.lk",
  pinterest: "",
};

function socialHref(envValue: string | undefined, fallback: string): string {
  const value = (envValue ?? "").trim();
  if (!value || value === "#" || value.includes("yourpage")) return fallback;
  return value;
}

export const SITE_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, DEFAULT_SOCIAL.facebook),
  },
  {
    id: "instagram",
    label: "Instagram",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, DEFAULT_SOCIAL.instagram),
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK, DEFAULT_SOCIAL.tiktok),
  },
  {
    id: "pinterest",
    label: "Pinterest",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_PINTEREST, DEFAULT_SOCIAL.pinterest),
  },
].filter((item) => item.href.startsWith("http"));
