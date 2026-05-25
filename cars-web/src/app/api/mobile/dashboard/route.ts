import { NextResponse } from "next/server";
import { getLatestAds } from "../../../../services/ads";

export async function GET() {
  const ads = await getLatestAds(3);

  return NextResponse.json({
    ads: ads.map((ad) => ({
      id: ad.id,
      name: ad.name,
      model: ad.model,
      year: ad.year,
      picture: ad.picture,
      ownerName: ad.ownerName,
      likes: ad.likes,
    })),
  });
}
