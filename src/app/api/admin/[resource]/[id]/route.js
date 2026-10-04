import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/auth/session";
import { describeError, getResource, loadForEdit } from "@/lib/admin/resources";
import { toPlain } from "@/lib/content";
import connectDB from "@/utils/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notFound = () => NextResponse.json({ error: "This item no longer exists." }, { status: 404 });

async function resolve(request, params) {
  const denied = await guardAdminApi(request);
  if (denied) return { denied };
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res || !mongoose.isValidObjectId(id)) return { denied: notFound() };
  await connectDB();
  return { res, resource, id };
}

export async function GET(request, { params }) {
  const { denied, resource, id } = await resolve(request, params);
  if (denied) return denied;
  const doc = await loadForEdit(resource, id);
  return doc ? NextResponse.json({ data: doc }) : notFound();
}

export async function PUT(request, { params }) {
  const { denied, res, id } = await resolve(request, params);
  if (denied) return denied;
  try {
    const before = await res.model.findById(id).lean();
    if (!before) return notFound();
    const body = await request.json();
    const values = res.sanitize(body);
    const updated = await res.model.findByIdAndUpdate(id, { $set: values }, { new: true, runValidators: true }).lean();
    const doc = toPlain(updated);
    await res.afterSave?.({ doc, before: toPlain(before), body });
    return NextResponse.json({ data: doc });
  } catch (err) {
    const { status, body } = describeError(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(request, { params }) {
  const { denied, res, id } = await resolve(request, params);
  if (denied) return denied;
  try {
    const removed = await res.model.findByIdAndDelete(id).lean();
    if (!removed) return notFound();
    await res.afterDelete?.({ doc: toPlain(removed) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = describeError(err);
    return NextResponse.json(body, { status });
  }
}
