"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { Reveal } from "@/components/Motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const phoneNumbers = [
  "08132566255",
  "07013036207",
  "08053343483",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !email || !service || !message) {
      alert("Please complete all required fields.");
      return;
    }

    setSending(true);

    const timeout = setTimeout(() => {
      setSending(false);
      alert(
        "The request is taking too long. Please check your internet connection and try again."
      );
    }, 15000);

    try {
      console.log("CONTACT: starting Firestore write...");

      const docRef = await addDoc(collection(db, "messages"), {
        name,
        phone,
        email,
        service,
        subject: service,
        message,
        status: "Pending",
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      clearTimeout(timeout);

      console.log("CONTACT: Firestore write successful:", docRef.id);

      form.reset();
      setSubmitted(true);
    } catch (error) {
      clearTimeout(timeout);

      console.error("CONTACT: Firestore write failed:", error);

      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      alert(
        `Message could not be sent.\n\nCode: ${
          firebaseError.code || "unknown"
        }\n\n${
          firebaseError.message || "Unknown Firebase error"
        }`
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2342] py-24 sm:py-28">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/15 blur-3xl" />

        <div className="container-site relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Contact Us
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Let's talk about your
              <span className="text-[#FF6B00]"> next opportunity.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Whether you need a property, logistics support or
              professional assistance, our team is ready to hear
              from you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            {/* CONTACT DETAILS */}
            <div className="space-y-5">
              <Reveal>
                <div className="rounded-2xl bg-[#0A2342] p-7 sm:p-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                    Get in touch
                  </p>

                  <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
                    We're here to help.
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Contact SAYOLA KAYBEE GLOBAL LIMITED and tell us
                    what you need. Our team will get back to you.
                  </p>
                </div>
              </Reveal>

              {/* PHONE */}
              <Reveal delay={0.08}>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B00]/10">
                    <Phone
                      size={22}
                      className="text-[#FF6B00]"
                    />
                  </div>

                  <h3 className="mt-5 font-extrabold text-[#0A2342]">
                    Phone
                  </h3>

                  <div className="mt-3 space-y-2">
                    {phoneNumbers.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="block text-sm font-semibold text-slate-600 transition hover:text-[#FF6B00]"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* WHATSAPP */}
              <Reveal delay={0.12}>
                <motion.a
                  whileHover={{ y: -4 }}
                  href="https://wa.me/2348132566255"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-[#FF6B00] p-6 text-white shadow-sm"
                >
                  <MessageCircle size={25} />

                  <h3 className="mt-4 text-xl font-extrabold">
                    Chat on WhatsApp
                  </h3>

                  <p className="mt-2 text-sm text-white/80">
                    Message us directly on WhatsApp.
                  </p>

                  <span className="mt-4 inline-block text-sm font-bold">
                    +234 813 256 6255 →
                  </span>
                </motion.a>
              </Reveal>

              {/* SOCIAL */}
              <Reveal delay={0.16}>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="font-extrabold text-[#0A2342]">
                    Follow Us
                  </h3>

                  <div className="mt-5 flex gap-3">
                    <a
                      href="#"
                      aria-label="SAYOLA KAYBEE Global Limited Facebook"
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A2342] text-white transition hover:bg-[#FF6B00]"
                    >
                      <span className="text-lg font-extrabold">f</span>
                    </a>

                    <a
                      href="#"
                      aria-label="SAYOLA KAYBEE Global Limited Instagram"
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A2342] text-white transition hover:bg-[#FF6B00]"
                    >
                      <span className="text-lg font-extrabold">@</span>
                    </a>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    Facebook: SAYOLA KAYBEE Global Limited
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Instagram: @sayolakaybeegloballtd
                  </p>
                </div>
              </Reveal>
            </div>

            {/* FORM */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                    Send a Message
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold text-[#0A2342]">
                    Tell us what you need.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    Fill out the form and our team will get back to
                    you.
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-2xl bg-[#F4F6F9] p-8 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B00]/10">
                      <CheckCircle2
                        size={30}
                        className="text-[#FF6B00]"
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-[#0A2342]">
                      Message received
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Thank you for contacting SAYOLA KAYBEE GLOBAL
                      LIMITED. Your enquiry has been received.
                    </p>


                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                      }}
                      className="mt-6 font-bold text-[#FF6B00]"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-bold text-[#0A2342]"
                        >
                          Full Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          required
                          type="text"
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-bold text-[#0A2342]"
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          required
                          type="tel"
                          placeholder="080..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold text-[#0A2342]"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="mb-2 block text-sm font-bold text-[#0A2342]"
                      >
                        What can we help you with?
                      </label>

                      <select
                        id="service"
                        name="service"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                      >
                        <option value="">
                          Select a service
                        </option>
                        <option value="property">
                          Property / Real Estate
                        </option>
                        <option value="haulage">
                          Haulage & Trucking
                        </option>
                        <option value="property-management">
                          Property Management
                        </option>
                        <option value="logistics">
                          General Logistics
                        </option>
                        <option value="other">
                          Other Enquiry
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-bold text-[#0A2342]"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Tell us how we can help..."
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? "Sending..." : "Send Message"}
                      {!sending && <Send size={18} />}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Find Us
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-[#0A2342]">
                Our Location
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#0A2342]">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B00] text-white">
                  <MapPin size={30} />
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-white">
                  SAYOLA KAYBEE GLOBAL LIMITED
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Location map will be connected here.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Google Maps integration will be added once the
                  official business address is provided.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
