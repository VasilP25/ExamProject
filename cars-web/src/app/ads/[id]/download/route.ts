import { notFound } from "next/navigation";
import { getAdDetail } from "../../../../services/ads";

type DownloadRouteContext = {
  params: Promise<{ id: string }>;
};

function createSafeFileName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(_request: Request, { params }: DownloadRouteContext) {
  const { id } = await params;
  const adId = Number(id);

  if (!Number.isInteger(adId)) {
    notFound();
  }

  const ad = await getAdDetail(adId);
  if (!ad) {
    notFound();
  }

  const fileName =
    createSafeFileName(`${ad.name}-${ad.model}-${ad.year}`) || `ad-${ad.id}`;
  const content = [
    `${ad.name} ${ad.model}`,
    "",
    `Brand: ${ad.name}`,
    `Model: ${ad.model}`,
    `Year of registration: ${ad.year}`,
    `Price: ${ad.price.toLocaleString("en-US")} EUR`,
    `Posted by: ${ad.ownerName}`,
    `Likes: ${ad.likes}`,
    `Comments: ${ad.commentCount}`,
    ad.picture ? `Picture: ${ad.picture}` : "Picture: No picture",
    "",
    "Description:",
    ad.description,
    "",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}.txt"`,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
