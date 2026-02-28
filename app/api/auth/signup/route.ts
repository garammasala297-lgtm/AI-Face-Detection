// ============================================================================
// Signup API Route — POST /api/auth/signup
// ============================================================================
// Handles registration for Organizers and Judges (email + password).
// Participants are auto-created during GitHub OAuth sign-in.

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";
import Hackathon from "@/models/Hackathon";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { role } = body;

    // -----------------------------------------------------------------------
    // Organizer Signup
    // -----------------------------------------------------------------------
    if (role === "organizer") {
      const {
        fullName,
        workEmail,
        password,
        organizationName,
        contactPhoneNumber,
        designation,
        organizationLogoUrl,
      } = body;

      if (!fullName || !workEmail || !password) {
        return NextResponse.json(
          { error: "Full name, email, and password are required" },
          { status: 400 }
        );
      }

      // Check if email already registered
      const existingUser = await User.findOne({
        email: workEmail.toLowerCase(),
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({
        role: "organizer",
        name: fullName,
        email: workEmail.toLowerCase(),
        passwordHash,
        organizationName,
        organizerPhoneNumber: contactPhoneNumber,
        organizerDesignation: designation,
        organizationLogoUrl: organizationLogoUrl || undefined,
      });

      return NextResponse.json(
        {
          message: "Organizer account created successfully",
          userId: user._id,
        },
        { status: 201 }
      );
    }

    // -----------------------------------------------------------------------
    // Judge Signup
    // -----------------------------------------------------------------------
    if (role === "judge") {
      const {
        fullName,
        email,
        password,
        hackathonAccessToken,
        domainExpertise,
        linkedInOrPortfolioUrl,
        availabilityShift,
        conflictOfInterestAccepted,
      } = body;

      if (!fullName || !email || !password) {
        return NextResponse.json(
          { error: "Full name, email, and password are required" },
          { status: 400 }
        );
      }

      if (!hackathonAccessToken) {
        return NextResponse.json(
          { error: "Hackathon access token is required" },
          { status: 400 }
        );
      }

      // Verify the hackathon access token exists
      const hackathon = await Hackathon.findOne({
        judgeMentorAccessToken: hackathonAccessToken,
      });
      if (!hackathon) {
        return NextResponse.json(
          { error: "Invalid hackathon access token" },
          { status: 400 }
        );
      }

      // Check if email already registered
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({
        role: "judge",
        name: fullName,
        email: email.toLowerCase(),
        passwordHash,
        hackathonAccessToken,
        domainExpertise,
        linkedinOrPortfolioUrl: linkedInOrPortfolioUrl,
        availabilityShift: availabilityShift || undefined,
        conflictOfInterestAccepted: conflictOfInterestAccepted ?? false,
        hackathonId: hackathon._id,
      });

      return NextResponse.json(
        {
          message: "Judge account created successfully",
          userId: user._id,
        },
        { status: 201 }
      );
    }

    // -----------------------------------------------------------------------
    // Invalid role
    // -----------------------------------------------------------------------
    return NextResponse.json(
      { error: "Invalid role. Use 'organizer' or 'judge'." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
