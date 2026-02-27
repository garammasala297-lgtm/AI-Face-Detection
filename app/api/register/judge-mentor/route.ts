import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { judgeMentorSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = judgeMentorSchema.parse(body);

    // Verify the access token
    const hackathon = await prisma.hackathon.findUnique({
      where: { accessToken: validated.accessToken },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Invalid hackathon access token" },
        { status: 400 }
      );
    }

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
    const role = validated.subRole === "JUDGE" ? "JUDGE" : "MENTOR";

    const user = await prisma.user.create({
      data: {
        name: validated.fullName,
        email: validated.email,
        password: hashed,
        role: role as any,
        domainExpertise: validated.domainExpertise as any,
        linkedinUrl: validated.linkedinUrl || null,
        portfolioUrl: validated.portfolioUrl || null,
        availabilityStart:
          role === "MENTOR" ? validated.availabilityStart : null,
        availabilityEnd:
          role === "MENTOR" ? validated.availabilityEnd : null,
        conflictOfInterest: true,
      },
    });

    // Link to hackathon
    if (role === "JUDGE") {
      await prisma.hackathonJudge.create({
        data: { userId: user.id, hackathonId: hackathon.id },
      });
    } else {
      await prisma.hackathonMentor.create({
        data: { userId: user.id, hackathonId: hackathon.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: `${role} account created and linked to hackathon`,
      userId: user.id,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Judge/Mentor registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
