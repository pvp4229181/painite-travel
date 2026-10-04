import { NextResponse } from "next/server";
import Tour from "@models/Tour";
import { getJourney } from "@/data/journeys";
import { fromDbOr } from "@/lib/content";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const result = await fromDbOr(
    () => getJourney(slug) ?? null,
    () => Tour.findOne({ slug, published: true }).lean(),
  );
  if (!result.data) return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  return NextResponse.json(result);
}
