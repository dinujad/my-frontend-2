export type Lang = "en" | "si";

export const copy = {
  en: {
    selectLanguage: "Select language",
    english: "English",
    sinhala: "Sinhala",
    goodMorning: "Good morning!",
    goodAfternoon: "Good afternoon!",
    goodEvening: "Good evening!",
    goodNight: "Good night!",
    intro:
      "I'm the Print Works.LK Sales Agent. I'm here to help you purchase items from our site.",
    guide:
      "To find the product you need, click the 'All Products' button. Once you're on that page, you can select any product. Hover your cursor on a product name to say \"I want this one\" — we'll customize it for you.",
    userWants: "I want this one",
    botReply: (productName: string) =>
      `Great choice! We can customize "${productName}" for you. Visit the product page or request a quote.`,
  },
  si: {
    selectLanguage: "භාෂාව තෝරන්න",
    english: "English",
    sinhala: "සිංහල",
    goodMorning: "සුභ උදෑසනක්!",
    goodAfternoon: "සුභ පැයක්!",
    goodEvening: "සුභ සන්ධ්යාවක්!",
    goodNight: "සුභ රාත්රියක්!",
    intro:
      "මම Print Works.LK විකුණුම් තාරකා. ඔබට අපේ සයිට් එකෙන් භාණ්ඩ මිලට ගැනීමට මම උදව් කරන්නම්.",
    guide:
      "ඔබට අවශ්‍ය භාණ්ඩය සොයා ගැනීමට 'All Products' බොත්තම ක්ලික් කරන්න. ඒ පිටුවට ගිය පසු ඕනෑම භාණ්ඩයක් තෝරා ගත හැක. 'මට මේක ඕන' කියන්න භාණ්ඩයේ නම මත cursor එක තබන්න — අපි ඔබට අනුව customize කරලා දෙන්නම්.",
    userWants: "මට මේක ඕන",
    botReply: (productName: string) =>
      `හොඳ තේරීමක්! අපි ඔබට "${productName}" customize කරලා දෙන්න පුළුවන්. භාණ්ඩ පිටුවට යන්න හෝ quote එකක් ඉල්ලන්න.`,
  },
} as const;

export function getGreeting(lang: Lang): string {
  const h = new Date().getHours();
  const c = copy[lang];
  if (h >= 5 && h < 12) return c.goodMorning;
  if (h >= 12 && h < 17) return c.goodAfternoon;
  if (h >= 17 && h < 21) return c.goodEvening;
  return c.goodNight;
}

export const AI_PRODUCT_HOVER_EVENT = "ai-product-hover";

export function dispatchProductHover(productName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AI_PRODUCT_HOVER_EVENT, { detail: { productName } })
  );
}

