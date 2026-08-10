"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Users,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { Reveal } from "@/components/Motion";
import { db } from "@/lib/firebase";

type TeamMember = {
  id: string;
  name?: string;
  position?: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  image?: string;
  imagePublicId?: string;
  order?: number;
  active?: boolean;
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membersQuery = query(
      collection(db, "team"),
      where("active", "==", true),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        const members = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as TeamMember[];

        setTeamMembers(members);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load public team:", error);
        setTeamMembers([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A2342] py-24 sm:py-28">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#FF6B00]/15 blur-3xl" />

        <div className="container-site relative">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Leadership
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Meet Our Board of
              <span className="text-[#FF6B00]"> Directors.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Experienced leadership focused on building a trusted,
              professional and growth-oriented company.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                Our Leadership
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
                People behind the vision
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Our leadership team works together to create value,
                maintain professional standards and deliver on our
                company's vision.
              </p>
            </div>
          </Reveal>

          {loading ? (
            <div className="mt-12 flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading our team...
                </p>
              </div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="mt-12 flex min-h-[260px] items-center justify-center rounded-2xl bg-white px-6 text-center shadow-sm">
              <div>
                <Users
                  size={42}
                  className="mx-auto text-[#FF6B00]"
                />

                <h3 className="mt-4 text-xl font-extrabold text-[#0A2342]">
                  Our leadership team
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Team information will be available here soon.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <Reveal
                  key={member.id}
                  delay={index * 0.08}
                >
                  <motion.article
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm"
                  >
                    {/* IMAGE */}
                    <div className="relative aspect-square overflow-hidden bg-[#0A2342]">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name || "Team member"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Users
                            size={56}
                            className="text-white/40"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/80 via-transparent to-transparent opacity-70" />

                      {/* SOCIAL HOVER */}
                      {(member.linkedin || member.email) && (
                        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name || "Team member"} LinkedIn`}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A2342] transition hover:bg-[#FF6B00] hover:text-white"
                            >
                              <span className="text-sm font-extrabold">
                                in
                              </span>
                            </a>
                          )}

                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              aria-label={`Email ${member.name || "team member"}`}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A2342] transition hover:bg-[#FF6B00] hover:text-white"
                            >
                              <Mail size={17} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold text-[#0A2342]">
                        {member.name || "Team Member"}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-[#FF6B00]">
                        {member.position || "Team Member"}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-slate-500">
                        {member.bio || "Professional team member at SAYOLA KAYBEE GLOBAL LIMITED."}
                      </p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LEADERSHIP PHILOSOPHY */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full min-h-[350px] items-center justify-center rounded-[2rem] bg-[#0A2342] p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B00] text-white">
                    <Users size={36} />
                  </div>

                  <p className="mt-7 text-3xl font-extrabold text-white">
                    One Vision.
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#FF6B00]">
                    One Direction.
                  </p>

                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    Building a company that creates meaningful
                    opportunities for clients, partners and
                    communities.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Our Leadership Philosophy
                </p>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0A2342] sm:text-4xl">
                  Leadership that puts people and value first.
                </h2>

                <p className="mt-6 leading-8 text-slate-600">
                  We believe sustainable growth comes from combining
                  clear strategy with responsible execution.
                </p>

                <p className="mt-5 leading-8 text-slate-600">
                  Our leadership team is committed to maintaining
                  strong relationships, professional standards and
                  a culture of continuous improvement.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Strategic thinking",
                    "Professional accountability",
                    "Long-term relationships",
                    "Sustainable growth",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B00]/10 text-xs font-extrabold text-[#FF6B00]">
                        ✓
                      </span>

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

      {/* CTA */}
      <section className="bg-[#F4F6F9] py-20 sm:py-24">
        <div className="container-site">
          <Reveal>
            <div className="rounded-[2rem] bg-[#0A2342] p-8 text-center sm:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                SAYOLA KAYBEE GLOBAL LIMITED
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">
                Let's create wealth together.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
                Have a property, logistics or business requirement?
                Our team is ready to hear from you.
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
