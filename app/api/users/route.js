import { NextResponse } from "next/server";
import { createUser } from "@/lib/services/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    // Only allow admin users to create new users (except for the first admin setup)
    const session = await getServerSession(authOptions);

    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "password"];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (data.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // If user is trying to create an admin account, check if they're authorized
    if (data.role === "admin" && (!session || session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized to create admin accounts" },
        { status: 403 }
      );
    }

    const newUser = await createUser(data);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.message === "User with this email already exists") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
