"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  Check,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

type Property = {
  id: string;
  title?: string;
  location?: string;
  price?: string;
  type?: string;
  category?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  features?: string[];
  featured?: boolean;
  available?: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const propertiesQuery = query(
      collection(db, "properties"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      propertiesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Property[];

        setProperties(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load properties:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function toggleFeatured(property: Property) {
    try {
      await updateDoc(doc(db, "properties", property.id), {
        featured: !property.featured,
      });
    } catch (error) {
      console.error("Failed to update featured status:", error);
      alert("Could not update featured status.");
    }
  }

  async function toggleAvailable(property: Property) {
    try {
      await updateDoc(doc(db, "properties", property.id), {
        available: !property.available,
      });
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert("Could not update availability.");
    }
  }

  async function deleteProperty(property: Property) {
    const confirmed = window.confirm(
      `Delete "${property.title || "this property"}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "properties", property.id));
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Could not delete property.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <div className="container-site py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#0A2342] sm:text-4xl">
              Properties
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage listings, availability and homepage visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sayolaproadmin/properties/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-bold text-white transition hover:bg-[#e85f00]"
          >
            <Plus size={18} />
            Add Property
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total"
            value={properties.length}
          />

          <StatCard
            label="Featured"
            value={properties.filter((item) => item.featured).length}
          />

          <StatCard
            label="Available"
            value={properties.filter((item) => item.available).length}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6B00]" />
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading properties...
                </p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h2 className="text-xl font-extrabold text-[#0A2342]">
                No properties yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first property to start building the listings.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/sayolaproadmin/properties/new")
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 text-sm font-bold text-white"
              >
                <Plus size={17} />
                Add Property
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="h-48 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-40 lg:w-56 lg:shrink-0">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title || "Property"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge
                          active={property.available}
                          activeText="Available"
                          inactiveText="Unavailable"
                        />

                        <StatusBadge
                          active={property.featured}
                          activeText="Featured"
                          inactiveText="Unfeatured"
                        />
                      </div>

                      <h2 className="mt-3 text-xl font-extrabold text-[#0A2342]">
                        {property.title || "Untitled Property"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {property.location || "Location not specified"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        {property.price && (
                          <span className="font-bold text-[#FF6B00]">
                            {property.price}
                          </span>
                        )}

                        {property.category && (
                          <span className="text-slate-500">
                            {property.category}
                          </span>
                        )}

                        {property.type && (
                          <span className="text-slate-500">
                            {property.type}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/sayolaproadmin/properties/${property.id}/edit`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-[#0A2342] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF6B00]"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleFeatured(property)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                            property.featured
                              ? "bg-orange-100 text-[#FF6B00]"
                              : "border border-slate-200 text-slate-600 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                          }`}
                        >
                          {property.featured ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                          {property.featured ? "Unfeature" : "Feature"}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAvailable(property)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                            property.available
                              ? "bg-green-100 text-green-700"
                              : "border border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-700"
                          }`}
                        >
                          {property.available ? (
                            <Check size={16} />
                          ) : (
                            <X size={16} />
                          )}
                          {property.available
                            ? "Mark Unavailable"
                            : "Mark Available"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProperty(property)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#0A2342]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  active,
  activeText,
  inactiveText,
}: {
  active?: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? activeText : inactiveText}
    </span>
  );
}
