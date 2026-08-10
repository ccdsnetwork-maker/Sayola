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

import { getGistBySlug } from "@/lib/gist-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function GistArticlePage({ params }: Props) {
  const [gist, setGist] = useState<ReturnType<typeof getGistBySlug>>(undefined);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let active = true;

    params.then(({ slug }) => {
      if (active) {
        setGist(getGistBySlug(slug));
      }
    });

    return () => {
      active = false;
    };
  }, [params]);

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

  const handleLike = () => {
    setLiked((value) => !value);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: gist.title,
        text: gist.excerpt,
        url: window.location.href,
      });
    } else if (typeof navigator !== "undefined") {
      await navigator.clipboard?.writeText(window.location.href);
      alert("Article link copied.");
    }
  };

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
              {gist.views} views
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
              <Heart size={17} fill={liked ? "currentColor" : "none"} />
              {gist.likes + (liked ? 1 : 0)} likes
            </button>

            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">
              <MessageCircle size={17} />
              {gist.comments} comments
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
              Share your thoughts, questions or experience about this topic.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!comment.trim()) return;
                alert("Comment submitted. Firebase will handle this when connected.");
                setComment("");
              }}
              className="mt-6"
            >
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
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
