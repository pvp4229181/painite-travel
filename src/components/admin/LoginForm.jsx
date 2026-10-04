"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { inputCls } from "@/components/admin/fields";
import { cn } from "@/lib/utils";

// Only return to admin pages after signing in (no open redirects).
function safeNext(next) {
  return next && next.startsWith("/admin") && !next.startsWith("//") && !next.startsWith("/admin/login") ? next : "/admin";
}

export default function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await axios.post("/api/admin/login", { email: form.get("email"), password: form.get("password") });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't sign in. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={cn(inputCls, "pr-11")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="password"
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-md text-muted transition-colors hover:text-text"
          >
            {showPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-terracotta">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-[14px] text-ivory transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Lock className="size-4" strokeWidth={1.5} />}
        Sign in
      </button>
    </form>
  );
}
