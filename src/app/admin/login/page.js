import { Suspense } from "react";
import { redirect } from "next/navigation";
import Landscape from "@/components/ui/Landscape";
import LoginForm from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/ui/Logo";
import { getAdminSession, isAdminConfigured } from "@/lib/auth/session";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <div className="grid min-h-dvh bg-cream-soft text-text lg:grid-cols-[1.1fr_1fr]">
      <div className="relative isolate hidden overflow-hidden lg:block">
        <Landscape scene="himalaya" priority shade="linear-gradient(180deg, rgba(5,20,16,0.2), rgba(5,20,16,0.75))" />
        <div className="absolute inset-x-12 bottom-12 text-ivory">
          <p className="font-script text-4xl text-gold-soft">Journeys beyond boundaries</p>
          <p className="mt-3 max-w-sm font-serif text-3xl leading-tight">Every journey starts with a conversation, never a template.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* The logo is white, so it sits on a dark panel against the cream page. */}
          <div className="inline-flex flex-col items-start rounded-lg bg-ink px-5 py-4">
            <LogoMark priority className="h-11 sm:h-11" />
            <span className="mt-2 text-[9px] tracking-[0.42em] text-gold">ADMIN</span>
          </div>
          <h1 className="mt-10 font-serif text-4xl">Sign in</h1>
          <p className="mt-2 text-[13.5px] text-muted">Manage journeys, destinations, the journal and enquiries.</p>

          <div className="mt-8">
            {configured ? (
              <Suspense>
                <LoginForm />
              </Suspense>
            ) : (
              <div className="rounded-lg border border-terracotta/40 bg-terracotta/5 p-4 text-[13.5px] leading-relaxed">
                <p className="font-medium text-terracotta">The admin login isn&apos;t set up yet.</p>
                <p className="mt-2 text-muted">Add these to your environment (e.g. <code>.env.local</code>) and restart:</p>
                <pre className="mt-3 overflow-x-auto rounded bg-ink p-3 text-[12px] text-ivory">
                  {"ADMIN_EMAIL=you@painitetravels.com\nADMIN_PASSWORD=a-long-password\nADMIN_SESSION_SECRET=32+ random characters"}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
