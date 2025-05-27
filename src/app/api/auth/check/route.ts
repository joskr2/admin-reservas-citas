import { NextResponse } from "next/server";

export async function GET() {
  // Mock authentication - always return true for now
  return NextResponse.json({
    authenticated: true,
  });
}
