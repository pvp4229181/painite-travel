import { Database } from "lucide-react";
import Enquiry from "@models/Enquiry";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import connectDB, { isDbConfigured } from "@/utils/db";

export default async function PanelLayout({ children }) {
  const session = await requireAdmin();

  let dbError = !isDbConfigured() ? "missing" : null;
  let newEnquiries = 0;
  if (!dbError) {
    try {
      await connectDB();
      newEnquiries = await Enquiry.countDocuments({ status: "new" });
    } catch (err) {
      console.error("[admin] database connection failed:", err.message);
      dbError = "unreachable";
    }
  }

  return (
    <AdminShell email={session.sub} newEnquiries={newEnquiries}>
      {dbError ? <DatabaseNotice reason={dbError} /> : children}
    </AdminShell>
  );
}

function DatabaseNotice({ reason }) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl border border-line bg-white/70 p-8">
      <Database className="size-6 text-terracotta" strokeWidth={1.5} />
      <h1 className="mt-4 font-serif text-3xl">
        {reason === "missing" ? "Connect a database to start editing" : "Can't reach the database"}
      </h1>
      {reason === "missing" ? (
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          The website is showing the starter content from the codebase. To edit content and receive enquiries here, set{" "}
          <code className="rounded bg-sand px-1">MONGODB_ATLAS_URI</code> (or <code className="rounded bg-sand px-1">MONGODB_URI</code>) in
          your environment and restart the server.
        </p>
      ) : (
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          The connection to MongoDB failed. Check the connection string, that your IP is allowed in MongoDB Atlas, and that the
          cluster is running, then reload this page.
        </p>
      )}
    </div>
  );
}
