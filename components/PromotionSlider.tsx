"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Film, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

type Promotion = {
  id: string;
  title?: string;
  shortDescription?: string;
  video?: string;
  active?: boolean;
};

export default function PromotionSlider() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promotionsQuery = query(
      collection(db, "promotions"),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(
      promotionsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Promotion[];

        setPromotions(data);
        setCurrent((index) =>
          data.length > 0 ? Math.min(index, data.length - 1) : 0
        );
        setLoading(false);
      },
      (error) => {
        console.error(
          "Failed to load homepage promotions:",
          error
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (promotions.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % promotions.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [promotions.length]);

  if (loading) {
    return (
      <section className="bg-[#F4F6F9] py-16">
        <div className="container-site">
          <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] bg-[#0A2342]">
            <div className="flex items-center gap-3 text-white/70">
              <Loader2 size={22} className="animate-spin" />
              Loading promotions...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  const promotion = promotions[current];

  if (!promotion) return null;

  return (
    <section className="bg-[#F4F6F9] py-20">
      <div className="container-site">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              SAYOLA Promotions
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
              Discover what we're offering
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              Explore our latest property opportunities, services and
              promotional offers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrent(
                  (current - 1 + promotions.length) %
                    promotions.length
                )
              }
              disabled={promotions.length <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0A2342] transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-40"
              aria-label="Previous promotion"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrent(
                  (current + 1) % promotions.length
                )
              }
              disabled={promotions.length <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0A2342] transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-40"
              aria-label="Next promotion"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-[#0A2342] shadow-2xl">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative aspect-video min-h-[280px] overflow-hidden bg-black lg:min-h-[430px]">
              {promotion.video ? (
                <video
                  key={promotion.id}
                  src={promotion.video}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/50">
                  <Film size={42} />
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full bg-black/60 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                Promotion {current + 1} of {promotions.length}
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Featured Promotion
              </p>

              <h3 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                {promotion.title || "SAYOLA Promotion"}
              </h3>

              <p className="mt-5 leading-7 text-slate-300">
                {promotion.shortDescription ||
                  "Discover more from SAYOLA KAYBEE GLOBAL LIMITED."}
              </p>

              <Link
                href={`/promotions/${promotion.id}`}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3.5 font-bold text-white transition hover:bg-[#e85f00]"
              >
                View Promotion
                <ArrowRight size={18} />
              </Link>

              {promotions.length > 1 && (
                <div className="mt-8 flex gap-2">
                  {promotions.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`Go to promotion ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        index === current
                          ? "w-8 bg-[#FF6B00]"
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
