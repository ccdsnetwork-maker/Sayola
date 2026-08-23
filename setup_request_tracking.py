from pathlib import Path
import re

ROOT = Path.cwd()

# ============================================================
# 1. REQUEST ID GENERATOR
# ============================================================

request_id_file = ROOT / "lib" / "requestId.ts"
request_id_file.parent.mkdir(parents=True, exist_ok=True)

request_id_file.write_text(
'''import { randomBytes } from "crypto";

export function generateRequestId() {
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `SKG-${new Date().getFullYear()}-${random}`;
}
''',
encoding="utf-8"
)

print("Created lib/requestId.ts")


# ============================================================
# 2. TRACK REQUEST API
# ============================================================

api_file = ROOT / "app" / "api" / "track-request" / "route.ts"
api_file.parent.mkdir(parents=True, exist_ok=True)

api_file.write_text(
'''import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id")?.trim();

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required." },
        { status: 400 }
      );
    }

    const messagesQuery = query(
      collection(db, "messages"),
      where("requestId", "==", requestId),
      limit(1)
    );

    const snapshot = await getDocs(messagesQuery);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Request not found. Please check your Request ID." },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return NextResponse.json({
      success: true,
      request: {
        requestId: data.requestId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        service: data.service,
        status: data.status || "Pending",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Track request error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve request." },
      { status: 500 }
    );
  }
}
''',
encoding="utf-8"
)

print("Created app/api/track-request/route.ts")


# ============================================================
# 3. TRACK REQUEST PAGE
# ============================================================

track_page = ROOT / "app" / "(site)" / "track-request" / "page.tsx"
track_page.parent.mkdir(parents=True, exist_ok=True)

track_page.write_text(
'''"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  User,
} from "lucide-react";

type RequestData = {
  requestId: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function TrackRequestPage() {
  const [requestId, setRequestId] = useState("");
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = requestId.trim();

    if (!id) {
      setError("Please enter your Request ID.");
      return;
    }

    setLoading(true);
    setError("");
    setRequest(null);

    try {
      const response = await fetch(
        `/api/track-request?id=${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request not found.");
      }

      setRequest(data.request);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find your request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="bg-[#0A2342] py-20 sm:py-24">
        <div className="container-site">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
            Request Tracking
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Track your request.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Enter the Request ID you received after submitting your enquiry
            to check its current status.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="requestId"
                className="mb-2 block text-sm font-bold text-[#0A2342]"
              >
                Request ID
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="requestId"
                  value={requestId}
                  onChange={(event) =>
                    setRequestId(event.target.value.toUpperCase())
                  }
                  placeholder="SKG-2026-A1B2C3D4"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-4 text-sm font-semibold uppercase outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={18} />
                  {loading ? "Checking..." : "Track Request"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {request && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100">

                <div className="bg-[#0A2342] p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
                    Request Found
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    {request.requestId}
                  </h2>
                </div>

                <div className="p-6 sm:p-8">

                  <div className="grid gap-5 sm:grid-cols-2">

                    <InfoItem
                      label="Name"
                      value={request.name}
                      icon={<User size={18} />}
                    />

                    <InfoItem
                      label="Service"
                      value={request.service}
                      icon={<Search size={18} />}
                    />

                    <InfoItem
                      label="Phone"
                      value={request.phone}
                      icon={<User size={18} />}
                    />

                    <InfoItem
                      label="Email"
                      value={request.email}
                      icon={<User size={18} />}
                    />

                  </div>

                  <div className="mt-8 rounded-xl bg-[#F4F6F9] p-5">
                    <div className="flex items-center gap-3">

                      {request.status === "Completed" ? (
                        <CheckCircle2
                          size={22}
                          className="text-green-600"
                        />
                      ) : (
                        <Clock3
                          size={22}
                          className="text-[#FF6B00]"
                        />
                      )}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Current Status
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-[#0A2342]">
                          {request.status}
                        </p>
                      </div>

                    </div>
                  </div>

                  {request.createdAt && (
                    <p className="mt-5 text-xs text-slate-500">
                      Submitted:{" "}
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  )}

                  {request.updatedAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Last updated:{" "}
                      {new Date(request.updatedAt).toLocaleString()}
                    </p>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">

      <div className="flex items-center gap-2 text-[#FF6B00]">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-bold text-[#0A2342]">
        {value}
      </p>

    </div>
  );
}
''',
encoding="utf-8"
)

print("Created app/(site)/track-request/page.tsx")


# ============================================================
# 4. PATCH CONTACT FORM
# ============================================================

