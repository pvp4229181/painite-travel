import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/forms/ArticleForm";
import { adminDb } from "@/lib/admin/data";
import { loadForEdit } from "@/lib/admin/resources";

export const metadata = { title: "Edit article" };

export default async function ArticleEditor({ params }) {
  await adminDb();
  const { id } = await params;
  const article = await loadForEdit("journal", id);
  if (!article) notFound();
  return <ArticleForm key={id} id={id} initial={article} />;
}
