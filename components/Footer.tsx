import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Properties", "/properties"],
  ["Logistics", "/logistics"],
  ["Our Team", "/team"],
  ["Contact", "/contact"],
];

const services = [
  "Real Estate Development",
  "Property Management",
  "Haulage & Trucking",
  "General Logistics",
  "Supply Chain Solutions",
];

export default function Footer() {
  return (
    <footer className="bg-[#0A2342] text-white">
      <div className="container-site py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image
                  src="/images/sayola.png"
                  alt="SAYOLA KAYBEE GLOBAL LIMITED"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>

              <div>
                <p className="font-bold leading-tight">
                  SAYOLA KAYBEE
                </p>

                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#FF6B00]">
                  GLOBAL LIMITED
                </p>
              </div>
            </Link>

            <p className="mt-5 font-semibold text-[#FF6B00]">
              ...Creating Wealth
            </p>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              Building wealth through strategic real estate
              solutions and dependable logistics services.
            </p>

            <p className="mt-5 text-sm font-semibold text-slate-200">
              RC: 9385622
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold">
              Quick Links
            </h3>

            <div className="mt-5 space-y-3">
              {quickLinks.map(([name, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-slate-300 transition-colors hover:text-[#FF6B00]"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold">
              Our Services
            </h3>

            <div className="mt-5 space-y-3">
              {services.map((service) => (
                <p
                  key={service}
                  className="text-sm text-slate-300"
                >
                  {service}
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold">
              Contact Us
            </h3>

            <div className="mt-5 space-y-5">

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <div className="space-y-1 text-sm text-slate-300">
                  <a
                    href="tel:08132566255"
                    className="block transition hover:text-[#FF6B00]"
                  >
                    08132566255
                  </a>

                  <a
                    href="tel:07013036207"
                    className="block transition hover:text-[#FF6B00]"
                  >
                    07013036207
                  </a>

                  <a
                    href="tel:08053343483"
                    className="block transition hover:text-[#FF6B00]"
                  >
                    08053343483
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Location
                </p>

                <p className="text-sm text-slate-300">
                  Nigeria
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Connect With Us
                </p>

                <div className="flex items-center gap-3">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook - SAYOLA KAYBEE Global Limited"
                    title="Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00] hover:bg-[#FF6B00]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.67.33-1 1-1z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sayolakaybeegloballtd"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram - @sayolakaybeegloballtd"
                    title="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00] hover:bg-[#FF6B00]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-none stroke-current"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        className="fill-current stroke-none"
                      />
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/2348132566255"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with SAYOLA KAYBEE Global Limited on WhatsApp"
                    title="WhatsApp"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FF6B00]/50 text-[#FF6B00] transition-all duration-300 hover:-translate-y-1 hover:bg-[#FF6B00] hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12 2a9.9 9.9 0 0 0-8.54 15.02L2 22l5.15-1.35A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-3.05.8.81-2.97-.19-.3A8 8 0 1 1 12 20Zm4.39-5.99c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 SAYOLA KAYBEE GLOBAL LIMITED.
            All Rights Reserved.
          </p>

          <Link
            href="/contact"
            className="font-semibold text-[#FF6B00] transition hover:text-white"
          >
            Start a conversation →
          </Link>

        </div>
      </div>
    </footer>
  );
}
