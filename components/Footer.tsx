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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B00] text-lg font-extrabold">
                SK
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

                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                  >
                    Facebook
                  </a>

                  <a
                    href="https://www.instagram.com/sayolakaybeegloballtd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                  >
                    Instagram
                  </a>

                  <a
                    href="https://wa.me/2348132566255"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[#FF6B00]/50 px-3 py-2 text-xs font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white"
                  >
                    WhatsApp
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
