import { NextRequest, NextResponse } from "next/server";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawRequestId = searchParams
      .get("id")
      ?.trim()
      .replace(/\s+/g, "");

    if (!rawRequestId) {
      return NextResponse.json(
        { error: "Request ID is required." },
        { status: 400 }
      );
    }

    /*
     * Tracking IDs are treated as case-insensitive.
     *
     * Example:
     * SAY-LOG-20260823-ABC123
     * say-log-20260823-abc123
     * Say-Log-20260823-Abc123
     *
     * All represent the same tracking ID.
     */
    const requestId = rawRequestId.toUpperCase();

    /*
     * We first try the normalized requestId field.
     */
    const normalizedQuery = query(
      collection(db, "messages"),
      where("requestId", "==", requestId)
    );

    const normalizedSnapshot = await getDocs(normalizedQuery);

    let matchingDoc =
      normalizedSnapshot.docs.length > 0
        ? normalizedSnapshot.docs[0]
        : null;

    /*
     * Some older requests may have been saved before normalization.
     * To keep those requests trackable, fall back to checking both
     * requestId and trackingId case-insensitively in the retrieved
     * logistics records.
     */
    if (!matchingDoc) {
      const messagesSnapshot = await getDocs(
        collection(db, "messages")
      );

      const target = requestId.toUpperCase();

      matchingDoc =
        messagesSnapshot.docs.find((item) => {
          const data = item.data();

          const storedRequestId = String(
            data.requestId || ""
          ).trim().toUpperCase();

          const storedTrackingId = String(
            data.trackingId || ""
          ).trim().toUpperCase();

          return (
            storedRequestId === target ||
            storedTrackingId === target
          );
        }) || null;
    }

    if (!matchingDoc) {
      return NextResponse.json(
        {
          error:
            "We could not find a request with that Tracking ID. Please check the ID and try again.",
        },
        { status: 404 }
      );
    }

    const data = matchingDoc.data();

    /*
     * Resolve the actual vehicle name from the admin
     * logisticsCars collection.
     *
     * The hire-car form stores the selected vehicle ID
     * as carId / selectedCarId. The admin vehicle document
     * contains the actual display name in its "name" field.
     */
    const resolvedCarId = String(
      data.selectedCarId || data.carId || ""
    ).trim();

    let resolvedCarName = String(
      data.selectedCarName || data.carName || ""
    ).trim();

    if (resolvedCarId) {
      try {
        const carRef = doc(
          db,
          "logisticsCars",
          resolvedCarId
        );

        const carSnapshot = await getDoc(carRef);

        if (carSnapshot.exists()) {
          const carData = carSnapshot.data();

          const adminVehicleName = String(
            carData.name || ""
          ).trim();

          if (adminVehicleName) {
            resolvedCarName = adminVehicleName;
          }
        }
      } catch (vehicleError) {
        console.error(
          "VEHICLE NAME LOOKUP ERROR:",
          vehicleError
        );
      }
    }


    /*
     * IMPORTANT:
     * Do not filter based on status.
     *
     * Pending, Approved, Rejected, In Progress, Completed,
     * Cancelled, or any future status should remain trackable.
     */

    const responseData = {
      id: matchingDoc.id,
      requestId:
        String(data.requestId || data.trackingId || requestId).toUpperCase(),

      trackingId:
        String(data.trackingId || data.requestId || requestId).toUpperCase(),

      name: String(data.name || ""),
      phone: String(data.phone || ""),
      email: String(data.email || ""),
      service: String(data.service || ""),

      status: String(data.status || "Pending"),

      pickup: String(
        data.pickup || data.pickupLocation || ""
      ),

      pickupLocation: String(
        data.pickupLocation || data.pickup || ""
      ),

      destination: String(data.destination || ""),

      goods: String(data.goods || ""),

      vehicleType: String(data.vehicleType || ""),

      logisticsType: String(data.logisticsType || ""),

      selectedCarId: resolvedCarId,

      selectedCarName: resolvedCarName,



      carId: resolvedCarId,




      carName: resolvedCarName,
      hireDays:
        typeof data.hireDays === "number"
          ? data.hireDays
          : Number(data.hireDays || 0),

      hireDuration: String(
        data.duration || data.hireDuration || ""
      ),

      passengers:
        typeof data.passengers === "number"
          ? data.passengers
          : Number(data.passengers || 0),

      pricePerDay:
        typeof data.pricePerDay === "number"
          ? data.pricePerDay
          : Number(data.pricePerDay || 0),

      hireTotal:
        typeof data.hireTotal === "number"
          ? data.hireTotal
          : Number(data.hireTotal || 0),

      vehiclePricePerDay:
        typeof data.vehiclePricePerDay === "number"
          ? data.vehiclePricePerDay
          : Number(data.vehiclePricePerDay || 0),

      message: String(data.message || ""),

      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null,

      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate().toISOString()
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("TRACK REQUEST ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Unable to retrieve the request at this time. Please try again.",
      },
      { status: 500 }
    );
  }
}
