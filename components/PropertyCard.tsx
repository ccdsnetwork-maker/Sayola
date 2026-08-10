"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: {
    id: string;
    title?: string;
    location?: string;
    price?: string;
    type?: string;
    category?: string;
    image?: string;
  };
  index?: number;
}

export default function PropertyCard({
  property,
  index = 0,
}: PropertyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
      className="group overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(10,35,66,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(10,35,66,0.14)]"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.image || "/images/sayola.png"}
          alt={property.title || "SAYOLA property"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-[#FF6B00] px-3 py-1.5 text-xs font-bold text-white">
          {property.type || "Property"}
        </span>

        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0A2342]">
          {property.category || "Real Estate"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-[#0A2342]">
          {property.title || "Property Listing"}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} className="text-[#FF6B00]" />
          {property.location || "Location unavailable"}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Price
            </p>

            <p className="mt-1 font-bold text-[#0A2342]">
              {property.price || "Price on request"}
            </p>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A2342] text-white transition-all hover:bg-[#FF6B00]"
            aria-label={`View ${property.title || "Property Listing"}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
