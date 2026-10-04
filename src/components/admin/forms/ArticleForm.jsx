"use client";

import EditorFrame from "@/components/admin/EditorFrame";
import { ImagePicker, Section, TextArea, TextInput, Toggle } from "@/components/admin/fields";
import { useResourceForm } from "@/components/admin/useResourceForm";

export default function ArticleForm({ id, initial }) {
  const form = useResourceForm({ resource: "journal", id, initial, label: "article" });
  const { values: v, set, errors } = form;

  return (
    <EditorFrame
      form={form}
      title={form.isNew ? "New article" : v.title || "Untitled article"}
      subtitle={!form.isNew && (v.published ? "Published" : "Draft")}
      backHref="/admin/journal"
      backLabel="Journal"
      publicHref={v.published && v.slug ? `/journal/${v.slug}` : null}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Article">
            <TextInput label="Title" value={v.title} onChange={(x) => set("title", x)} error={errors.title} />
            <TextInput
              label="Web address"
              prefix="/journal/"
              value={v.slug}
              onChange={(x) => set("slug", x)}
              error={errors.slug}
              placeholder="generated from the title"
            />
            <TextArea
              label="Excerpt"
              rows={2}
              value={v.excerpt}
              onChange={(x) => set("excerpt", x)}
              hint="Shown on the journal page and as the article's lead."
            />
            <TextArea
              label="Body"
              rows={16}
              value={v.body}
              onChange={(x) => set("body", x)}
              hint="Separate paragraphs with a blank line."
            />
          </Section>
        </div>
        <aside className="space-y-6">
          <Section title="Publishing">
            <Toggle label="Published" description="Show this article on the website." checked={v.published} onChange={(x) => set("published", x)} />
            <TextInput label="Date" type="date" value={v.date} onChange={(x) => set("date", x)} error={errors.date} />
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Category" value={v.category} onChange={(x) => set("category", x)} placeholder="Heritage" />
              <TextInput label="Read time" value={v.readTime} onChange={(x) => set("readTime", x)} placeholder="5 min read" />
            </div>
          </Section>
          <Section title="Image">
            <ImagePicker value={v.scene} onChange={(x) => set("scene", x)} />
          </Section>
        </aside>
      </div>
    </EditorFrame>
  );
}
