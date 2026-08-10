"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

type Gist = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
};

type GistCardProps = {
  gist: Gist;
  index?: number;
};

export default function GistCard({
  gist,
  index = 0,
}: GistCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/real-estate-gist/${gist.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={gist.image}
            alt={gist.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 rounded-full bg-[#FF6B00] px-3 py-1 text-xs font-bold text-white">
            {gist.category}
          </div>
        </div>
      </Link>

      <div className="p-6">
        <p className="text-xs font-semibold text-slate-500">
          {gist.publishedAt}
        </p>

        <Link href={`/real-estate-gist/${gist.slug}`}>
          <h2 className="mt-2 text-xl font-extrabold leading-tight text-[#0A2342] transition-colors group-hover:text-[#FF6B00]">
            {gist.title}
          </h2>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {gist.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Eye size={15} />
              {gist.views || 0}
            </span>

            <span className="flex items-center gap-1">
              <Heart size={15} />
              {gist.likes || 0}
            </span>

            <span className="flex items-center gap-1">
              <MessageCircle size={15} />
              {gist.comments || 0}
            </span>
          </div>

          <span className="flex items-center gap-1 text-sm font-bold text-[#FF6B00]">
            Read Gist
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
