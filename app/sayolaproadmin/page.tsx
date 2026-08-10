"use client";

import {
  Building2,
  FileText,
  MessageSquare,
  Users,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SayolaProAdminPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <div className="container-site py-10">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            SAYOLA KAYBEE
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Manage website properties, team members, Real Estate Gist
            articles and messages received from visitors.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <DashboardCard
            icon={<MessageSquare size={24} />}
            title="Messages"
            description="View messages and enquiries sent through the website."
            action="View Messages"
            onClick={() => router.push("/sayolaproadmin/messages")}
          />

          <DashboardCard
            icon={<Building2 size={24} />}
            title="Properties"
            description="Add, edit, update and delete property listings."
            action="Manage Properties"
            onClick={() => router.push("/sayolaproadmin/properties")}
          />

          <DashboardCard
            icon={<Users size={24} />}
            title="Team"
            description="Manage team members displayed on the website."
            action="Manage Team"
            onClick={() => router.push("/sayolaproadmin/team")}
          />

          <DashboardCard
            icon={<FileText size={24} />}
            title="Real Estate Gist"
            description="Create, edit and publish real estate articles."
            action="Manage Gist"
            onClick={() => router.push("/sayolaproadmin/gists")}
          />

        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-[#0A2342]">
            Quick Actions
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Quickly create new website content.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                router.push("/sayolaproadmin/properties/new")
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e85f00]"
            >
              <Plus size={17} />
              Add Property
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/sayolaproadmin/team/new")
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A2342] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF6B00]"
            >
              <Plus size={17} />
              Add Team Member
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/sayolaproadmin/gists/new")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-[#0A2342] px-5 py-3 text-sm font-bold text-[#0A2342] transition hover:bg-[#0A2342] hover:text-white"
            >
              <Plus size={17} />
              Add Gist
            </button>

          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-[#0A2342] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Admin Mode
          </p>

          <h2 className="mt-3 text-2xl font-extrabold">
            Direct Access Enabled
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Authentication is temporarily disabled while the Firebase
            database and administration system are being built.
          </p>
        </section>

      </div>
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A2342] text-white">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#0A2342]">
        {title}
      </h2>

      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 text-sm font-bold text-[#FF6B00] hover:underline"
      >
        {action} →
      </button>

    </div>
  );
}
