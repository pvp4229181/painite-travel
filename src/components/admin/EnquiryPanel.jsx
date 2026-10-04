"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Check, LoaderCircle, Trash2 } from "lucide-react";
import { Section, Select, TextArea } from "@/components/admin/fields";
import { ENQUIRY_STATUS_OPTIONS } from "@/components/admin/Badge";

export default function EnquiryPanel({ id, initialStatus, initialNotes }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes || "");
  const [state, setState] = useState({ kind: "idle", message: "" });
  const dirty = status !== initialStatus || notes !== (initialNotes || "");

  async function save() {
    setState({ kind: "saving", message: "" });
    try {
      await axios.put(`/api/admin/enquiries/${id}`, { status, notes });
      setState({ kind: "saved", message: "Saved" });
      router.refresh();
    } catch (err) {
      if (err.response?.status === 401) return router.push("/admin/login");
      setState({ kind: "error", message: err.response?.data?.error || "Couldn't save. Try again." });
    }
  }

  async function remove() {
    if (!window.confirm("Delete this enquiry? This can't be undone.")) return;
    try {
      await axios.delete(`/api/admin/enquiries/${id}`);
      router.replace("/admin/enquiries?deleted=1");
      router.refresh();
    } catch (err) {
      setState({ kind: "error", message: err.response?.data?.error || "Couldn't delete this enquiry." });
    }
  }

  return (
    <Section title="Follow-up">
      <Select label="Status" value={status} onChange={setStatus} options={ENQUIRY_STATUS_OPTIONS} />
      <TextArea
        label="Internal notes"
        rows={7}
        value={notes}
        onChange={setNotes}
        hint="Only visible here. Calls, proposals sent, preferences…"
      />
      {state.kind === "error" && (
        <p role="alert" className="text-[13px] text-terracotta">
          {state.message}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={remove}
          className="inline-flex items-center gap-1.5 text-[13px] text-terracotta hover:underline"
        >
          <Trash2 className="size-3.5" strokeWidth={1.5} /> Delete
        </button>
        <div className="flex items-center gap-3">
          {state.kind === "saved" && !dirty && (
            <span className="inline-flex items-center gap-1 text-[12.5px] text-muted" aria-live="polite">
              <Check className="size-3.5 text-[#4f6f3f]" strokeWidth={2} /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || state.kind === "saving"}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-[13px] text-ivory hover:bg-ink-soft disabled:opacity-50"
          >
            {state.kind === "saving" && <LoaderCircle className="size-3.5 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </Section>
  );
}
