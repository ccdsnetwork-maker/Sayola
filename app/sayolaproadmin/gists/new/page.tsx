"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,

  Upload,
} from "lucide-react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

export default function NewGistPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function createSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/cloudinary/gists/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Gist image upload failed."
      );
    }

    return {
      url: data.url as string,
      publicId: data.publicId as string,
    };
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(
      formData.get("title") || ""
    ).trim();

    const excerpt = String(
      formData.get("excerpt") || ""
    ).trim();

    const category = String(
      formData.get("category") || ""
    ).trim();

    const author = String(
      formData.get("author") || ""
    ).trim();

    const publishedAt = String(
      formData.get("publishedAt") || ""
    ).trim();

    const contentText = String(
      formData.get("content") || ""
    ).trim();

    if (
      !title ||
      !excerpt ||
      !category ||
      !author ||
      !publishedAt ||
      !contentText
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (!imageFile) {
      alert("Please select a cover image.");
      return;
    }

    const content = contentText
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (content.length === 0) {
      alert("Please enter the article content.");
      return;
    }

    setSaving(true);

    try {
      const uploaded = await uploadImage(imageFile);

      const slug = createSlug(title);

      await addDoc(collection(db, "gists"), {
        slug,
        title,
        excerpt,
        content,
        image: uploaded.url,
        imagePublicId: uploaded.publicId,
        author,
        publishedAt,
        views: 0,
        likes: 0,
        comments: 0,
        category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Gist published successfully.");

      router.push("/sayolaproadmin/gists");
    } catch (error) {
      console.error("Failed to create gist:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not create gist."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <div className="container-site py-10">

        <button
          type="button"
          onClick={() =>
            router.push("/sayolaproadmin/gists")
          }
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2342] hover:text-[#FF6B00]"
        >
          <ArrowLeft size={17} />
          Back to Gists
        </button>

        <div className="mt-6 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
            Add Real Estate Gist
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create and publish a new article for the SAYOLA
            Real Estate Gist.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-4xl rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            <Field
              label="Article Title"
              name="title"
              placeholder="How to Build Wealth Through Real Estate"
              required
            />

            <Field
              label="Category"
              name="category"
              placeholder="Real Estate"
              required
            />

            <Field
              label="Author"
              name="author"
              placeholder="SAYOLA KAYBEE GLOBAL LIMITED"
              required
            />

            <Field
              label="Published Date"
              name="publishedAt"
              placeholder="August 10, 2026"
              required
            />

          </div>

          <div className="mt-5">
            <label
              htmlFor="excerpt"
              className="mb-2 block text-sm font-bold text-[#0A2342]"
            >
              Short Excerpt
            </label>

            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              required
              placeholder="A short summary that will appear on the article card..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-bold text-[#0A2342]"
            >
              Article Content
            </label>

            <textarea
              id="content"
              name="content"
              rows={14}
              required
              placeholder={`Write your article here.

Put each paragraph on a separate line.

The system will automatically turn each line into a paragraph on the article page.`}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
            />

            <p className="mt-2 text-xs text-slate-400">
              Put each paragraph on a separate line.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Cover Image
            </label>

            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-[#F4F6F9] transition hover:border-[#FF6B00]">

                {preview ? (
                  <img
                    src={preview}
                    alt="Gist cover preview"
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImagePlus
                      size={42}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-bold text-[#0A2342]">
                      Select cover image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG or WEBP up to 10MB
                    </p>
                  </div>
                )}

              </div>
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                router.push("/sayolaproadmin/gists")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition hover:border-slate-300 disabled:opacity-50"
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
                  Publishing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Publish Gist
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-[#0A2342]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
      />
    </div>
  );
}
