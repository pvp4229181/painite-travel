"use client";

import EditorFrame from "@/components/admin/EditorFrame";
import { CheckboxGroup, ImagePicker, Repeater, Section, TextArea, TextInput, Toggle } from "@/components/admin/fields";
import { useResourceForm } from "@/components/admin/useResourceForm";

export default function JourneyForm({ id, initial, destinationOptions }) {
  const form = useResourceForm({ resource: "journeys", id, initial, label: "journey" });
  const { values: v, set, errors } = form;

  return (
    <EditorFrame
      form={form}
      title={form.isNew ? "New journey" : v.title || "Untitled journey"}
      subtitle={!form.isNew && `${v.days || "?"} days · ${v.published ? "Published" : "Draft"}`}
      backHref="/admin/journeys"
      backLabel="Journeys"
      publicHref={v.published && v.slug ? `/journeys/${v.slug}` : null}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Basics">
            <TextInput label="Title" value={v.title} onChange={(x) => set("title", x)} error={errors.title} placeholder="Himalayan Kingdoms" />
            <TextInput
              label="Web address"
              prefix="/journeys/"
              value={v.slug}
              onChange={(x) => set("slug", x)}
              error={errors.slug}
              placeholder="generated from the title"
              hint="Changing this breaks existing links to the journey."
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <TextInput label="Region label" value={v.region} onChange={(x) => set("region", x)} placeholder="Nepal and Bhutan" />
              <TextInput label="Days" type="number" min={1} value={v.days} onChange={(x) => set("days", x)} error={errors.days} />
              <TextInput label="Nights" type="number" min={0} value={v.nights} onChange={(x) => set("nights", x)} error={errors.nights} />
            </div>
            <TextArea
              label="Summary"
              rows={2}
              value={v.summary}
              onChange={(x) => set("summary", x)}
              hint="One line shown on cards and lists."
            />
          </Section>

          <Section title="Introduction">
            <TextInput label="Heading" value={v.introTitle} onChange={(x) => set("introTitle", x)} placeholder="A journey through two extraordinary kingdoms" />
            <TextArea label="Text" rows={5} value={v.intro} onChange={(x) => set("intro", x)} />
          </Section>

          <Section title="At a glance">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput label="Destinations" value={v.glance?.destinations} onChange={(x) => set("glance.destinations", x)} placeholder="Nepal, Bhutan" />
              <TextInput label="Travel style" value={v.glance?.style} onChange={(x) => set("glance.style", x)} placeholder="Culture, nature, spiritual" />
              <TextInput label="Best season" value={v.glance?.season} onChange={(x) => set("glance.season", x)} />
              <TextInput label="Ideal for" value={v.glance?.idealFor} onChange={(x) => set("glance.idealFor", x)} />
              <TextInput label="Accommodation" value={v.glance?.accommodation} onChange={(x) => set("glance.accommodation", x)} className="sm:col-span-2" />
            </div>
          </Section>

          <Section title="Day by day" description="Each day appears in the itinerary accordion on the journey page.">
            <Repeater
              items={v.itinerary}
              onChange={(x) => set("itinerary", x)}
              addLabel="Add a day"
              emptyText="No days yet."
              itemTitle={(d, i) => `Day ${d.day || i + 1}${d.title ? ` · ${d.title}` : ""}`}
              newItem={(n) => ({ day: String(n + 1), title: "", text: "", stay: "", scene: v.scene || "himalaya" })}
              renderItem={(d, update) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-[7rem_1fr]">
                    <TextInput label="Day" value={d.day} onChange={(x) => update({ day: x })} placeholder="1 or 5 to 6" />
                    <TextInput label="Title" value={d.title} onChange={(x) => update({ title: x })} />
                  </div>
                  <TextArea label="Description" rows={3} value={d.text} onChange={(x) => update({ text: x })} />
                  <TextInput label="Stay" value={d.stay} onChange={(x) => update({ stay: x })} placeholder="Heritage boutique hotel, Kathmandu" />
                  <ImagePicker label="Image" compact value={d.scene} onChange={(x) => update({ scene: x })} />
                </>
              )}
            />
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="Visibility">
            <Toggle label="Published" description="Show this journey on the website." checked={v.published} onChange={(x) => set("published", x)} />
            <Toggle label="Featured" description="Shown first in the home page selection." checked={v.featured} onChange={(x) => set("featured", x)} />
            <TextInput label="Order" type="number" min={0} value={v.order} onChange={(x) => set("order", x)} hint="Lower numbers appear first." />
          </Section>
          <Section title="Destinations">
            <CheckboxGroup
              options={destinationOptions}
              value={v.destinations}
              onChange={(x) => set("destinations", x)}
              hint="The journey is listed on each chosen destination's page."
            />
          </Section>
          <Section title="Image">
            <ImagePicker value={v.scene} onChange={(x) => set("scene", x)} />
          </Section>
        </aside>
      </div>
    </EditorFrame>
  );
}
