"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Sparkles } from "lucide-react";

import GistCard from "@/components/GistCard";
import { db } from "@/lib/firebase";

type Gist = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
};

export default function RealEstateGistPage() {
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gistsQuery = query(
      collection(db, "gists"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      gistsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Gist[];

        setGists(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load public gists:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
              Real Estate{" "}
              <span className="text-[#FF6B00]">Gist</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Property insights, investment ideas and practical knowledge
              to help you make smarter real estate decisions and build
              wealth.
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

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading articles...
              </p>
            </div>
          </div>
        ) : gists.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0A2342]">
              No articles yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New real estate insights will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {gists.map((gist, index) => (
              <GistCard
                key={gist.id}
                gist={gist}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
