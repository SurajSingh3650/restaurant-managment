// AI assisted development
import { NextRequest, NextResponse } from "next/server";
import { getRestaurantBySlug } from "@/lib/db";

// GET - Get restaurant by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = await getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Get restaurant by slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

