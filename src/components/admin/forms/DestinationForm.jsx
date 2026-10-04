"use client";

import EditorFrame from "@/components/admin/EditorFrame";
import { CheckboxGroup, ImagePicker, Repeater, Section, TextArea, TextInput, Toggle } from "@/components/admin/fields";
import { useResourceForm } from "@/components/admin/useResourceForm";

export default function DestinationForm({ id, initial, experienceOptions }) {
  const form = useResourceForm({ resource: "destinations", id, initial, label: "destination" });
  const { values: v, set, errors } = form;

  return (
    <EditorFrame
      form={form}
      title={form.isNew ? "New destination" : v.name || "Untitled destination"}
      subtitle={!form.isNew && (v.published ? "Published" : "Draft")}
      backHref="/admin/destinations"
      backLabel="Destinations"
      publicHref={v.published && v.slug ? `/destinations/${v.slug}` : null}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Basics">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput label="Name" value={v.name} onChange={(x) => set("name", x)} error={errors.name} />
              <TextInput
                label="Web address"
                prefix="/destinations/"
                value={v.slug}
                onChange={(x) => set("slug", x)}
                error={errors.slug}
                placeholder="generated from the name"
              />
            </div>
            <TextInput label="Tagline" value={v.tagline} onChange={(x) => set("tagline", x)} hint="Shown on destination cards." />
            <TextInput label="Hero line" value={v.heroLine} onChange={(x) => set("heroLine", x)} hint="The italic line under the name on the destination page." />
            <TextInput label="Home page line" value={v.homeLine} onChange={(x) => set("homeLine", x)} hint="Shown in the home page hero carousel." />
            <TextInput label="Best time to visit" value={v.bestTime} onChange={(x) => set("bestTime", x)} />
          </Section>

          <Section title="Introduction">
            <TextInput label="Heading" value={v.introTitle} onChange={(x) => set("introTitle", x)} placeholder="A land of timeless stories" />
            <TextArea label="Text" rows={4} value={v.introText} onChange={(x) => set("introText", x)} />
            <TextInput label="Pull quote" value={v.quote} onChange={(x) => set("quote", x)} />
          </Section>

          <Section title="Regions" description="The four illustrated regions on the destination page.">
            <Repeater
              items={v.regions}
              onChange={(x) => set("regions", x)}
              addLabel="Add a region"
              emptyText="No regions yet."
              itemTitle={(r, i) => r.name || `Region ${i + 1}`}
              newItem={() => ({ name: "", line: "", scene: v.scene || "heritage" })}
              renderItem={(r, update) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput label="Name" value={r.name} onChange={(x) => update({ name: x })} />
                    <TextInput label="Line" value={r.line} onChange={(x) => update({ line: x })} />
                  </div>
                  <ImagePicker label="Image" compact value={r.scene} onChange={(x) => update({ scene: x })} />
                </>
              )}
            />
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="Visibility">
            <Toggle label="Published" description="Show this destination on the website." checked={v.published} onChange={(x) => set("published", x)} />
            <TextInput label="Order" type="number" min={0} value={v.order} onChange={(x) => set("order", x)} hint="Lower numbers appear first." />
          </Section>
          <Section title="Signature experiences">
            <CheckboxGroup options={experienceOptions} value={v.experiences} onChange={(x) => set("experiences", x)} />
          </Section>
          <Section title="Images">
            <ImagePicker label="Page hero" value={v.scene} onChange={(x) => set("scene", x)} />
            <ImagePicker label="Card" value={v.cardScene} onChange={(x) => set("cardScene", x)} />
            <ImagePicker
              label="Home page hero"
              allowNone
              noneLabel="Same as page"
              value={v.homeScene}
              onChange={(x) => set("homeScene", x)}
            />
          </Section>
        </aside>
      </div>
    </EditorFrame>
  );
}
