"use client";

import dynamic from "next/dynamic";

const InternshipTracker = dynamic(
  () => import("@/components/tracker/internship-tracker").then((mod) => mod.InternshipTracker),
  {
    ssr: false,
    loading: () => (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-6 text-sm backdrop-blur-xl">
          Loading internship tracker...
        </div>
      </main>
    )
  }
);

export function TrackerShell() {
  return <InternshipTracker />;
}
