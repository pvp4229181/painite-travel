"use client";

import { useEffect, useSyncExternalStore } from "react";
import axios from "axios";
import { MAX_BYTES } from "@/lib/media";

// One shared copy of the library per media type, so every picker on a page stays in sync.
function createStore() {
  let state = { status: "idle", configured: true, items: [], error: "" };
  const subscribers = new Set();
  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...patch };
      subscribers.forEach((fn) => fn());
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
}

const stores = { image: createStore(), video: createStore() };

const messageOf = (err, fallback) =>
  err.response?.data?.error?.message || err.response?.data?.error || err.message || fallback;

async function load(type, force = false) {
  const store = stores[type];
  if (!force && store.get().status !== "idle") return;
  store.set({ status: "loading", error: "" });
  try {
    const { data } = await axios.get(`/api/admin/media?type=${type}`);
    store.set({ status: "ready", configured: data.configured, items: data.items });
  } catch (err) {
    store.set({ status: "error", error: messageOf(err, "Could not load the media library.") });
  }
}

export function useMediaLibrary(type) {
  const store = stores[type];
  const state = useSyncExternalStore(store.subscribe, store.get, store.get);
  useEffect(() => {
    load(type);
  }, [type]);
  return { ...state, reload: () => load(type, true) };
}

const mb = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`;

/** Uploads straight from the browser to Cloudinary, using a signature from our API. */
export async function uploadMedia(file, type, onProgress) {
  if (!file.type.startsWith(`${type}/`)) throw new Error(`Please choose ${type === "image" ? "an image" : "a video"} file.`);
  if (file.size > MAX_BYTES[type]) throw new Error(`That file is ${mb(file.size)}. The limit is ${mb(MAX_BYTES[type])}.`);
  try {
    const { data: signed } = await axios.post("/api/admin/media", { type });
    const form = new FormData();
    Object.entries(signed.fields).forEach(([k, v]) => form.append(k, v));
    form.append("file", file);
    const { data } = await axios.post(signed.url, form, {
      onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
    });
    const item = {
      id: data.public_id,
      type,
      url: data.secure_url,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      format: data.format,
      createdAt: data.created_at,
    };
    const store = stores[type];
    store.set({ items: [item, ...store.get().items] });
    return item;
  } catch (err) {
    throw new Error(messageOf(err, "The upload failed. Please try again."));
  }
}

/** Deletes an uploaded file. Refused (with `usedBy`) while the website still uses it. */
export async function removeMedia(item) {
  try {
    await axios.delete("/api/admin/media", { data: { type: item.type, id: item.id, url: item.url } });
    const store = stores[item.type];
    store.set({ items: store.get().items.filter((i) => i.id !== item.id) });
  } catch (err) {
    const e = new Error(messageOf(err, "Could not delete the file."));
    e.usedBy = err.response?.data?.usedBy ?? [];
    throw e;
  }
}
