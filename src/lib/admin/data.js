// Entry point for admin page data: every admin page calls adminDb() first, so
// the session is re-checked next to the data access (not only in proxy/layout).
import { requireAdmin } from "@/lib/auth/session";
import connectDB from "@/utils/db";

export async function adminDb() {
  const session = await requireAdmin();
  await connectDB();
  return session;
}
