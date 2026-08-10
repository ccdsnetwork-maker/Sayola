"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  Check,
  Eye,
  Mail,
  Phone,
  Trash2,
  X,
} from "lucide-react";

import { db } from "@/lib/firebase";

type Message = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  subject?: string;
  message?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyPrice?: string;
  read?: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Message[];

        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function markAsRead(message: Message) {
    try {
      await updateDoc(doc(db, "messages", message.id), {
        read: true,
      });

      if (selected?.id === message.id) {
        setSelected({
          ...message,
          read: true,
        });
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  }

  async function deleteMessage(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(db, "messages", id));

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Could not delete this message.");
    }
  }

  function formatDate(timestamp: Message["createdAt"]) {
    if (!timestamp?.seconds) {
      return "Date unavailable";
    }

    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  const unreadCount = messages.filter((item) => !item.read).length;

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <div className="container-site py-10">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              SAYOLA KAYBEE
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342]">
              Messages
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Messages and enquiries submitted through the website.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-500">
              Unread
            </span>

            <span className="ml-3 text-xl font-extrabold text-[#FF6B00]">
              {unreadCount}
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center px-6 text-center">
              <div>
                <Mail className="mx-auto text-slate-300" size={42} />

                <h2 className="mt-4 text-lg font-extrabold text-[#0A2342]">
                  No messages yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Messages submitted through the contact form will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 transition hover:bg-slate-50 sm:p-6 ${
                    !item.read ? "bg-orange-50/40" : ""
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-extrabold text-[#0A2342]">
                          {item.name || "Unnamed visitor"}
                        </h2>

                        {!item.read && (
                          <span className="rounded-full bg-[#FF6B00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                            New
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-4">
                        <span>{item.email || "No email"}</span>
                        <span>{item.phone || "No phone"}</span>
                        <span>{item.service || "General enquiry"}</span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                        {item.message || "No message"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() => {
                          setSelected(item);

                          if (!item.read) {
                            markAsRead(item);
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0A2342] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#FF6B00]"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(item)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                        >
                          <Check size={16} />
                          Read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteMessage(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2342]/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
                  Message
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#0A2342]">
                  {selected.name || "Visitor"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#0A2342]"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={`mailto:${selected.email || ""}`}
                  className="rounded-xl bg-[#F4F6F9] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-bold text-[#0A2342]">
                    {selected.email || "Not provided"}
                  </p>
                </a>

                <a
                  href={`tel:${selected.phone || ""}`}
                  className="rounded-xl bg-[#F4F6F9] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0A2342]">
                    {selected.phone || "Not provided"}
                  </p>
                </a>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Service
                </p>

                <p className="mt-2 text-sm font-bold text-[#0A2342]">
                  {selected.service || "General enquiry"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Message
                </p>

                <div className="mt-2 rounded-xl bg-[#F4F6F9] p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {selected.message || "No message"}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Received: {formatDate(selected.createdAt)}
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
