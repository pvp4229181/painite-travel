import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/auth/session";
import { importStarterContent } from "@/lib/starter";
import connectDB from "@/utils/db";

export const runtime = "nodejs";

// Copies starter content from src/data into the database. Items that already
// exist (same slug) are skipped, so this never overwrites edits.
export async function POST(request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  try {
    await connectDB();
    const added = await importStarterContent();
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, added });
  } catch (err) {
    console.error("[admin] import failed:", err);
    return NextResponse.json({ error: "The import failed. Check the database connection and try again." }, { status: 500 });
  }
}
