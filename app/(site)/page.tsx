"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  MapPin,
  PackageCheck,
  Quote,
  Search,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import { motion } from "framer-motion";

import PropertyCard from "@/components/PropertyCard";
import PromotionSlider from "@/components/PromotionSlider";
import { Reveal } from "@/components/Motion";
import {
  stats,
  testimonials,
} from "@/lib/home-data";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const services = [
  {
    title: "Real Estate Development",
    description:
      "Strategic property development focused on quality, functionality and long-term value.",
    icon: Building2,
  },
  {
    title: "Property Management",
    description:
      "Professional management solutions designed to protect and maximise your property investment.",
    icon: Warehouse,
  },
  {
    title: "Haulage & Trucking",
    description:
      "Dependable transportation solutions for moving goods safely and efficiently.",
    icon: Truck,
  },
  {
    title: "General Logistics",
    description:
      "Integrated logistics and supply-chain support built around your business needs.",
    icon: PackageCheck,
  },
];

const reasons = [
  "Professional and transparent service",
  "Property and logistics expertise",
  "Client-focused approach",
  "Commitment to quality",
];

type Property = {
  id: string;
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

export default function Home() {
  const [featuredProperties, setFeaturedProperties] =
    useState<Property[]>([]);
  const [featuredPage, setFeaturedPage] = useState(1);

  const FEATURED_PER_PAGE = 6;

  const featuredTotalPages = Math.max(
    1,
    Math.ceil(featuredProperties.length / FEATURED_PER_PAGE)
  );

  const featuredStartIndex =
    (featuredPage - 1) * FEATURED_PER_PAGE;

  const visibleFeaturedProperties = featuredProperties.slice(
    featuredStartIndex,
    featuredStartIndex + FEATURED_PER_PAGE
  );

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const snapshot = await getDocs(
          collection(db, "properties")
        );

        const data = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (property: any) =>
              property.featured === true &&
              property.available !== false
          );

        setFeaturedProperties(data);
      } catch (error) {
        console.error(
          "Failed to load featured properties:",
          error
        );
      }
    }

    loadFeaturedProperties();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2342]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FF6B00] blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-400 blur-[140px]" />
        </div>

        <div className="container-site relative py-20 sm:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#FF6B00]" />
                  Real Estate & Logistics
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Building Assets.
                  <span className="block text-[#FF6B00]">
                    Creating Wealth.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                  SAYOLA KAYBEE GLOBAL LIMITED provides trusted real estate
                  and logistics solutions designed to help individuals and
                  businesses move forward with confidence.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/properties"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#e85f00]"
                  >
                    Explore Properties
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-4 font-bold text-white transition hover:border-white hover:bg-white hover:text-[#0A2342]"
                  >
                    Get a Quote
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-[#FF6B00]" />
                    Trusted solutions
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-[#FF6B00]" />
                    Professional service
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Hero visual */}
            <Reveal delay={0.2} className="relative">
              <div className="relative mx-auto max-w-lg">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
                  <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-700 via-[#0A2342] to-slate-950">
                    <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#FF6B00]/30 blur-3xl" />

                    <div className="absolute inset-x-8 top-8 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                        Our Promise
                      </p>

                      <p className="mt-3 text-2xl font-bold text-white">
                        Value today.
                        <br />
                        Wealth tomorrow.
                      </p>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white p-4">
                          <Building2
                            size={24}
                            className="text-[#FF6B00]"
                          />
                          <p className="mt-3 text-2xl font-extrabold text-[#0A2342]">
                            Real
                          </p>
                          <p className="text-sm text-slate-500">
                            Estate
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#FF6B00] p-4">
                          <Truck size={24} className="text-white" />
                          <p className="mt-3 text-2xl font-extrabold text-white">
                            Smart
                          </p>
                          <p className="text-sm text-white/80">
                            Logistics
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-6 -left-5 rounded-2xl bg-white p-4 shadow-2xl sm:-left-8"
                >
                  <p className="text-xs font-semibold text-slate-400">
                    Company Registration
                  </p>

                  <p className="mt-1 font-bold text-[#0A2342]">
                    RC: 9385622
                  </p>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium text-white/50 lg:flex">
          <span>Scroll to explore</span>
          <ChevronDown size={15} />
        </div>
      </section>

      {/* PROPERTY SEARCH */}
      <section className="relative z-10 -mt-8">
        <div className="container-site">
          <Reveal>
            <div className="rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(10,35,66,0.15)] sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
                <div className="rounded-xl border border-slate-200 px-4 py-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Location
                  </label>

                  <div className="mt-1 flex items-center gap-2">
                    <MapPin size={17} className="text-[#FF6B00]" />

                    <input
                      type="text"
                      placeholder="Where are you looking?"
                      className="w-full bg-transparent text-sm font-medium text-[#0A2342] outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 px-4 py-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Property Type
                  </label>

                  <select className="mt-1 w-full bg-transparent text-sm font-medium text-[#0A2342] outline-none">
                    <option>Any Property</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Land</option>
                    <option>Commercial</option>
                  </select>
                </div>

                <div className="rounded-xl border border-slate-200 px-4 py-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Purpose
                  </label>

                  <select className="mt-1 w-full bg-transparent text-sm font-medium text-[#0A2342] outline-none">
                    <option>Buy or Rent</option>
                    <option>For Sale</option>
                    <option>For Rent</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-7 font-bold text-white transition hover:bg-[#e85f00]"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-24">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                About Sayola Kaybee
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0A2342] sm:text-4xl">
                We don't just move
                <span className="text-[#FF6B00]"> property.</span>
                <br />
                We create opportunities.
              </h2>

              <div className="orange-line mt-6" />

              <p className="mt-6 leading-8 text-slate-600">
                SAYOLA KAYBEE GLOBAL LIMITED is a growing Nigerian company
                operating across real estate and logistics. Our goal is
                simple: provide dependable solutions that create measurable
                value for our clients.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                From property development and management to transportation
                and supply-chain services, we approach every project with
                professionalism, transparency and a long-term mindset.
              </p>

              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 font-bold text-[#0A2342] transition hover:text-[#FF6B00]"
              >
                Discover our story
                <ArrowRight size={17} />
              </Link>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -5 }}
                    className={`rounded-2xl p-7 ${
                      index === 1
                        ? "bg-[#FF6B00] text-white"
                        : "bg-[#F4F6F9] text-[#0A2342]"
                    }`}
                  >
                    <p className="text-4xl font-extrabold">
                      {stat.value}
                    </p>

                    <p
                      className={`mt-2 text-sm ${
                        index === 1
                          ? "text-white/80"
                          : "text-slate-500"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#F4F6F9] py-24">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              What We Do
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
              Solutions built around your goals
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Professional services across real estate and logistics,
              delivered with a commitment to quality.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal key={service.title} delay={index * 0.08}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group h-full rounded-2xl bg-white p-7 shadow-sm transition-shadow hover:shadow-xl"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A2342] text-white transition-colors group-hover:bg-[#FF6B00]">
                      <Icon size={26} />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-[#0A2342]">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {service.description}
                    </p>

                    <Link
                      href="/logistics"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00]"
                    >
                      Learn more
                      <ArrowUpRight size={15} />
                    </Link>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROMOTIONS */}
      <PromotionSlider />

      {/* FEATURED PROPERTIES */}
      <section className="bg-white py-24">
        <div className="container-site">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Featured Properties
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                Find a place to call yours
              </h2>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-bold text-[#0A2342] hover:text-[#FF6B00]"
            >
              View all properties
              <ArrowRight size={17} />
            </Link>
          </Reveal>

          {/* PROPERTY COUNT */}
          <div className="mt-10 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              {featuredProperties.length}{" "}
              {featuredProperties.length === 1 ? "property" : "properties"} available
            </p>

            {featuredProperties.length > 0 && (
              <p className="text-sm font-medium text-slate-400">
                Showing {featuredStartIndex + 1}-
                {Math.min(
                  featuredStartIndex + FEATURED_PER_PAGE,
                  featuredProperties.length
                )}{" "}
                of {featuredProperties.length}
              </p>
            )}
          </div>

          {/* PROPERTY CARDS */}
          {featuredProperties.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFeaturedProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <p className="font-semibold text-[#0A2342]">
                No featured properties available at the moment.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Please check back soon for new listings.
              </p>
            </div>
          )}

          {/* PAGINATION */}
          {featuredTotalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFeaturedPage((page) => Math.max(1, page - 1))
                }
                disabled={featuredPage === 1}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-[#0A2342] transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: featuredTotalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setFeaturedPage(page)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                    featuredPage === page
                      ? "bg-[#FF6B00] text-white"
                      : "border border-slate-200 text-[#0A2342] hover:border-[#FF6B00] hover:text-[#FF6B00]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setFeaturedPage((page) =>
                    Math.min(featuredTotalPages, page + 1)
                  )
                }
                disabled={featuredPage === featuredTotalPages}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-[#0A2342] transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#0A2342] py-24 text-white">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Why Choose Sayola
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
                A partner focused on
                <span className="text-[#FF6B00]"> your value.</span>
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-slate-300">
                We combine professional service, practical expertise and a
                long-term approach to deliver solutions our clients can trust.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 font-bold text-white transition hover:bg-[#e85f00]"
              >
                Work with us
                <ArrowRight size={18} />
              </Link>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <Reveal key={reason} delay={index * 0.1}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <ShieldCheck size={26} className="text-[#FF6B00]" />

                    <h3 className="mt-4 font-bold">{reason}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      A core part of how we approach every client relationship
                      and project.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#F4F6F9] py-24">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Client Experiences
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
              Trusted by people who value results
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.1}>
                <div className="relative h-full rounded-2xl bg-white p-7 shadow-sm">
                  <Quote size={32} className="text-[#FF6B00]/20" />

                  <p className="mt-4 leading-7 text-slate-600">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="font-bold text-[#0A2342]">
                      {testimonial.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white py-24">
        <div className="container-site">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#FF6B00] px-7 py-14 text-center sm:px-14">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />
              <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#0A2342]/10" />

              <div className="relative mx-auto max-w-3xl">
                <CircleDollarSign
                  size={42}
                  className="mx-auto text-white"
                />

                <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-5xl">
                  Ready to create wealth?
                </h2>

                <p className="mx-auto mt-5 max-w-xl leading-7 text-white/85">
                  Whether you are looking for your next property, professional
                  management or dependable logistics, let's start a
                  conversation.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="rounded-xl bg-[#0A2342] px-7 py-4 font-bold text-white transition hover:bg-[#071a31]"
                  >
                    Talk to Sayola
                  </Link>

                  <a
                    href="https://wa.me/2348132566255"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white px-7 py-4 font-bold text-[#0A2342] transition hover:bg-slate-100"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
