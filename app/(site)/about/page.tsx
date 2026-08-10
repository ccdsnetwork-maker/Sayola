"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/Motion";

const stats = [
  {
    value: "10+",
    label: "Years of Experience",
    icon: TrendingUp,
  },
  {
    value: "100+",
    label: "Property & Business Solutions",
    icon: Building2,
  },
  {
    value: "50+",
    label: "Clients & Partners",
    icon: Users,
  },
  {
    value: "24/7",
    label: "Client Support",
    icon: CheckCircle2,
  },
];

const values = [
  {
    title: "Integrity",
    description:
      "We conduct our business with honesty, transparency and accountability.",
  },
  {
    title: "Excellence",
    description:
      "We pursue high standards across our real estate and logistics services.",
  },
  {
    title: "Innovation",
    description:
      "We embrace practical ideas and modern solutions that create lasting value.",
  },
  {
    title: "Customer Focus",
    description:
      "We listen carefully to our clients and build solutions around their needs.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2342] py-24 sm:py-28">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#FF6B00]/15 blur-3xl" />
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

        <div className="container-site relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              About Sayola Kaybee
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Creating wealth through
              <span className="text-[#FF6B00]">
                {" "}
                property and logistics.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              SAYOLA KAYBEE GLOBAL LIMITED is a Nigerian company
              focused on real estate and logistics solutions that
              help individuals, businesses and investors move
              forward with confidence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#0A2342] p-8 sm:p-12">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#FF6B00]/20 blur-2xl" />

                <div className="relative">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                    Our Story
                  </p>

                  <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                    Building opportunities that stand the test of time.
                  </h2>

                  <div className="mt-6 space-y-5 text-sm leading-7 text-slate-300 sm:text-base">
                    <p>
                      SAYOLA KAYBEE GLOBAL LIMITED was established
                      with a clear ambition: to provide reliable
                      services that connect people with valuable
                      property opportunities while supporting the
                      movement of goods and business operations.
                    </p>

                    <p>
                      Our approach combines professional service,
                      local market understanding and a commitment
                      to building relationships that create
                      sustainable value.
                    </p>

                    <p>
                      From property acquisition and development to
                      logistics and supply chain support, we aim to
                      become a trusted partner for every client we
                      serve.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Who We Are
                </p>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0A2342] sm:text-4xl">
                  A company built around value, trust and growth.
                </h2>

                <p className="mt-6 leading-8 text-slate-600">
                  We understand that property and logistics are
                  more than transactions. They are part of people's
                  plans, businesses and long-term ambitions.
                </p>

                <p className="mt-5 leading-8 text-slate-600">
                  That is why we focus on dependable execution,
                  clear communication and solutions that make a
                  measurable difference.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Professional and transparent service",
                    "Client-focused property solutions",
                    "Reliable logistics support",
                    "Long-term value creation",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-[#FF6B00]"
                      />

                      <span className="font-semibold text-[#0A2342]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-2xl bg-white p-8 shadow-sm sm:p-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A2342] text-white">
                  <Target size={27} />
                </div>

                <h2 className="mt-7 text-2xl font-extrabold text-[#0A2342] sm:text-3xl">
                  Our Mission
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  To deliver trusted real estate and logistics
                  solutions that create meaningful value for our
                  clients, partners and communities through
                  professionalism, innovation and dependable
                  execution.
                </p>
              </motion.div>
            </Reveal>

            <Reveal delay={0.15}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-2xl bg-[#0A2342] p-8 shadow-sm sm:p-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B00] text-white">
                  <Eye size={27} />
                </div>

                <h2 className="mt-7 text-2xl font-extrabold text-white sm:text-3xl">
                  Our Vision
                </h2>

                <p className="mt-5 leading-8 text-slate-300">
                  To build a respected and innovative company
                  recognized for transforming property and
                  logistics opportunities into sustainable wealth
                  and long-term growth.
                </p>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Our Impact
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                Growing with purpose
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Our focus remains on creating meaningful
                relationships and delivering solutions that help
                our clients achieve their goals.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <Reveal
                  key={stat.label}
                  delay={index * 0.1}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="rounded-2xl border border-slate-100 bg-[#F4F6F9] p-6 text-center sm:p-8"
                  >
                    <Icon
                      size={25}
                      className="mx-auto text-[#FF6B00]"
                    />

                    <p className="mt-4 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-slate-500 sm:text-sm">
                      {stat.label}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                What Guides Us
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                Our Core Values
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal
                key={value.title}
                delay={index * 0.08}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  className="h-full rounded-2xl bg-white p-7 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00]/10">
                    <span className="text-sm font-extrabold text-[#FF6B00]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#0A2342]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2342] py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                ...Creating Wealth
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">
                Let's build your next opportunity together.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
                Whether you're looking for property or reliable
                logistics support, our team is ready to help.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-7 py-4 font-bold text-white transition hover:bg-[#e85f00]"
              >
                Get in Touch
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
