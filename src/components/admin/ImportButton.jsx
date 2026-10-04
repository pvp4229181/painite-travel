"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Download, LoaderCircle } from "lucide-react";

export default function ImportButton() {
  const router = useRouter();
  const [state, setState] = useState({ kind: "idle", message: "" });

  async function run() {
    setState({ kind: "busy", message: "" });
    try {
      const { data } = await axios.post("/api/admin/import");
      const total = Object.values(data.added).reduce((a, b) => a + b, 0);
      setState({ kind: "done", message: total ? `Imported ${total} items.` : "Everything was already imported." });
      router.refresh();
    } catch (err) {
      setState({ kind: "error", message: err.response?.data?.error || "The import failed." });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={state.kind === "busy"}
        className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-[13px] text-ivory hover:bg-ink-soft disabled:opacity-60"
      >
        {state.kind === "busy" ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" strokeWidth={1.5} />}
        Import starter content
      </button>
      {state.message && (
        <span role="status" className={state.kind === "error" ? "text-[13px] text-terracotta" : "text-[13px] text-muted"}>
          {state.message}
        </span>
      )}
    </div>
  );
}
