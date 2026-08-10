"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reveal } from "@/components/Motion";

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
  gallery?: string[];
  featured?: boolean;
  available?: boolean;
};

const features = [
  "Verified property opportunity",
  "Strategic location",
  "Professional documentation support",
  "Expert property guidance",
];

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEnquiry, setSendingEnquiry] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        const snapshot = await getDoc(doc(db, "properties", id));

        if (!snapshot.exists()) {
          setProperty(null);
          return;
        }

        setProperty({
          id: snapshot.id,
          ...(snapshot.data() as Omit<Property, "id">),
        });
      } catch (error) {
        console.error("Failed to load property:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  async function handleEnquirySubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !email || !message) {
      alert("Please complete all fields before submitting your enquiry.");
      return;
    }

    setSendingEnquiry(true);

    try {
      const propertyId = property?.id || "";
      const propertyTitle = property?.title || "Property";
      const propertyLocation = property?.location || "Location unavailable";
      const propertyPrice = property?.price || "Price on request";

      await addDoc(collection(db, "messages"), {
        name,
        phone,
        email,
        service: "Property Enquiry",
        subject: `Property Enquiry: ${propertyTitle}`,
        message: `Property ID: ${propertyId}

Property: ${propertyTitle}
Location: ${propertyLocation}
Price: ${propertyPrice}

Customer message:
${message}`,
        propertyId,
        propertyTitle,
        propertyLocation,
        propertyPrice,
        read: false,
        createdAt: serverTimestamp(),
      });

      form.reset();
      setEnquirySent(true);
    } catch (error) {
      console.error("PROPERTY ENQUIRY: Firestore write failed:", error);

      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      alert(
        `Your enquiry could not be sent.\n\n${
          firebaseError.message || "Please try again."
        }`
      );
    } finally {
      setSendingEnquiry(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F4F6F9]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading property...
          </p>
        </div>
      </main>
    );
  }

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

            <button
              type="button"
              onClick={() => router.push("/properties")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0A2342] px-6 py-4 font-bold text-white transition hover:bg-[#FF6B00]"
            >
              <ArrowLeft size={18} />
              Back to Properties
            </button>
          </div>
        </div>
      </main>
    );
  }

  const gallery =
    property.gallery && property.gallery.length > 0
      ? property.gallery
      : property.image
        ? [property.image]
        : [];



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
                  src={gallery[0] || "/images/sayola.png"}
                  alt={property.title || "Property"}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 65vw"
                  className="object-cover"
                />
              </div>

              <div className="hidden gap-3 sm:grid">
                <div className="relative">
                  <Image
                    src={gallery[1] || gallery[0] || "/images/sayola.png"}
                    alt={`${property.title} interior`}
                    fill
                    sizes="35vw"
                    className="object-cover"
                  />
                </div>

                <div className="relative">
                  <Image
                    src={gallery[2] || gallery[0] || "/images/sayola.png"}
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
                        {property.bedrooms ?? 0}
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
                        {property.bathrooms ?? 0}
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
                        {property.size || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-2xl font-extrabold text-[#0A2342]">
                      Property Description
                    </h2>

                    <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                      {property.description || "Property description available on request."}
                    </p>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-2xl font-extrabold text-[#0A2342]">
                      Property Highlights
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {(property.features && property.features.length > 0 ? property.features : features).map((feature) => (
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

                  {enquirySent ? (
                    <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2
                          size={30}
                          className="text-green-600"
                        />
                      </div>

                      <h3 className="mt-4 text-xl font-extrabold text-[#0A2342]">
                        Message sent successfully
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Thank you for your interest in this property.
                        Our team has received your enquiry and will
                        contact you shortly.
                      </p>

                      <div className="mt-4 rounded-xl bg-white px-4 py-3 text-left">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Property ID
                        </p>
                        <p className="mt-1 break-all font-mono text-sm font-bold text-[#0A2342]">
                          {property.id}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEnquirySent(false)}
                        className="mt-5 inline-flex items-center justify-center rounded-xl border border-[#0A2342] px-5 py-3 text-sm font-bold text-[#0A2342] transition hover:bg-[#0A2342] hover:text-white"
                      >
                        Send another enquiry
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleEnquirySubmit}
                      className="mt-6 space-y-4"
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        disabled={sendingEnquiry}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        required
                        disabled={sendingEnquiry}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        required
                        disabled={sendingEnquiry}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <textarea
                        name="message"
                        rows={4}
                        defaultValue={`I am interested in ${property.title || "this property"}.`}
                        required
                        disabled={sendingEnquiry}
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#FF6B00] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="submit"
                        disabled={sendingEnquiry}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-4 font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {sendingEnquiry ? "Sending..." : "Enquire Now"}
                        {sendingEnquiry ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                          <ArrowRight size={18} />
                        )}
                      </button>
                    </form>
                  )}

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
