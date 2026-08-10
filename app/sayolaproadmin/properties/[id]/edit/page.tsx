"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type Property = {
  title?: string;
  location?: string;
  price?: string;
  type?: string;
  category?: string;
  description?: string;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  image?: string;
  featured?: boolean;
  available?: boolean;
};

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const [property, setProperty] =
    useState<Property | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] =
    useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    async function loadProperty() {
      try {
        const snapshot = await getDoc(
          doc(db, "properties", id)
        );

        if (!snapshot.exists()) {
          alert("Property not found.");
          router.replace("/sayolaproadmin/properties");
          return;
        }

        const data = snapshot.data() as Property;

        setProperty(data);
        setPreview(data.image || "");
      } catch (error) {
        console.error("Failed to load property:", error);
        alert("Could not load property.");
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id, router]);

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
      !description
    ) {
      alert("Please complete all required fields.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = property?.image || "";

      if (imageFile) {
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

        imageUrl = uploadResult.url;
      }

      await updateDoc(doc(db, "properties", id), {
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
        image: imageUrl,
        gallery: imageUrl ? [imageUrl] : [],
        updatedAt: serverTimestamp(),
      });

      alert("Property updated successfully.");

      router.push("/sayolaproadmin/properties");
    } catch (error) {
      console.error("Failed to update property:", error);
      alert(
        "Could not update property. Check Firestore and Storage rules."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading property...
          </p>
        </div>
      </main>
    );
  }

  if (!property) return null;

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

        <h1 className="mt-6 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
          Edit Property
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-4xl rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Property Title"
              name="title"
              defaultValue={property.title}
              required
            />

            <Field
              label="Location"
              name="location"
              defaultValue={property.location}
              required
            />

            <Field
              label="Price"
              name="price"
              defaultValue={property.price}
              required
            />

            <Select
              label="Purpose"
              name="type"
              value={property.type}
              options={["For Sale", "For Rent"]}
            />

            <Select
              label="Category"
              name="category"
              value={property.category}
              options={[
                "House",
                "Apartment",
                "Duplex",
                "Land",
                "Commercial",
              ]}
            />

            <Field
              label="Size"
              name="size"
              defaultValue={property.size}
            />

            <Field
              label="Bedrooms"
              name="bedrooms"
              type="number"
              defaultValue={String(property.bedrooms || 0)}
            />

            <Field
              label="Bathrooms"
              name="bathrooms"
              type="number"
              defaultValue={String(property.bathrooms || 0)}
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
              defaultValue={property.description}
              className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00]"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Features
            </label>

            <textarea
              name="features"
              rows={5}
              defaultValue={property.features?.join("\n")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00]"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-[#0A2342]">
              Property Image
            </label>

            <label className="block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#FF6B00]">
              {preview ? (
                <img
                  src={preview}
                  alt={property.title || "Property"}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                  Click to upload an image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="mt-2 text-xs text-slate-400">
              Select a new image only if you want to replace the
              current one.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#e85f00] disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Save Changes
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
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue || ""}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00]"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#0A2342]">
        {label}
      </label>

      <select
        name={name}
        defaultValue={value || ""}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FF6B00]"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
