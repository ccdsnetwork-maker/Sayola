"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Gist = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default function GistArticlePage({ params }: Props) {
  const [gist, setGist] = useState<Gist | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let active = true;

    async function loadGist() {
      try {
        const { slug } = await params;

        const gistQuery = query(
          collection(db, "gists"),
          where("slug", "==", slug)
        );

        const snapshot = await getDocs(gistQuery);

        if (!snapshot.empty && active) {
          const item = snapshot.docs[0];

          setGist({
            id: item.id,
            ...item.data(),
          } as Gist);
        }
      } catch (error) {
        console.error("Failed to load gist:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadGist();

    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!gist) return;

    const storageKey = `sayola-gist-viewed-${gist.id}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    sessionStorage.setItem(storageKey, "true");

    const newViews = (gist.views || 0) + 1;

    updateDoc(doc(db, "gists", currentGist.id), {
      views: newViews,
    })
      .then(() => {
        setGist((current) =>
          current
            ? {
                ...current,
                views: newViews,
              }
            : current
        );
      })
      .catch((error) => {
        console.error("Failed to update views:", error);
      });
  }, [gist?.id]);

  if (loading) {
    return (
      <main className="container-site py-24">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />
      </main>
    );
  }

  if (!gist) {
    return (
      <main className="container-site py-24">
        <h1 className="text-3xl font-extrabold text-[#0A2342]">
          Gist not found
        </h1>

        <Link
          href="/real-estate-gist"
          className="mt-6 inline-flex items-center gap-2 font-bold text-[#FF6B00]"
        >
          <ArrowLeft size={18} />
          Back to Real Estate Gist
        </Link>
      </main>
    );
  }

  const currentGist = gist;

  async function handleLike() {
    if (liked) return;

    setLiked(true);

    const newLikes = (currentGist.likes || 0) + 1;

    try {
      await updateDoc(doc(db, "gists", currentGist.id), {
        likes: newLikes,
      });

      setGist((current) =>
        current
          ? {
              ...current,
              likes: newLikes,
            }
          : current
      );
    } catch (error) {
      console.error("Failed to update likes:", error);
      setLiked(false);
    }
  }

  async function handleShare() {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: currentGist.title,
          text: currentGist.excerpt,
          url: window.location.href,
        });
      } else if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Article link copied.");
      }
    } catch (error) {
      console.error("Share cancelled or failed:", error);
    }
  }

  async function handleComment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!comment.trim()) return;

    const newComments = (currentGist.comments || 0) + 1;

    try {
      await updateDoc(doc(db, "gists", currentGist.id), {
        comments: newComments,
      });

      setGist((current) =>
        current
          ? {
              ...current,
              comments: newComments,
            }
          : current
      );

      setComment("");

      alert("Comment submitted successfully.");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Could not submit comment.");
    }
  }

  return (
    <main className="bg-[#F4F6F9]">
      <article className="container-site py-10 sm:py-16">
        <Link
          href="/real-estate-gist"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00]"
        >
          <ArrowLeft size={17} />
          Back to Real Estate Gist
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 max-w-4xl"
        >
          <p className="text-sm font-semibold text-[#FF6B00]">
            {gist.category}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#0A2342] sm:text-5xl">
            {gist.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{gist.author}</span>
            <span>•</span>
            <span>{gist.publishedAt}</span>
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={gist.image}
              alt={gist.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">
              <Eye size={17} />
              {gist.views || 0} views
            </span>

            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                liked
                  ? "bg-[#FF6B00] text-white"
                  : "bg-white text-slate-600 hover:text-[#FF6B00]"
              }`}
            >
              <Heart
                size={17}
                fill={liked ? "currentColor" : "none"}
              />
              {gist.likes || 0} likes
            </button>

            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">
              <MessageCircle size={17} />
              {gist.comments || 0} comments
            </span>

            <button
              type="button"
              onClick={handleShare}
              className="ml-auto flex items-center gap-2 rounded-full bg-[#0A2342] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#FF6B00]"
            >
              <Share2 size={17} />
              Share
            </button>
          </div>

          <div className="mt-10 space-y-6">
            {gist.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-8 text-slate-700 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-14 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-[#FF6B00]" />

              <h2 className="text-2xl font-extrabold text-[#0A2342]">
                Join the Conversation
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share your thoughts, questions or experience about
              this topic.
            </p>

            <form
              onSubmit={handleComment}
              className="mt-6"
            >
              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Write your comment..."
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-[#F4F6F9] p-4 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/10"
              />

              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#e85f00]"
              >
                <Send size={17} />
                Post Comment
              </button>
            </form>
          </section>
        </motion.div>
      </article>
    </main>
  );
}
