// AI assisted development
import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantsByUserId,
  createRestaurant,
  getRestaurants,
} from "@/lib/db";
import { authenticateRequest } from "@/lib/middleware";
import { Restaurant } from "@/types";

// GET - Get user's restaurants or all restaurants (for public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Get restaurants for specific user
      const restaurants = await getRestaurantsByUserId(userId);
      return NextResponse.json(restaurants);
    }

    // Get all restaurants (public)
    const restaurants = await getRestaurants();
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new restaurant (requires auth)
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      address,
      phone,
      email,
      logoUrl,
      coverImageUrl,
      website,
      hours,
      menu,
      theme,
      slug,
    } = body;

    if (!name || !description || !address || !phone || !email) {
      return NextResponse.json(
        { error: "Name, description, address, phone, and email are required" },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const restaurantSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const restaurant = await createRestaurant({
      userId: auth.userId,
      name,
      description,
      address,
      phone,
      email,
      website,
      logoUrl,
      coverImageUrl,
      hours: hours || {},
      menu: menu || [],
      theme: theme || {
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        fontFamily: "sans-serif",
      },
      slug: restaurantSlug,
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Create restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

