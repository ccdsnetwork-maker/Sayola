"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type Props = {
  params: Promise<{ id: string }>;
};

type Gist = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string[];
  image?: string;
  imagePublicId?: string;
  author?: string;
  publishedAt?: string;
  category?: string;
  published?: boolean;
  featured?: boolean;
};

export default function EditGistPage({ params }: Props) {
  const router = useRouter();

  const [id, setId] = useState("");
  const [gist, setGist] = useState<Gist | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function loadGist() {
      try {
        const snapshot = await getDoc(doc(db, "gists", id));

        if (!snapshot.exists()) {
          setGist(null);
          return;
        }

        setGist(snapshot.data() as Gist);
      } catch (error) {
        console.error("Failed to load gist:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGist();
  }, [id]);

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

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudinary/gists/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed.");
    }

    return {
      url: data.url as string,
      publicId: data.publicId as string,
    };
  }

  async function deleteCloudinaryImage(publicId?: string) {
    if (!publicId) return;

    await fetch("/api/cloudinary/gists/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });
  }

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !gist || saving) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const title = String(data.get("title") || "").trim();
    const excerpt = String(data.get("excerpt") || "").trim();
    const category = String(data.get("category") || "").trim();
    const author = String(data.get("author") || "").trim();
    const publishedAt = String(data.get("publishedAt") || "").trim();

    const contentText = String(data.get("content") || "").trim();

    const content = contentText
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!title || !excerpt || !category || !author || !content.length) {
      alert("Please complete all required fields.");
      return;
    }

    setSaving(true);

    try {
      let image = gist.image || "";
      let imagePublicId = gist.imagePublicId || "";

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);

        if (gist.imagePublicId) {
          await deleteCloudinaryImage(gist.imagePublicId);
        }

        image = uploaded.url;
        imagePublicId = uploaded.publicId;
      }

      await updateDoc(doc(db, "gists", id), {
        title,
        slug: slugify(title),
        excerpt,
        category,
        author,
        publishedAt,
        content,
        image,
        imagePublicId,
        updatedAt: serverTimestamp(),
      });

      alert("Gist updated successfully.");
      router.push("/sayolaproadmin/gists");
    } catch (error) {
      console.error("Failed to update gist:", error);
      alert("Could not update gist.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F6F9]">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2
            size={38}
            className="animate-spin text-[#FF6B00]"
          />
        </div>
      </main>
    );
  }

  if (!gist) {
    return (
      <main className="min-h-screen bg-[#F4F6F9]">
        <div className="container-site py-16">
          <h1 className="text-3xl font-extrabold text-[#0A2342]">
            Gist not found
          </h1>

          <button
            type="button"
            onClick={() => router.push("/sayolaproadmin/gists")}
            className="mt-6 inline-flex items-center gap-2 font-bold text-[#FF6B00]"
          >
            <ArrowLeft size={17} />
            Back to Gists
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <div className="container-site py-10">
        <button
          type="button"
          onClick={() => router.push("/sayolaproadmin/gists")}
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
            Edit Real Estate Gist
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-4xl rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Title"
              name="title"
              defaultValue={gist.title}
              required
            />

            <Field
              label="Category"
              name="category"
              defaultValue={gist.category}
              placeholder="Real Estate"
              required
            />

            <Field
              label="Author"
              name="author"
              defaultValue={gist.author}
              required
            />

            <Field
              label="Published Date"
              name="publishedAt"
              defaultValue={gist.publishedAt}
              placeholder="August 10, 2026"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Excerpt
            </label>

            <textarea
              name="excerpt"
              defaultValue={gist.excerpt}
              rows={4}
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Article Content
            </label>

            <p className="mb-2 text-xs text-slate-500">
              Separate paragraphs with a blank line.
            </p>

            <textarea
              name="content"
              defaultValue={(gist.content || []).join("\n\n")}
              rows={14}
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Cover Image
            </label>

            <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300">
              <div className="relative aspect-[16/8] bg-slate-100">
                {preview || gist.image ? (
                  <img
                    src={preview || gist.image}
                    alt="Gist cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImagePlus size={42} className="text-slate-300" />
                  </div>
                )}
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 p-5 text-sm font-bold text-[#0A2342] hover:text-[#FF6B00]">
                <Upload size={18} />
                Replace Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#0A2342]">
        {label}
      </label>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
      />
    </div>
  );
}
