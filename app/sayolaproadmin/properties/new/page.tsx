"use client";

import { FormEvent, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { ArrowLeft, ImagePlus, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

export default function NewPropertyPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const title = String(data.get("title") || "").trim();
    const location = String(data.get("location") || "").trim();
    const price = String(data.get("price") || "").trim();
    const type = String(data.get("type") || "").trim();
    const category = String(data.get("category") || "").trim();
    const description = String(
      data.get("description") || ""
    ).trim();
    const size = String(data.get("size") || "").trim();

    const bedrooms = Number(data.get("bedrooms") || 0);
    const bathrooms = Number(data.get("bathrooms") || 0);

    const featuresText = String(
      data.get("features") || ""
    ).trim();

    if (
      !title ||
      !location ||
      !price ||
      !type ||
      !category ||
      !description ||
      !imageFile
    ) {
      alert("Please complete all required fields and select an image.");
      return;
    }

    setSaving(true);

    try {
      const propertyRef = await addDoc(
        collection(db, "properties"),
        {
          title,
          location,
          price,
          type,
          category,
          description,
          size,
          bedrooms,
          bathrooms,
          features: featuresText
            ? featuresText
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          image: "",
          gallery: [],
          featured: false,
          available: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      const uploadData = new FormData();
      uploadData.append("file", imageFile);

      const uploadResponse = await fetch(
        "/api/cloudinary/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.url) {
        throw new Error(
          uploadResult.error || "Cloudinary upload failed."
        );
      }

      const imageUrl = uploadResult.url;

      const { updateDoc, doc } = await import(
        "firebase/firestore"
      );

      await updateDoc(
        doc(db, "properties", propertyRef.id),
        {
          image: imageUrl,
          gallery: [imageUrl],
          updatedAt: serverTimestamp(),
        }
      );

      alert("Property created successfully.");

      router.push("/sayolaproadmin/properties");
    } catch (error) {
      console.error("Failed to create property:", error);

      alert(
        "Could not create property. Check Firebase Firestore and Storage permissions."
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
            router.push("/sayolaproadmin/properties")
          }
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2342] hover:text-[#FF6B00]"
        >
          <ArrowLeft size={17} />
          Back to Properties
        </button>

        <div className="mt-6 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
            Add Property
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create a property listing and upload its main image.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-4xl rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Property Title"
              name="title"
              placeholder="Luxury 4 Bedroom Duplex"
              required
            />

            <Field
              label="Location"
              name="location"
              placeholder="Bodija, Ibadan"
              required
            />

            <Field
              label="Price"
              name="price"
              placeholder="₦85,000,000"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-[#0A2342]">
                Purpose
              </label>

              <select
                name="type"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00]"
              >
                <option value="">Select purpose</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#0A2342]">
                Property Category
              </label>

              <select
                name="category"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00]"
              >
                <option value="">Select category</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Duplex">Duplex</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <Field
              label="Size"
              name="size"
              placeholder="450 sqm"
            />

            <Field
              label="Bedrooms"
              name="bedrooms"
              type="number"
              placeholder="4"
            />

            <Field
              label="Bathrooms"
              name="bathrooms"
              type="number"
              placeholder="5"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Description
            </label>

            <textarea
              name="description"
              required
              rows={6}
              placeholder="Describe the property..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Features
            </label>

            <textarea
              name="features"
              rows={5}
              placeholder={"Boys quarters\nParking space\nSecurity\nWater supply"}
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
            />

            <p className="mt-2 text-xs text-slate-400">
              Put one feature on each line.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Main Property Image
            </label>

            <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#FF6B00]">
              {preview ? (
                <img
                  src={preview}
                  alt="Property preview"
                  className="h-64 w-full object-cover"
                />
              ) : (
                <>
                  <ImagePlus
                    size={42}
                    className="text-[#FF6B00]"
                  />

                  <span className="mt-3 text-sm font-bold text-[#0A2342]">
                    Choose Property Image
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    JPG, PNG or WEBP — maximum 10MB
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imageFile && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push("/sayolaproadmin/properties")
              }
              className="rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving Property...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Save Property
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
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#0A2342]">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
      />
    </div>
  );
}
