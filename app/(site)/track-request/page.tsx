"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
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

  pickup?: string;
  pickupLocation?: string;
  destination?: string;

  goods?: string;
  vehicleType?: string;
  logisticsType?: string;

  hireDate?: string;
  hireTime?: string;
  duration?: string;
  hireDays?: number;

  passengers?: string;

  carId?: string;
  carName?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;

  pricePerDay?: number;
  hireTotal?: number;

  message?: string;
};

export default function TrackRequestPage() {
  const router = useRouter();

  const [requestId, setRequestId] = useState("");
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = requestId.trim().replace(/\s+/g, "");

    if (!id) {
      setError("Please enter your Request ID.");
      return;
    }

    setError("");
    router.push(`/track/${encodeURIComponent(id)}`);
  }

  const isHireCar =
    request?.service === "hire-car" ||
    Boolean(request?.carId);

  return (
    <main>
      {/* HERO */}
      <section className="bg-[#0A2342] py-20 sm:py-24">
        <div className="container-site">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
            Request Tracking
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Track your request.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Enter the Request ID you received after submitting your
            enquiry to check your request information and current status.
          </p>
        </div>
      </section>

      {/* TRACKING SEARCH */}
      <section className="bg-[#F4F6F9] py-16 sm:py-20">
        <div className="container-site max-w-4xl">

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
                    setRequestId(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="Example: A7K9P2X4M8"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-4 text-sm font-semibold uppercase outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={18} />

                  {loading
                    ? "Checking..."
                    : "Track Request"}
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

                {/* WELCOME */}
                <div className="bg-[#0A2342] p-6 text-white sm:p-8">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    Hello, {request.name}.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    Welcome to your request dashboard. Below you can
                    view the information you submitted and monitor the
                    progress of your request.
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Your Request ID
                    </p>

                    <p className="mt-1 break-all text-xl font-extrabold tracking-wider text-[#FF6B00]">
                      {request.requestId}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Keep this ID safe. You can use it to track this request.
                    </p>
                  </div>

                </div>

                <div className="p-6 sm:p-8">

                  {/* STATUS */}
                  <div className="rounded-2xl bg-[#F4F6F9] p-5">

                    <div className="flex items-center gap-3">

                      {request.status === "Completed" ? (
                        <CheckCircle2
                          size={24}
                          className="text-green-600"
                        />
                      ) : (
                        <Clock3
                          size={24}
                          className="text-[#FF6B00]"
                        />
                      )}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Current Status
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-[#0A2342]">
                          {request.status || "Pending"}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* CUSTOMER INFORMATION */}
                  <div className="mt-8">

                    <h3 className="text-xl font-extrabold text-[#0A2342]">
                      Your Information
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

                      <InfoItem
                        label="Full Name"
                        value={request.name}
                        icon={<User size={18} />}
                      />

                      <InfoItem
                        label="Service"
                        value={formatService(request.service)}
                        icon={<Search size={18} />}
                      />

                      <InfoItem
                        label="Phone"
                        value={request.phone}
                        icon={<Phone size={18} />}
                      />

                      <InfoItem
                        label="Email"
                        value={request.email}
                        icon={<Mail size={18} />}
                      />

                    </div>

                  </div>

                  {/* HIRE CAR INFORMATION */}
                  {isHireCar && (
                    <div className="mt-8">

                      <div className="flex items-center gap-2">
                        <Car
                          size={21}
                          className="text-[#FF6B00]"
                        />

                        <h3 className="text-xl font-extrabold text-[#0A2342]">
                          Hire Car Details
                        </h3>
                      </div>

                      <div className="mt-4 rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-5">

                        <div className="grid gap-4 sm:grid-cols-2">

                          {request.carName && (
                            <InfoItem
                              label="Selected Car"
                              value={request.carName}
                              icon={<Car size={18} />}
                            />
                          )}

                          {(request.carBrand || request.carModel) && (
                            <InfoItem
                              label="Vehicle"
                              value={[
                                request.carBrand,
                                request.carModel,
                                request.carYear,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              icon={<Car size={18} />}
                            />
                          )}

                          {request.hireDate && (
                            <InfoItem
                              label="Hire Date"
                              value={request.hireDate}
                              icon={<Clock3 size={18} />}
                            />
                          )}

                          {request.hireTime && (
                            <InfoItem
                              label="Preferred Time"
                              value={request.hireTime}
                              icon={<Clock3 size={18} />}
                            />
                          )}

                          {request.pickupLocation && (
                            <InfoItem
                              label="Pickup Location"
                              value={request.pickupLocation}
                              icon={<MapPin size={18} />}
                            />
                          )}

                          {request.destination && (
                            <InfoItem
                              label="Destination"
                              value={request.destination}
                              icon={<MapPin size={18} />}
                            />
                          )}

                          {request.passengers && (
                            <InfoItem
                              label="Passengers"
                              value={request.passengers}
                              icon={<User size={18} />}
                            />
                          )}

                          {request.hireDays !== undefined && (
                            <InfoItem
                              label="Number of Days"
                              value={`${request.hireDays} ${
                                request.hireDays === 1
                                  ? "day"
                                  : "days"
                              }`}
                              icon={<Clock3 size={18} />}
                            />
                          )}

                        </div>

                        {request.pricePerDay !== undefined && (
                          <div className="mt-6 rounded-xl bg-white p-5">

                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm font-semibold text-slate-500">
                                Daily Rate
                              </span>

                              <span className="font-bold text-[#0A2342]">
                                ₦
                                {Number(
                                  request.pricePerDay
                                ).toLocaleString()}
                              </span>
                            </div>

                            {request.hireDays !== undefined && (
                              <div className="mt-3 flex items-center justify-between gap-4">
                                <span className="text-sm font-semibold text-slate-500">
                                  Number of Days
                                </span>

                                <span className="font-bold text-[#0A2342]">
                                  {request.hireDays}
                                </span>
                              </div>
                            )}

                            <div className="my-4 border-t border-slate-100" />

                            <div className="flex items-center justify-between gap-4">

                              <span className="text-base font-extrabold text-[#0A2342]">
                                Estimated Hire Total
                              </span>

                              <span className="text-2xl font-extrabold text-[#FF6B00]">
                                ₦
                                {Number(
                                  request.hireTotal ??
                                    Number(request.pricePerDay) *
                                      Number(request.hireDays || 0)
                                ).toLocaleString()}
                              </span>

                            </div>

                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* OTHER REQUEST DETAILS */}
                  {(request.pickup ||
                    request.destination ||
                    request.goods ||
                    request.vehicleType ||
                    request.logisticsType) && (
                    <div className="mt-8">

                      <h3 className="text-xl font-extrabold text-[#0A2342]">
                        Request Details
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">

                        {request.pickup && (
                          <InfoItem
                            label="Pickup"
                            value={request.pickup}
                            icon={<MapPin size={18} />}
                          />
                        )}

                        {request.destination && (
                          <InfoItem
                            label="Destination"
                            value={request.destination}
                            icon={<MapPin size={18} />}
                          />
                        )}

                        {request.goods && (
                          <InfoItem
                            label="Goods / Cargo"
                            value={request.goods}
                            icon={<Search size={18} />}
                          />
                        )}

                        {request.vehicleType && (
                          <InfoItem
                            label="Vehicle Type"
                            value={request.vehicleType}
                            icon={<Car size={18} />}
                          />
                        )}

                        {request.logisticsType && (
                          <InfoItem
                            label="Logistics Type"
                            value={request.logisticsType}
                            icon={<Search size={18} />}
                          />
                        )}

                      </div>

                    </div>
                  )}

                  {/* MESSAGE */}
                  {request.message && (
                    <div className="mt-8">

                      <h3 className="text-xl font-extrabold text-[#0A2342]">
                        Additional Information
                      </h3>

                      <div className="mt-4 rounded-xl bg-[#F4F6F9] p-5">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {request.message}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* DATES */}
                  <div className="mt-8 border-t border-slate-100 pt-5">

                    {request.createdAt && (
                      <p className="text-xs text-slate-500">
                        Submitted:{" "}
                        {new Date(
                          request.createdAt
                        ).toLocaleString()}
                      </p>
                    )}

                    {request.updatedAt && (
                      <p className="mt-1 text-xs text-slate-500">
                        Last updated:{" "}
                        {new Date(
                          request.updatedAt
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

function formatService(service: string) {
  switch (service) {
    case "haulage":
      return "Haulage & Trucking";

    case "logistics":
      return "General Logistics & Supply Chain";

    case "hire-car":
      return "Hire Car";

    default:
      return service || "Logistics Request";
  }
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
    <div className="rounded-xl border border-slate-100 bg-white p-4">

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
