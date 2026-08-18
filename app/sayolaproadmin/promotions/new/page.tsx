 "use client";

import { FormEvent, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  ArrowLeft,
  Film,
  Loader2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

export default function NewPromotionPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

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

    if (saving) return;

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

    if (
      !title ||
      !shortDescription ||
      !description ||
      !videoFile
    ) {
      alert(
        "Please complete all required fields and select a video."
      );
      return;
    }

    setSaving(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", videoFile);

      const uploadResponse = await fetch(
        "/api/cloudinary/promotions/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.error ||
            "Promotional video upload failed."
        );
      }

      await addDoc(collection(db, "promotions"), {
        title,
        shortDescription,
        description,
        video: uploadResult.url,
        videoPublicId: uploadResult.publicId,
        duration: uploadResult.duration || null,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
        format: uploadResult.format || null,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push("/sayolaproadmin/promotions");
    } catch (error) {
      console.error(
        "Failed to create promotion:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not create promotion."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() =>
            router.push("/sayolaproadmin/promotions")
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
              Create Promotional Video
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add a promotional video that will appear in
              the sliding promotion section on the SAYOLA
              homepage.
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
                rows={7}
                placeholder="Provide the complete information that visitors will see on the promotion page..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Promotional Video *
              </label>

              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-[#FF6B00] hover:bg-orange-50/30">
                <Upload
                  size={30}
                  className="text-[#FF6B00]"
                />

                <span className="mt-3 text-sm font-bold text-slate-700">
                  Select promotional video
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

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  router.push(
                    "/sayolaproadmin/promotions"
                  )
                }
                className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Publish Promotion
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
