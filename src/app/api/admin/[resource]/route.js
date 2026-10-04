import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/auth/session";
import { describeError, getResource } from "@/lib/admin/resources";
import { toPlain } from "@/lib/content";
import connectDB from "@/utils/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const res = getResource((await params).resource);
  if (!res) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await connectDB();
  const docs = await res.model.find().sort(res.sort).lean();
  return NextResponse.json({ data: docs.map(toPlain) });
}

export async function POST(request, { params }) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const res = getResource((await params).resource);
  if (!res || res.canCreate === false) return NextResponse.json({ error: "Not found." }, { status: 404 });

  try {
    const body = await request.json();
    const values = res.sanitize(body);
    await connectDB();
    const created = await res.model.create(values);
    const doc = toPlain(created.toObject());
    await res.afterSave?.({ doc, before: null, body });
    return NextResponse.json({ data: doc }, { status: 201 });
  } catch (err) {
    const { status, body } = describeError(err);
    return NextResponse.json(body, { status });
  }
}
