// AI assisted development
import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "@/lib/db";
import { authenticateRequest } from "@/lib/middleware";

// GET - Get restaurant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await getRestaurantById(params.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Get restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update restaurant (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const restaurant = await getRestaurantById(params.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (restaurant.userId !== auth.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await updateRestaurant(params.id, body);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete restaurant (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const restaurant = await getRestaurantById(params.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (restaurant.userId !== auth.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await deleteRestaurant(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

