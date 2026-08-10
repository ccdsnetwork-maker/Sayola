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
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function AdminTeamPage() {
  const router = useRouter();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const membersQuery = query(
      collection(db, "team"),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as TeamMember[];

        setMembers(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load team:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function deleteCloudinaryImage(publicId?: string) {
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
      console.error("Failed to delete team image:", error);
    }
  }

  async function handleDelete(member: TeamMember) {
    const confirmed = window.confirm(
      `Delete ${member.name || "this team member"}? This will also remove their image from Cloudinary.`
    );

    if (!confirmed) return;

    setDeletingId(member.id);

    try {
      await deleteDoc(doc(db, "team", member.id));
      await deleteCloudinaryImage(member.imagePublicId);
    } catch (error) {
      console.error("Failed to delete team member:", error);
      alert("Could not delete this team member.");
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

            <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342]">
              Team
            </h1>

            <p className="mt-3 text-slate-500">
              Add, edit and manage the team members displayed on the website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sayolaproadmin/team/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-bold text-white transition hover:bg-[#e85f00]"
          >
            <Plus size={18} />
            Add Team Member
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <Loader2
                  className="mx-auto animate-spin text-[#FF6B00]"
                  size={36}
                />
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading team...
                </p>
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center px-6 text-center">
              <div>
                <UserRound
                  size={44}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 text-xl font-extrabold text-[#0A2342]">
                  No team members yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first team member to display them on the website.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/sayolaproadmin/team/new")
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0A2342] px-5 py-3 font-bold text-white hover:bg-[#FF6B00]"
                >
                  <Plus size={17} />
                  Add Team Member
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#0A2342]">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name || "Team member"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon
                          size={28}
                          className="text-white/60"
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold text-[#0A2342]">
                      {member.name || "Unnamed team member"}
                    </h2>

                    <p className="mt-1 font-semibold text-[#FF6B00]">
                      {member.position || "Position not specified"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {member.bio || "No biography provided."}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span
                        className={`rounded-full px-3 py-1 font-bold ${
                          member.active === false
                            ? "bg-slate-100 text-slate-500"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {member.active === false ? "Hidden" : "Published"}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-500">
                        ID: {member.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/sayolaproadmin/team/${member.id}/edit`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#0A2342] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === member.id}
                      onClick={() => handleDelete(member)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === member.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete
                    </button>
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
