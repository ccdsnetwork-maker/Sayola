"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  PackageCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/Motion";

const services = [
  {
    title: "Haulage & Trucking",
    description:
      "Reliable transportation solutions for moving goods efficiently between locations while prioritizing safety, coordination and timely delivery.",
    icon: Truck,
    features: [
      "Goods transportation",
      "Interstate haulage",
      "Dedicated trucking solutions",
      "Delivery coordination",
    ],
  },
  {
    title: "Real Estate Development",
    description:
      "Property development solutions focused on creating functional spaces and long-term value for individuals, businesses and investors.",
    icon: Building2,
    features: [
      "Property development",
      "Land opportunities",
      "Residential projects",
      "Commercial projects",
    ],
  },
  {
    title: "Property Management",
    description:
      "Professional support for property owners who want their assets managed efficiently while maintaining tenant satisfaction and property value.",
    icon: Warehouse,
    features: [
      "Property supervision",
      "Tenant coordination",
      "Maintenance management",
      "Asset support",
    ],
  },
  {
    title: "General Logistics & Supply Chain",
    description:
      "Flexible logistics support designed to help businesses coordinate the movement, handling and delivery of goods.",
    icon: Globe2,
    features: [
      "Supply chain coordination",
      "Goods handling",
      "Distribution support",
      "Logistics planning",
    ],
  },
];

const process = [
  {
    number: "01",
    title: "Tell Us What You Need",
    description:
      "Share your property, transportation or logistics requirement with our team.",
    icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "We Plan the Solution",
    description:
      "We assess your needs and develop a practical approach around your objectives.",
    icon: PackageCheck,
  },
  {
    number: "03",
    title: "We Execute",
    description:
      "Our team coordinates the service and keeps you informed throughout the process.",
    icon: Truck,
  },
];

export default function ServicesPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2342] py-24 sm:py-28">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#FF6B00]/15 blur-3xl" />

        <div className="container-site relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Our Services
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Solutions that move
              <span className="text-[#FF6B00]"> business forward.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              From real estate opportunities to transportation and
              supply chain support, SAYOLA KAYBEE GLOBAL LIMITED
              provides practical solutions built around your goals.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal
                  key={service.title}
                  delay={index * 0.08}
                >
                  <motion.article
                    whileHover={{ y: -7 }}
                    transition={{ duration: 0.25 }}
                    className="group h-full rounded-2xl bg-white p-7 shadow-sm sm:p-9"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A2342] text-white transition-colors duration-300 group-hover:bg-[#FF6B00]">
                        <Icon size={28} />
                      </div>

                      <span className="text-sm font-extrabold text-slate-200">
                        0{index + 1}
                      </span>
                    </div>

                    <h2 className="mt-7 text-2xl font-extrabold text-[#0A2342]">
                      {service.title}
                    </h2>

                    <p className="mt-4 leading-7 text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm font-semibold text-[#0A2342]"
                        >
                          <CheckCircle2
                            size={17}
                            className="shrink-0 text-[#FF6B00]"
                          />

                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/contact"
                      className="mt-8 inline-flex items-center gap-2 font-bold text-[#FF6B00] transition hover:gap-3"
                    >
                      Discuss this service
                      <ArrowRight size={17} />
                    </Link>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                How We Work
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                Simple, professional and focused.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                We keep our process straightforward so you can
                focus on your business while we handle the details.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {process.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal
                  key={step.number}
                  delay={index * 0.1}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-2xl border border-slate-100 bg-[#F4F6F9] p-7"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B00] text-white">
                        <Icon size={23} />
                      </div>

                      <span className="text-3xl font-extrabold text-[#0A2342]/10">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-extrabold text-[#0A2342]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {step.description}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[#0A2342] py-20 sm:py-24">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Why Choose Us
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  One partner. Multiple solutions.
                </h2>

                <p className="mt-5 leading-8 text-slate-300">
                  Our real estate and logistics capabilities allow
                  us to support clients across multiple stages of
                  their personal and business journey.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Professional service",
                "Transparent communication",
                "Flexible solutions",
                "Client-focused approach",
              ].map((item, index) => (
                <Reveal
                  key={item}
                  delay={index * 0.08}
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-[#FF6B00]"
                    />

                    <span className="text-sm font-semibold text-white">
                      {item}
                    </span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="rounded-[2rem] bg-[#F4F6F9] p-8 text-center sm:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Ready to get started?
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                Let's find the right solution for your needs.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Speak with our team about your property, haulage,
                logistics or property management requirements.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-7 py-4 font-bold text-white transition hover:bg-[#e85f00]"
              >
                Contact Our Team
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
