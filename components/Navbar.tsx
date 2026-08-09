"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Properties", href: "/properties" },
  { name: "Real Estate Gist", href: "/real-estate-gist" },
  { name: "Logistics", href: "/logistics" },
  { name: "Our Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-md">
      <div className="container-site">
        <nav className="flex h-20 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
              <Image
                src="/images/sayola.png"
                alt="SAYOLA KAYBEE GLOBAL LIMITED"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="whitespace-nowrap text-[11px] font-extrabold leading-tight text-[#0A2342] sm:text-sm md:text-base">
                SAYOLA KAYBEE GLOBAL LIMITED
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-700 transition-colors hover:text-[#FF6B00]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#e85f00] hover:shadow-lg"
            >
              Get Quote
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg p-2 text-[#0A2342] transition-colors hover:bg-slate-100 lg:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="border-t border-slate-100 py-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#FF6B00]"
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-bold text-white"
                >
                  Get Quote
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
