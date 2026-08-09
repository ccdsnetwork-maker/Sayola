"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Share2,
  ShieldCheck,
  Square,
} from "lucide-react";
import { motion } from "framer-motion";

import { featuredProperties } from "@/lib/home-data";
import { Reveal } from "@/components/Motion";

const extraProperties = [
  {
    id: "sayola-land-1",
    title: "Premium Residential Land",
    location: "Moniya, Ibadan",
    price: "₦25,000,000",
    type: "For Sale",
    category: "Land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "sayola-apartment-1",
    title: "Executive City Apartment",
    location: "Victoria Island, Lagos",
    price: "₦12,000,000 / year",
    type: "For Rent",
    category: "Apartment",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "sayola-commercial-1",
    title: "Modern Commercial Space",
    location: "Ring Road, Ibadan",
    price: "₦95,000,000",
    type: "For Sale",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
  },
];

const allProperties = [
  ...featuredProperties,
  ...extraProperties,
];

const features = [
  "Verified property opportunity",
  "Strategic location",
  "Professional documentation support",
  "Expert property guidance",
];

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const property = allProperties.find(
    (item) => item.id === id
  );

  if (!property) {
    return (
      <main className="min-h-[70vh] bg-[#F4F6F9]">
        <div className="container-site flex min-h-[70vh] items-center justify-center py-20">
          <div className="max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">
            <Building2
              size={48}
              className="mx-auto text-[#FF6B00]"
            />

            <h1 className="mt-5 text-3xl font-extrabold text-[#0A2342]">
              Property not found
            </h1>

            <p className="mt-3 text-slate-500">
              The property you're looking for may have been removed
              or is no longer available.
            </p>

            <Link
              href="/properties"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0A2342] px-6 py-4 font-bold text-white transition hover:bg-[#FF6B00]"
            >
              <ArrowLeft size={18} />
              Back to Properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const gallery = [
    property.image,
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
  ];

  return (
    <main>
      {/* HEADER */}
      <section className="bg-[#0A2342] py-10">
        <div className="container-site">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Properties
          </Link>

          <Reveal>
            <div className="mt-7">
              <span className="inline-flex rounded-full bg-[#FF6B00] px-3 py-1.5 text-xs font-bold text-white">
                {property.type}
              </span>

              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
                {property.title}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-slate-300">
                <MapPin
                  size={18}
                  className="text-[#FF6B00]"
                />
                {property.location}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-[#F4F6F9] py-8 sm:py-12">
        <div className="container-site">
          <Reveal>
            <div className="grid gap-3 overflow-hidden rounded-2xl sm:grid-cols-[1.5fr_0.75fr]">
              <div className="relative min-h-[330px] sm:min-h-[520px]">
                <Image
                  src={gallery[0]}
                  alt={property.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 65vw"
                  className="object-cover"
                />
              </div>

              <div className="hidden gap-3 sm:grid">
                <div className="relative">
                  <Image
                    src={gallery[1]}
                    alt={`${property.title} interior`}
                    fill
                    sizes="35vw"
                    className="object-cover"
                  />
                </div>

                <div className="relative">
                  <Image
                    src={gallery[2]}
                    alt={`${property.title} additional view`}
                    fill
                    sizes="35vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#0A2342]">
                      More Photos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DETAILS */}
      <section className="bg-[#F4F6F9] pb-24">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* Main content */}
            <div>
              <Reveal>
                <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-400">
                        Asking Price
                      </p>

                      <p className="mt-1 text-3xl font-extrabold text-[#0A2342]">
                        {property.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-[#0A2342] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                      aria-label="Share property"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-[#F4F6F9] p-4">
                      <Home
                        size={20}
                        className="text-[#FF6B00]"
                      />
                      <p className="mt-3 text-xs text-slate-400">
                        Type
                      </p>
                      <p className="mt-1 font-bold text-[#0A2342]">
                        {property.category}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F6F9] p-4">
                      <BedDouble
                        size={20}
                        className="text-[#FF6B00]"
                      />
                      <p className="mt-3 text-xs text-slate-400">
                        Bedrooms
                      </p>
                      <p className="mt-1 font-bold text-[#0A2342]">
                        4
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F6F9] p-4">
                      <Square
                        size={20}
                        className="text-[#FF6B00]"
                      />
                      <p className="mt-3 text-xs text-slate-400">
                        Bathrooms
                      </p>
                      <p className="mt-1 font-bold text-[#0A2342]">
                        4
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F6F9] p-4">
                      <Ruler
                        size={20}
                        className="text-[#FF6B00]"
                      />
                      <p className="mt-3 text-xs text-slate-400">
                        Size
                      </p>
                      <p className="mt-1 font-bold text-[#0A2342]">
                        450 sqm
                      </p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-2xl font-extrabold text-[#0A2342]">
                      Property Description
                    </h2>

                    <p className="mt-4 leading-8 text-slate-600">
                      This premium property presents an excellent
                      opportunity for individuals, families and
                      investors looking for quality real estate in
                      a strategic location.
                    </p>

                    <p className="mt-4 leading-8 text-slate-600">
                      The property combines practical design,
                      accessibility and long-term investment
                      potential. Our team is available to provide
                      further information, documentation and
                      inspection arrangements.
                    </p>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-2xl font-extrabold text-[#0A2342]">
                      Property Highlights
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 rounded-xl bg-[#F4F6F9] p-4"
                        >
                          <CheckCircle2
                            size={19}
                            className="shrink-0 text-[#FF6B00]"
                          />

                          <span className="text-sm font-semibold text-[#0A2342]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-2xl font-extrabold text-[#0A2342]">
                      Location
                    </h2>

                    <div className="mt-5 flex min-h-[220px] items-center justify-center rounded-2xl bg-[#0A2342] p-8 text-center">
                      <div>
                        <MapPin
                          size={40}
                          className="mx-auto text-[#FF6B00]"
                        />

                        <p className="mt-4 font-bold text-white">
                          {property.location}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Map integration will be connected here.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Enquiry card */}
            <aside>
              <Reveal delay={0.15}>
                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-[0_15px_50px_rgba(10,35,66,0.1)] sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B00] text-white">
                    <ShieldCheck size={25} />
                  </div>

                  <h2 className="mt-5 text-2xl font-extrabold text-[#0A2342]">
                    Interested in this property?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Contact our team to request more information
                    or schedule an inspection.
                  </p>

                  <form className="mt-6 space-y-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00]"
                    />

                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00]"
                    />

                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00]"
                    />

                    <textarea
                      rows={4}
                      defaultValue={`I am interested in ${property.title}.`}
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00]"
                    />

                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-4 font-bold text-white transition hover:bg-[#e85f00]"
                    >
                      Enquire Now
                      <ArrowRight size={18} />
                    </button>
                  </form>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                    <a
                      href="tel:08132566255"
                      className="flex items-center gap-3 text-sm font-semibold text-[#0A2342] hover:text-[#FF6B00]"
                    >
                      <Phone
                        size={17}
                        className="text-[#FF6B00]"
                      />
                      08132566255
                    </a>

                    <a
                      href="mailto:info@sayolakaybee.com"
                      className="flex items-center gap-3 text-sm font-semibold text-[#0A2342] hover:text-[#FF6B00]"
                    >
                      <Mail
                        size={17}
                        className="text-[#FF6B00]"
                      />
                      Send us an email
                    </a>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
