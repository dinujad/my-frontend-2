import fs from "fs";
import path from "path";

export type ClientLogo = {
  src: string;
  alt: string;
  name: string;
};

const LOGO_DIR = path.join(process.cwd(), "public", "images", "logo");
const LOGO_EXT = /\.(png|jpe?g|webp|svg|avif)$/i;

function filenameToLabel(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "Client";
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Logos in `public/images/logo/` — add or remove files; no code change needed. */
export function getClientLogos(): ClientLogo[] {
  try {
    if (!fs.existsSync(LOGO_DIR)) return [];
    return fs
      .readdirSync(LOGO_DIR)
      .filter((f) => LOGO_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      .map((f) => ({
        src: `/images/logo/${encodeURIComponent(f)}`,
        alt: `${filenameToLabel(f)} logo`,
        name: filenameToLabel(f),
      }));
  } catch {
    return [];
  }
}
