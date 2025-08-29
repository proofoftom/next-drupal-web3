import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the access token from the request headers
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // For now, just return a simple response
    // In a real implementation, you would validate the token with Drupal
    return NextResponse.json({ message: "Token received", token });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}