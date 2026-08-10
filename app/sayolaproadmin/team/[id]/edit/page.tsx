"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type TeamMember = {
  id: string;
  name?: string;
  position?: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  image?: string;
  imagePublicId?: string;
  order?: number;
  active?: boolean;
};

export default function EditTeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    async function loadMember() {
      try {
        const snapshot = await getDoc(doc(db, "team", id));

        if (!snapshot.exists()) {
          setMember(null);
          return;
        }

        const data = snapshot.data() as Omit<TeamMember, "id">;

        setMember({
          id: snapshot.id,
          ...data,
        });

        setPreview(data.image || "");
      } catch (error) {
        console.error("Failed to load team member:", error);
        setMember(null);
      } finally {
        setLoading(false);
      }
    }

    loadMember();
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

    const response = await fetch("/api/cloudinary/team/upload", {
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

  async function deleteOldImage(publicId?: string) {
    if (!publicId) return;

    try {
      await fetch("/api/cloudinary/team/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });
    } catch (error) {
      console.error("Failed to delete old team image:", error);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!member) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const position = String(formData.get("position") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const linkedin = String(formData.get("linkedin") || "").trim();
    const order = Number(formData.get("order") || 0);
    const active = formData.get("active") === "on";

    if (!name || !position || !bio) {
      alert("Please complete the name, position and biography.");
      return;
    }

    setSaving(true);

    try {
      let image = member.image || "";
      let imagePublicId = member.imagePublicId || "";

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);

        image = uploaded.url;
        imagePublicId = uploaded.publicId;
      }

      await updateDoc(doc(db, "team", id), {
        name,
        position,
        bio,
        email,
        linkedin,
        image,
        imagePublicId,
        order: Number.isFinite(order) ? order : 0,
        active,
        updatedAt: serverTimestamp(),
      });

      if (
        imageFile &&
        member.imagePublicId &&
        member.imagePublicId !== imagePublicId
      ) {
        await deleteOldImage(member.imagePublicId);
      }

      alert("Team member updated successfully.");
      router.push("/sayolaproadmin/team");
    } catch (error) {
      console.error("Failed to update team member:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not update team member."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-[#FF6B00]"
          />
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading team member...
          </p>
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-[#F4F6F9]">
        <div className="container-site py-20 text-center">
          <UserNotFound />
          <h1 className="mt-5 text-2xl font-extrabold text-[#0A2342]">
            Team member not found
          </h1>
          <button
            type="button"
            onClick={() => router.push("/sayolaproadmin/team")}
            className="mt-6 rounded-xl bg-[#0A2342] px-6 py-3 font-bold text-white hover:bg-[#FF6B00]"
          >
            Back to Team
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
          onClick={() => router.push("/sayolaproadmin/team")}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2342] hover:text-[#FF6B00]"
        >
          <ArrowLeft size={17} />
          Back to Team
        </button>

        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Team Management
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342]">
            Edit Team Member
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-[#0A2342]">
                Full name *
              </label>

              <input
                name="name"
                required
                defaultValue={member.name || ""}
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-[#0A2342]">
                Position *
              </label>

              <input
                name="position"
                required
                defaultValue={member.position || ""}
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-[#0A2342]">
                Biography *
              </label>

              <textarea
                name="bio"
                rows={5}
                required
                defaultValue={member.bio || ""}
                disabled={saving}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0A2342]">
                Email
              </label>

              <input
                name="email"
                type="email"
                defaultValue={member.email || ""}
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0A2342]">
                LinkedIn URL
              </label>

              <input
                name="linkedin"
                type="url"
                defaultValue={member.linkedin || ""}
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0A2342]">
                Display order
              </label>

              <input
                name="order"
                type="number"
                min="0"
                defaultValue={member.order ?? 0}
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={member.active !== false}
                  disabled={saving}
                  className="h-4 w-4 accent-[#FF6B00]"
                />

                <span className="text-sm font-bold text-[#0A2342]">
                  Publish on website
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-5">
            <p className="text-sm font-bold text-[#0A2342]">
              Profile Image
            </p>

            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-[#0A2342]">
                {preview ? (
                  <img
                    src={preview}
                    alt={member.name || "Team member"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus
                    size={38}
                    className="absolute inset-0 m-auto text-white/50"
                  />
                )}
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0A2342] px-5 py-3 font-bold text-white hover:bg-[#FF6B00]">
                  <Upload size={17} />
                  Replace Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={saving}
                    className="hidden"
                  />
                </label>

                <p className="mt-3 text-xs text-slate-400">
                  Leave unchanged to keep the current image.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 font-bold text-white hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Save size={19} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}

function UserNotFound() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#FF6B00]">
      <ImagePlus size={30} />
    </div>
  );
}
