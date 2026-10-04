import { NextResponse } from "next/server";
import Service from "@models/Service";
import { experiences } from "@/data/experiences";
import { fromDbOr } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const result = await fromDbOr(
    () => experiences,
    () => Service.find({ published: true }).sort({ order: 1 }).lean(),
  );
  return NextResponse.json(result);
}
