"use client";

import EditorFrame from "@/components/admin/EditorFrame";
import { GalleryField, ImagePicker, Section, StringList, TextArea, TextInput, Toggle, VideoPicker } from "@/components/admin/fields";
import { useResourceForm } from "@/components/admin/useResourceForm";

export default function ExperienceForm({ id, initial }) {
  const form = useResourceForm({ resource: "experiences", id, initial, label: "experience" });
  const { values: v, set, errors } = form;

  return (
    <EditorFrame
      form={form}
      title={form.isNew ? "New experience" : v.name || "Untitled experience"}
      subtitle={!form.isNew && (v.published ? "Published" : "Draft")}
      backHref="/admin/experiences"
      backLabel="Experiences"
      publicHref={v.published && v.slug ? `/experiences/${v.slug}` : null}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Content">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput label="Name" value={v.name} onChange={(x) => set("name", x)} error={errors.name} />
              <TextInput
                label="Web address"
                prefix="/experiences/"
                value={v.slug}
                onChange={(x) => set("slug", x)}
                error={errors.slug}
                placeholder="generated from the name"
              />
            </div>
            <TextInput label="Line" value={v.line} onChange={(x) => set("line", x)} hint="Short line shown on lists, e.g. “Living history, beyond the guidebooks.”" />
            <TextArea label="Description" rows={6} value={v.body} onChange={(x) => set("body", x)} />
            <StringList
              label="Moments we love"
              items={v.moments}
              onChange={(x) => set("moments", x)}
              placeholder="Sunrise at the Taj Mahal with an architect"
              addLabel="Add a moment"
            />
          </Section>
          <Section title="Gallery" description="Photos and videos shown in a gallery on the experience page. Upload several at once, add captions and put them in order with the arrows.">
            <GalleryField items={v.gallery} onChange={(x) => set("gallery", x)} />
          </Section>
        </div>
        <aside className="space-y-6">
          <Section title="Visibility">
            <Toggle label="Published" description="Show this experience on the website." checked={v.published} onChange={(x) => set("published", x)} />
            <TextInput label="Order" type="number" min={0} value={v.order} onChange={(x) => set("order", x)} hint="Lower numbers appear first." />
          </Section>
          <Section title="Image and video">
            <ImagePicker value={v.scene} onChange={(x) => set("scene", x)} />
            <VideoPicker
              label="Hero video"
              value={v.video}
              onChange={(x) => set("video", x)}
              hint="Plays behind the title at the top of the experience page. Optional."
            />
          </Section>
        </aside>
      </div>
    </EditorFrame>
  );
}
