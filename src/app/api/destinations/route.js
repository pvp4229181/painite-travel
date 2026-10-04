import { NextResponse } from "next/server";
import Destination from "@models/Destination";
import { destinations } from "@/data/destinations";
import { fromDbOr } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const result = await fromDbOr(
    () => destinations,
    () => Destination.find({ published: true }).sort({ order: 1 }).lean(),
  );
  return NextResponse.json(result);
}
