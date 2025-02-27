import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store in database

    // For demo purposes, we'll just return success
    return NextResponse.json({
      id: "user_" + Date.now(),
      name,
      email,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

