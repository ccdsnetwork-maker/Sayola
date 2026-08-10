"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type Gist = {
  id: string;
  title?: string;
  excerpt?: string;
  image?: string;
  imagePublicId?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  views?: number;
  likes?: number;
  comments?: number;
  slug?: string;
};

export default function AdminGistsPage() {
  const router = useRouter();

  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const gistsQuery = query(
      collection(db, "gists"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      gistsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Gist[];

        setGists(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load gists:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function deleteGist(gist: Gist) {
    const confirmed = window.confirm(
      `Delete "${gist.title || "this gist"}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(gist.id);

    try {
      await deleteDoc(doc(db, "gists", gist.id));

      if (gist.imagePublicId) {
        await fetch("/api/cloudinary/gists/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicId: gist.imagePublicId,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to delete gist:", error);
      alert("Could not delete this gist.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <div className="container-site py-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
              Real Estate Gist
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Create, edit and manage the articles published on the
              SAYOLA Real Estate Gist.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/sayolaproadmin/gists/new")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-bold text-white transition hover:bg-[#e85f00]"
          >
            <Plus size={18} />
            Add Gist
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Articles"
            value={gists.length}
          />

          <StatCard
            label="Total Views"
            value={gists.reduce(
              (sum, item) => sum + (item.views || 0),
              0
            )}
          />

          <StatCard
            label="Total Likes"
            value={gists.reduce(
              (sum, item) => sum + (item.likes || 0),
              0
            )}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <Loader2
                  size={36}
                  className="mx-auto animate-spin text-[#FF6B00]"
                />

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading gists...
                </p>
              </div>
            </div>

          ) : gists.length === 0 ? (

            <div className="flex min-h-64 items-center justify-center px-6 text-center">
              <div>

                <FileText
                  size={46}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 text-xl font-extrabold text-[#0A2342]">
                  No gists yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first article to start publishing
                  insights.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/sayolaproadmin/gists/new")
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0A2342] px-5 py-3 font-bold text-white transition hover:bg-[#FF6B00]"
                >
                  <Plus size={17} />
                  Add Gist
                </button>

              </div>
            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {gists.map((gist) => (
                <div
                  key={gist.id}
                  className="p-5 sm:p-6"
                >

                  <div className="flex flex-col gap-5 lg:flex-row">

                    <div className="h-48 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-40 lg:w-56 lg:shrink-0">

                      {gist.image ? (
                        <img
                          src={gist.image}
                          alt={gist.title || "Gist"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FileText
                            size={36}
                            className="text-slate-300"
                          />
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap gap-2">

                        {gist.category && (
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#FF6B00]">
                            {gist.category}
                          </span>
                        )}

                        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                          <Eye size={13} />
                          {gist.views || 0}
                        </span>

                      </div>

                      <h2 className="mt-3 text-xl font-extrabold text-[#0A2342]">
                        {gist.title || "Untitled Gist"}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {gist.excerpt || "No excerpt provided."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
                        <span>
                          {gist.author || "SAYOLA"}
                        </span>

                        <span>
                          {gist.publishedAt || "No date"}
                        </span>

                        <span>
                          {gist.likes || 0} likes
                        </span>

                        <span>
                          {gist.comments || 0} comments
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/real-estate-gist/${gist.slug}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/sayolaproadmin/gists/${gist.id}/edit`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-[#0A2342] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF6B00]"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === gist.id}
                          onClick={() => deleteGist(gist)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === gist.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#0A2342]">
        {value}
      </p>
    </div>
  );
}
