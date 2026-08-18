"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  Film,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

type Promotion = {
  title?: string;
  shortDescription?: string;
  description?: string;
  video?: string;
  videoPublicId?: string;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  active?: boolean;
};

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [promotion, setPromotion] = useState<Promotion | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    async function loadPromotion() {
      try {
        const snapshot = await getDoc(
          doc(db, "promotions", id)
        );

        if (!snapshot.exists()) {
          alert("Promotion not found.");
          router.replace("/sayolaproadmin/promotions");
          return;
        }

        setPromotion(snapshot.data() as Promotion);
      } catch (error) {
        console.error(
          "Failed to load promotion:",
          error
        );

        alert("Could not load promotion.");
        router.replace("/sayolaproadmin/promotions");
      } finally {
        setLoading(false);
      }
    }

    loadPromotion();
  }, [id, router]);

  function handleVideoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      alert("Video must be 5MB or smaller.");
      return;
    }

    setVideoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving || !promotion) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const title = String(
      data.get("title") || ""
    ).trim();

    const shortDescription = String(
      data.get("shortDescription") || ""
    ).trim();

    const description = String(
      data.get("description") || ""
    ).trim();

    if (!title || !shortDescription || !description) {
      alert("Please complete all required fields.");
      return;
    }

    setSaving(true);

    try {
      let video = promotion.video || "";
      let videoPublicId =
        promotion.videoPublicId || "";

      let duration = promotion.duration || null;
      let width = promotion.width || null;
      let height = promotion.height || null;
      let format = promotion.format || null;

      if (videoFile) {
        const uploadData = new FormData();
        uploadData.append("file", videoFile);

        const uploadResponse = await fetch(
          "/api/cloudinary/promotions/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );

        const uploadResult =
          await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult.success
        ) {
          throw new Error(
            uploadResult.error ||
              "Promotional video upload failed."
          );
        }

        if (promotion.videoPublicId) {
          await fetch(
            "/api/cloudinary/promotions/delete",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                publicId:
                  promotion.videoPublicId,
              }),
            }
          );
        }

        video = uploadResult.url;
        videoPublicId = uploadResult.publicId;
        duration = uploadResult.duration || null;
        width = uploadResult.width || null;
        height = uploadResult.height || null;
        format = uploadResult.format || null;
      }

      await updateDoc(
        doc(db, "promotions", id),
        {
          title,
          shortDescription,
          description,
          video,
          videoPublicId,
          duration,
          width,
          height,
          format,
          updatedAt: serverTimestamp(),
        }
      );

      alert("Promotion updated successfully.");

      router.push("/sayolaproadmin/promotions");
    } catch (error) {
      console.error(
        "Failed to update promotion:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not update promotion."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePromotion() {
    if (deleting || !promotion) return;

    const confirmed = window.confirm(
      `Delete "${promotion.title || "this promotion"}"?\n\nThis will permanently delete the promotion and its video from Cloudinary.`
    );

    if (!confirmed) return;

    setDeleting(true);

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
              publicId:
                promotion.videoPublicId,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Could not delete video."
          );
        }
      }

      await import("firebase/firestore").then(
        ({ deleteDoc }) =>
          deleteDoc(doc(db, "promotions", id))
      );

      router.push("/sayolaproadmin/promotions");
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

      setDeleting(false);
    }
  }

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

  if (!promotion) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/sayolaproadmin/promotions"
            )
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#FF6B00]"
        >
          <ArrowLeft size={17} />
          Back to Promotions
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00]">
              <Film size={24} />
            </div>

            <h1 className="text-2xl font-extrabold text-[#0A2342] sm:text-3xl">
              Edit Promotional Video
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update the information or replace the
              promotional video.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Promotion Title *
              </label>

              <input
                name="title"
                required
                defaultValue={promotion.title || ""}
                placeholder="e.g. Discover Our Latest Property"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Short Information *
              </label>

              <textarea
                name="shortDescription"
                required
                rows={3}
                defaultValue={
                  promotion.shortDescription || ""
                }
                placeholder="A short message displayed on the homepage..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Information *
              </label>

              <textarea
                name="description"
                required
                rows={8}
                defaultValue={
                  promotion.description || ""
                }
                placeholder="Complete information visitors will see on the promotion page..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
              />
            </div>

            {promotion.video && !preview && (
              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">
                  Current Video
                </p>

                <div className="overflow-hidden rounded-2xl bg-black">
                  <video
                    src={promotion.video}
                    controls
                    playsInline
                    preload="metadata"
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Replace Video
              </label>

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-[#FF6B00] hover:bg-orange-50/30">
                <Upload
                  size={30}
                  className="text-[#FF6B00]"
                />

                <span className="mt-3 text-sm font-bold text-slate-700">
                  Select a new promotional video
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  Maximum file size: 5MB
                </span>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>

              {videoFile && (
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Selected: {videoFile.name}
                </p>
              )}

              {preview && (
                <div className="mt-4 overflow-hidden rounded-2xl bg-black">
                  <video
                    src={preview}
                    controls
                    playsInline
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                disabled={saving || deleting}
                onClick={deletePromotion}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete Promotion
              </button>

              <button
                type="submit"
                disabled={saving || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={18} />
                )}

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
