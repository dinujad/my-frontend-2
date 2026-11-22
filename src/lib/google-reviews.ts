import "server-only";

export type GoogleReview = {
  author: string;
  text: string;
  rating: number;
  authorUrl?: string;
};

type PlaceReview = {
  rating?: number;
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
};

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;
  if (!apiKey || !placeId) return [];

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "reviews" },
        cache: "no-store",
        signal: AbortSignal.timeout(3500),
      },
    );
    if (!response.ok) return [];

    const { reviews = [] } = (await response.json()) as { reviews?: PlaceReview[] };
    return reviews.flatMap(({ rating, originalText, authorAttribution }) => {
      const author = authorAttribution?.displayName?.trim();
      const text = originalText?.text?.trim();
      if (rating !== 5 || !author || !text) return [];

      const uri = authorAttribution?.uri;
      return [{ rating, author, text, authorUrl: uri?.startsWith("https://") ? uri : undefined }];
    });
  } catch {
    return [];
  }
}
