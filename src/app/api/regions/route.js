import { NextResponse } from "next/server";
import Region from "@models/Region";
import { destinations } from "@/data/destinations";
import { fromDbOr } from "@/lib/content";

export const runtime = "nodejs";

// GET /api/regions?destination=india
export async function GET(request) {
  const destination = request.nextUrl.searchParams.get("destination")?.toLowerCase();

  const staticRegions = () =>
    destinations
      .filter((d) => !destination || d.slug === destination)
      .flatMap((d) => d.regions.map((r) => ({ ...r, destination: d.slug })));

  const result = await fromDbOr(staticRegions, () =>
    Region.find(destination ? { destination } : {})
      .sort({ destination: 1, order: 1 })
      .lean(),
  );
  return NextResponse.json(result);
}
