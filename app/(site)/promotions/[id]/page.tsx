"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type Promotion = {
  title?: string;
  shortDescription?: string;
  description?: string;
  video?: string;
  active?: boolean;
};

export default function PromotionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [promotion, setPromotion] =
    useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromotion() {
      try {
        const snapshot = await getDoc(
          doc(db, "promotions", id)
        );

        if (!snapshot.exists()) {
          router.replace("/");
          return;
        }

        const data = snapshot.data() as Promotion;

        if (data.active === false) {
          router.replace("/");
          return;
        }

        setPromotion(data);
      } catch (error) {
        console.error(
          "Failed to load promotion:",
          error
        );
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    loadPromotion();
  }, [id, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={24}
            className="animate-spin"
          />
          Loading promotion...
        </div>
      </main>
    );
  }

  if (!promotion) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-site py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#FF6B00]"
        >
          <ArrowLeft size={17} />
          Back to Homepage
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm">
          {promotion.video && (
            <div className="bg-black">
              <video
                src={promotion.video}
                controls
                playsInline
                autoPlay
                className="mx-auto max-h-[650px] w-full object-contain"
              />
            </div>
          )}

          <div className="p-7 sm:p-10 lg:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              SAYOLA Promotion
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#0A2342] sm:text-5xl">
              {promotion.title}
            </h1>

            {promotion.shortDescription && (
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">
                {promotion.shortDescription}
              </p>
            )}

            {promotion.description && (
              <div className="mt-8 max-w-4xl whitespace-pre-line text-base leading-8 text-slate-600">
                {promotion.description}
              </div>
            )}

            <Link
              href="/contact"
              className="mt-9 inline-flex items-center justify-center rounded-xl bg-[#FF6B00] px-7 py-4 font-bold text-white transition hover:bg-[#e85f00]"
            >
              Contact SAYOLA
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
