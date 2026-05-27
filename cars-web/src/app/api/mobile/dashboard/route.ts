import { NextResponse } from "next/server";
import { getLatestAds } from "../../../../services/ads";
import { corsOptionsResponse, withCors } from "../../../../lib/cors";

export function OPTIONS() {
  return corsOptionsResponse();
}

export async function GET() {
  const ads = await getLatestAds(3);

  return withCors(
    NextResponse.json({
      ads: ads.map((ad) => ({
        id: ad.id,
        name: ad.name,
        model: ad.model,
        year: ad.year,
        picture: ad.picture,
        ownerName: ad.ownerName,
        likes: ad.likes,
      })),
    }),
  );
}
