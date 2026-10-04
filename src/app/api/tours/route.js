import { NextResponse } from "next/server";
import Tour from "@models/Tour";
import { journeys } from "@/data/journeys";
import { fromDbOr } from "@/lib/content";

export const runtime = "nodejs";

// GET /api/tours?destination=nepal
export async function GET(request) {
  const destination = request.nextUrl.searchParams.get("destination")?.toLowerCase();

  const result = await fromDbOr(
    () => journeys.filter((j) => !destination || j.destinations.includes(destination)),
    () =>
      Tour.find({ published: true, ...(destination ? { destinations: destination } : {}) })
        .sort({ featured: -1, days: 1 })
        .lean(),
  );
  return NextResponse.json(result);
}
