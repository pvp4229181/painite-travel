"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Sets a value at a dotted path ("glance.style") without mutating.
function setIn(obj, path, value) {
  const [head, ...rest] = path.split(".");
  return { ...obj, [head]: rest.length ? setIn(obj?.[head] ?? {}, rest.join("."), value) : value };
}

/** Form state plus save/delete for one admin resource. */
export function useResourceForm({ resource, id, initial, label = "item" }) {
  const router = useRouter();
  const isNew = id === "new";
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" }); // idle | saving | saved | error | deleting
  const [dirty, setDirty] = useState(false);

  const set = useCallback((path, value) => {
    setValues((v) => setIn(v, path, value));
    setErrors((e) => {
      if (!e[path]) return e;
      const { [path]: _, ...rest } = e;
      return rest;
    });
    setDirty(true);
    setStatus((s) => (s.state === "saved" ? { state: "idle", message: "" } : s));
  }, []);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e) => e.preventDefault();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  const fail = (err, fallback) => {
    if (err.response?.status === 401) {
      router.push("/admin/login");
      return;
    }
    setErrors(err.response?.data?.errors || {});
    setStatus({ state: "error", message: err.response?.data?.error || fallback });
  };

  async function save(e) {
    e?.preventDefault();
    setStatus({ state: "saving", message: "" });
    try {
      if (isNew) {
        const { data } = await axios.post(`/api/admin/${resource}`, values);
        setDirty(false);
        router.replace(`/admin/${resource}/${data.data.id}?created=1`);
        router.refresh();
      } else {
        const { data } = await axios.put(`/api/admin/${resource}/${id}`, values);
        setDirty(false);
        // Keep the server's cleaned-up values (generated slug, trimmed text, ...).
        if (data?.data) setValues((v) => ({ ...v, ...pickKnown(data.data, v) }));
        setStatus({ state: "saved", message: "All changes saved" });
        router.refresh();
      }
    } catch (err) {
      fail(err, "Couldn't save. Check your connection and try again.");
    }
  }

  async function remove() {
    if (!window.confirm(`Delete this ${label}? This can't be undone.`)) return;
    setStatus({ state: "deleting", message: "" });
    try {
      await axios.delete(`/api/admin/${resource}/${id}`);
      setDirty(false);
      router.replace(`/admin/${resource}?deleted=1`);
      router.refresh();
    } catch (err) {
      fail(err, `Couldn't delete this ${label}.`);
    }
  }

  return { values, set, errors, status, dirty, isNew, save, remove };
}

// Only copy back fields the form already edits (e.g. not `regions` the API doesn't return).
function pickKnown(server, current) {
  const out = {};
  for (const key of Object.keys(current)) {
    if (key in server && typeof server[key] !== "object") out[key] = server[key];
  }
  return out;
}
