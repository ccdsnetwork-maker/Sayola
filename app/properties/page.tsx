"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Square,
} from "lucide-react";
import Link from "next/link";

import PropertyCard from "@/components/PropertyCard";
import { featuredProperties } from "@/lib/home-data";
import { Reveal } from "@/components/Motion";

const allProperties = [
  ...featuredProperties,
  {
    id: "sayola-land-1",
    title: "Premium Residential Land",
    location: "Moniya, Ibadan",
    price: "₦25,000,000",
    type: "For Sale",
    category: "Land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "sayola-apartment-1",
    title: "Executive City Apartment",
    location: "Victoria Island, Lagos",
    price: "₦12,000,000 / year",
    type: "For Rent",
    category: "Apartment",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "sayola-commercial-1",
    title: "Modern Commercial Space",
    location: "Ring Road, Ibadan",
    price: "₦95,000,000",
    type: "For Sale",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
  },
];

const categories = [
  "All",
  "House",
  "Apartment",
  "Duplex",
  "Land",
  "Commercial",
];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("All");
  const [category, setCategory] = useState("All");

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase());

      const matchesPurpose =
        purpose === "All" || property.type === purpose;

      const matchesCategory =
        category === "All" || property.category === category;

      return matchesSearch && matchesPurpose && matchesCategory;
    });
  }, [search, purpose, category]);

  return (
    <main>
      {/* PAGE HERO */}
      <section className="relative overflow-hidden bg-[#0A2342] py-20 sm:py-24">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#FF6B00]/20 blur-3xl" />

        <div className="container-site relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Properties
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find a property that
              <span className="text-[#FF6B00]"> creates value.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl leading-8 text-slate-300">
              Explore selected residential, commercial and land
              opportunities from SAYOLA KAYBEE GLOBAL LIMITED.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FILTER AREA */}
      <section className="relative z-10 -mt-8">
        <div className="container-site">
          <Reveal>
            <div className="rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(10,35,66,0.15)] sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
                {/* Search */}
                <div className="rounded-xl border border-slate-200 px-4 py-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Search
                  </label>

                  <div className="mt-1 flex items-center gap-2">
                    <Search
                      size={17}
                      className="text-[#FF6B00]"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      type="text"
                      placeholder="Location or property name"
                      className="w-full bg-transparent text-sm font-medium text-[#0A2342] outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div className="rounded-xl border border-slate-200 px-4 py-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Purpose
                  </label>

                  <select
                    value={purpose}
                    onChange={(event) =>
                      setPurpose(event.target.value)
                    }
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-[#0A2342] outline-none"
                  >
                    <option value="All">Buy or Rent</option>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>

                {/* Category */}
                <div className="rounded-xl border border-slate-200 px-4 py-3">
                  <label className="block text-xs font-semibold text-slate-400">
                    Property Type
                  </label>

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-[#0A2342] outline-none"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item === "All"
                          ? "All Properties"
                          : item}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPurpose("All");
                    setCategory("All");
                  }}
                  className="flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 font-bold text-white transition hover:bg-[#e85f00]"
                >
                  <SlidersHorizontal size={18} />
                  Reset
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROPERTY LIST */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <p className="text-sm font-semibold text-slate-500">
                Showing{" "}
                <span className="font-bold text-[#0A2342]">
                  {filteredProperties.length}
                </span>{" "}
                properties
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-[#0A2342]">
                Available Properties
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Building2 size={17} className="text-[#FF6B00]" />
                Verified opportunities
              </div>
            </Reveal>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property, index) => (
                <div key={property.id}>
                  <PropertyCard
                    property={property}
                    index={index}
                  />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-2xl bg-white px-6 py-16 text-center shadow-sm"
            >
              <Home
                size={40}
                className="mx-auto text-[#FF6B00]"
              />

              <h3 className="mt-5 text-xl font-bold text-[#0A2342]">
                No properties found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search or filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* INVESTMENT CTA */}
      <section className="bg-white py-20">
        <div className="container-site">
          <Reveal>
            <div className="grid overflow-hidden rounded-[2rem] bg-[#0A2342] lg:grid-cols-[1fr_auto]">
              <div className="p-8 sm:p-12">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Need assistance?
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                  Not sure which property is right for you?
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-slate-300">
                  Tell us what you're looking for and our team can
                  help you identify suitable opportunities.
                </p>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 font-bold text-white transition hover:bg-[#e85f00]"
                >
                  Speak with our team
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="hidden min-w-[250px] items-center justify-center bg-[#FF6B00] p-10 lg:flex">
                <div className="text-center text-white">
                  <BedDouble
                    size={48}
                    className="mx-auto"
                  />

                  <p className="mt-4 text-3xl font-extrabold">
                    Invest
                  </p>

                  <p className="mt-1 text-white/80">
                    with confidence
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
