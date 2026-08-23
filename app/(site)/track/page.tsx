"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = trackingId.trim();

    if (!id) return;

    router.push(`/track/${encodeURIComponent(id)}`);
  }

  return (
    <main className="min-h-[70vh] bg-[#F4F6F9] py-20 sm:py-28">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Request Tracking
            </p>

            <h1 className="mt-4 text-3xl font-extrabold text-[#0A2342] sm:text-5xl">
              Track your request.
            </h1>

            <p className="mt-5 leading-7 text-slate-600">
              Enter the unique tracking ID you received after
              submitting your logistics request.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              <label
                htmlFor="tracking-id"
                className="mb-2 block text-sm font-bold text-[#0A2342]"
              >
                Tracking ID
              </label>

              <input
                id="tracking-id"
                value={trackingId}
                onChange={(event) =>
                  setTrackingId(event.target.value)
                }
                placeholder="Example: A7K9P2X4M8"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 text-sm font-semibold uppercase outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
              />

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 font-bold text-white transition hover:bg-[#e85f00]"
              >
                <Search size={18} />
                Track Request
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
