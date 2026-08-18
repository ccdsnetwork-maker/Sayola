"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  CheckCircle2,
  Edit,
  Film,
  Loader2,
  Plus,
  Power,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type Promotion = {
  id: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  video?: string;
  videoPublicId?: string;
  active?: boolean;
  createdAt?: any;
};

export default function PromotionsAdminPage() {
  const router = useRouter();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadPromotions() {
    try {
      setLoading(true);

      const promotionsQuery = query(
        collection(db, "promotions"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(promotionsQuery);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Promotion[];

      setPromotions(data);
    } catch (error) {
      console.error(
        "Failed to load promotions:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromotions();
  }, []);

  async function toggleActive(promotion: Promotion) {
    if (processing) return;

    setProcessing(promotion.id);

    try {
      await updateDoc(
        doc(db, "promotions", promotion.id),
        {
          active: !promotion.active,
          updatedAt: new Date(),
        }
      );

      setPromotions((current) =>
        current.map((item) =>
          item.id === promotion.id
            ? {
                ...item,
                active: !item.active,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to update promotion:",
        error
      );

      alert("Could not update promotion.");
    } finally {
      setProcessing(null);
    }
  }

  async function deletePromotion(
    promotion: Promotion
  ) {
    if (processing) return;

    const confirmed = window.confirm(
      `Delete "${promotion.title || "this promotion"}"?\n\nThis will also delete its video from Cloudinary.`
    );

    if (!confirmed) return;

    setProcessing(promotion.id);

    try {
      if (promotion.videoPublicId) {
        const response = await fetch(
          "/api/cloudinary/promotions/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicId: promotion.videoPublicId,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Could not delete video from Cloudinary."
          );
        }
      }

      await deleteDoc(
        doc(db, "promotions", promotion.id)
      );

      setPromotions((current) =>
        current.filter(
          (item) => item.id !== promotion.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete promotion:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not delete promotion."
      );
    } finally {
      setProcessing(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Content Management
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342]">
              Promotional Videos
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage promotional videos displayed on
              the SAYOLA homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/sayolaproadmin/promotions/new"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-bold text-white transition hover:bg-[#e85f00]"
          >
            <Plus size={18} />
            New Promotion
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A2342]/10 text-[#0A2342]">
                <Film size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total
                </p>

                <p className="text-2xl font-extrabold text-[#0A2342]">
                  {promotions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Active
                </p>

                <p className="text-2xl font-extrabold text-[#0A2342]">
                  {
                    promotions.filter(
                      (item) => item.active
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <XCircle size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Inactive
                </p>

                <p className="text-2xl font-extrabold text-[#0A2342]">
                  {
                    promotions.filter(
                      (item) => !item.active
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl bg-white">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2
                size={22}
                className="animate-spin"
              />
              Loading promotions...
            </div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <Film
              size={42}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-bold text-[#0A2342]">
              No promotional videos yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first promotional video and
              it will become available for the homepage
              promotional slider.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/sayolaproadmin/promotions/new"
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-bold text-white"
            >
              <Plus size={18} />
              Create Promotion
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="relative aspect-video bg-black">
                  {promotion.video ? (
                    <video
                      src={promotion.video}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No video
                    </div>
                  )}

                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        promotion.active
                          ? "bg-green-500 text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      {promotion.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-2 text-lg font-extrabold text-[#0A2342]">
                    {promotion.title ||
                      "Untitled Promotion"}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {promotion.shortDescription ||
                      "No short description."}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled={processing === promotion.id}
                      onClick={() =>
                        router.push(
                          `/sayolaproadmin/promotions/${promotion.id}/edit`
                        )
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Edit size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={processing === promotion.id}
                      onClick={() =>
                        toggleActive(promotion)
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Power size={14} />
                      {promotion.active
                        ? "Hide"
                        : "Show"}
                    </button>

                    <button
                      type="button"
                      disabled={processing === promotion.id}
                      onClick={() =>
                        deletePromotion(promotion)
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {processing ===
                      promotion.id ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
