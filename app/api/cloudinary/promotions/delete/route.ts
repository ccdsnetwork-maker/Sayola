import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const publicId = String(body.publicId || "").trim();

    if (!publicId) {
      return NextResponse.json(
        { error: "Cloudinary public ID is required." },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Promotional video delete error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not delete promotional video.",
      },
      { status: 500 }
    );
  }
}
