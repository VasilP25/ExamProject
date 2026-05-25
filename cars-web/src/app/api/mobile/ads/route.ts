import { NextResponse } from "next/server";
import { getAds } from "../../../../services/ads";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "";
  const model = searchParams.get("model") ?? "";
  const year = searchParams.get("year") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const result = await getAds(name, model, year, page);

  return NextResponse.json({
    ...result,
    ads: result.ads.map((ad) => ({
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
