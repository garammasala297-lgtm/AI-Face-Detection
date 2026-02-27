import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { organizerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = organizerSchema.parse(body);

    const exists = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(validated.password, 12);

    const user = await prisma.user.create({
      data: {
        name: validated.fullName,
        email: validated.email,
        password: hashed,
        role: "ORGANIZER",
        organizationName: validated.organizationName,
        contactPhone: validated.contactPhone,
        designation: validated.designation as any,
        organizationLogo: validated.organizationLogo || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Organizer account created successfully",
      userId: user.id,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Organizer registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
