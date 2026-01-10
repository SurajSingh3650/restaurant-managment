// AI assisted development
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "./auth";
import { getUserById } from "./db";

export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; email: string } | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await getUserById(decoded.id);
  if (!user) return null;

  return { userId: user.id, email: user.email };
}

export function requireAuth<T = any>(
  handler: (
    request: NextRequest,
    auth: { userId: string; email: string },
    context?: T
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: T) => {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return handler(request, auth, context);
  };
}

