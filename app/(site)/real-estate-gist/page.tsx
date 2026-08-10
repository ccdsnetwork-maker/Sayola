import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import GistCard from "@/components/GistCard";
import { gists } from "@/lib/gist-data";

export const metadata: Metadata = {
  title: "Real Estate Gist | SAYOLA KAYBEE GLOBAL LIMITED",
  description:
    "Real estate insights, property tips, investment ideas and wealth creation stories from SAYOLA KAYBEE GLOBAL LIMITED.",
};

export default function RealEstateGistPage() {
  return (
    <main className="bg-[#F4F6F9]">
      <section className="bg-[#0A2342] py-20 text-white">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
              <Sparkles size={16} className="text-[#FF6B00]" />
              SAYOLA Insights
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Real Estate <span className="text-[#FF6B00]">Gist</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Property insights, investment ideas and practical knowledge to
              help you make smarter real estate decisions and build wealth.
            </p>
          </div>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Latest Articles
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
            From Our Real Estate Desk
          </h2>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {gists.map((gist, index) => (
            <GistCard key={gist.id} gist={gist} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
