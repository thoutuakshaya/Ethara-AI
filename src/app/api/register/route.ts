import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MEMBER"]).optional()
});

export async function POST(req: Request) {
  try {

    // Parse request body
    const body = await req.json();

    // Validate input
    const { name, email, password, role } =
      registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exists"
        },
        {
          status: 409
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "MEMBER"
      }
    });

    // Success response
    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        message: "User created successfully"
      },
      {
        status: 201
      }
    );

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0].message
        },
        {
          status: 400
        }
      );
    }

    // Show real backend/database error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : String(error)
      },
      {
        status: 500
      }
    );
  }
}