contact = ROOT / "app" / "(site)" / "contact" / "page.tsx"

if contact.exists():
    text = contact.read_text(encoding="utf-8")

    # Add import
    if 'import { generateRequestId } from "@/lib/requestId";' not in text:
        marker = 'import { db } from "@/lib/firebase";'
        if marker in text:
            text = text.replace(
                marker,
                marker + '\nimport { generateRequestId } from "@/lib/requestId";'
            )

    # Add state
    if 'const [requestId, setRequestId]' not in text:
        marker = 'const [sending, setSending] = useState(false);'
        text = text.replace(
            marker,
            marker + '\n  const [requestId, setRequestId] = useState("");'
        )

    # Add generator immediately before addDoc
    old = '''const docRef = await addDoc(collection(db, "messages"), {
        name,
        phone,
        email,
        service,
        subject: service,
        message,
        read: false,
        createdAt: serverTimestamp(),
      });'''

    new = '''const generatedRequestId = generateRequestId();

      const docRef = await addDoc(collection(db, "messages"), {
        requestId: generatedRequestId,
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
      });'''

    if old in text:
        text = text.replace(old, new)
    else:
        # More flexible replacement if formatting differs
        pattern = re.compile(
            r'const docRef = await addDoc\(collection\(db, "messages"\), \{.*?\n\s*\}\);',
            re.DOTALL
        )

        replacement = '''const generatedRequestId = generateRequestId();

      const docRef = await addDoc(collection(db, "messages"), {
        requestId: generatedRequestId,
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
      });'''

        text, count = pattern.subn(replacement, text, count=1)

        if count == 0:
            print("WARNING: Could not automatically replace Firestore write.")
            print("Please inspect contact/page.tsx manually.")

    # Save generated ID after successful write
    if 'setRequestId(generatedRequestId);' not in text:
        marker = 'console.log("CONTACT: Firestore write successful:", docRef.id);'
        if marker in text:
            text = text.replace(
                marker,
                marker + '\n      setRequestId(generatedRequestId);'
            )

    # Replace success heading/details
    text = text.replace(
        "Message received",
        "Request Submitted"
    )

    text = text.replace(
        "Thank you for contacting SAYOLA KAYBEE GLOBAL LIMITED. Your enquiry is ready to be processed.",
        "Thank you for contacting SAYOLA KAYBEE GLOBAL LIMITED. Your request has been received."
    )

    # Insert request ID box before Send another message
    if "Your Request ID" not in text:
        marker = '''<button
                      type="button"
                      onClick={() => setSubmitted(false)}'''

        replacement = '''<div className="mt-6 rounded-xl border border-[#FF6B00]/20 bg-white p-5 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Your Request ID
                      </p>

                      <p className="mt-2 text-2xl font-extrabold tracking-wider text-[#0A2342]">
                        {requestId}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        Please save this ID. You will need it to track your request.
                      </p>
                    </div>

                    <a
                      href={`/track-request?id=${encodeURIComponent(requestId)}`}
                      className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#FF6B00] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#e85f00]"
                    >
                      Track My Request
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setRequestId("");
                      }}'''

        if marker in text:
            text = text.replace(marker, replacement, 1)
        else:
            print("WARNING: Could not insert Request ID display.")

    contact.write_text(text, encoding="utf-8")
    print("Patched contact form.")
else:
    print("WARNING: Contact form not found.")


# ============================================================
# 5. PATCH NAVBAR
# ============================================================

navbar = ROOT / "components" / "Navbar.tsx"

if navbar.exists():
    text = navbar.read_text(encoding="utf-8")

    if '{ name: "Track Request", href: "/track-request" }' not in text:
        marker = '{ name: "Contact", href: "/contact" },'

        if marker in text:
            text = text.replace(
                marker,
                '{ name: "Track Request", href: "/track-request" },\n  ' + marker
            )
            navbar.write_text(text, encoding="utf-8")
            print("Patched components/Navbar.tsx")
        else:
            print("WARNING: Navbar Contact link not found.")
    else:
        print("Navbar already contains Track Request.")
else:
    print("WARNING: Navbar.tsx not found.")


# ============================================================
# FINISHED
# ============================================================

print()
print("==============================================")
print(" REQUEST TRACKING SETUP COMPLETE")
print("==============================================")
print()
print("Created:")
print("  lib/requestId.ts")
print("  app/api/track-request/route.ts")
print("  app/(site)/track-request/page.tsx")
print()
print("Updated:")
print("  app/(site)/contact/page.tsx")
print("  components/Navbar.tsx")
print()
print("Next:")
print("  npm run build")
print()
