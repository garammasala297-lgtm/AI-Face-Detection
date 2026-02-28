// ============================================================================
// Participant Onboarding API — POST /api/onboarding/participant
// ============================================================================
// After GitHub OAuth, participants complete their team/repo registration.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";
import Team from "@/models/Team";
import Hackathon from "@/models/Hackathon";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "participant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const {
      eventCode,
      teamName,
      teammateGithubUsernames,
      repositoryUrl,
      primaryTechStack,
      preferredContactEmail,
      consentCommitTracking,
      consentIpLocation,
    } = body;

    // Validate event code
    const hackathon = await Hackathon.findOne({ eventCode });
    if (!hackathon) {
      return NextResponse.json(
        { error: "Invalid hackathon event code" },
        { status: 400 }
      );
    }

    // Check if team name already exists for this hackathon
    let team = await Team.findOne({
      hackathonId: hackathon._id,
      name: teamName,
    });

    if (team) {
      // Add user to existing team if not already a member
      if (!team.participants.includes(session.user.id as any)) {
        team.participants.push(session.user.id as any);
        await team.save();
      }
    } else {
      // Create new team
      team = await Team.create({
        name: teamName,
        hackathonId: hackathon._id,
        memberGithubUsernames: teammateGithubUsernames || [],
        repositoryUrl,
        primaryTechStack: primaryTechStack || [],
        participants: [session.user.id],
      });
    }

    // Update user with team association and consent
    await User.findByIdAndUpdate(session.user.id, {
      teamId: team._id,
      hackathonId: hackathon._id,
      preferredContactEmail,
      consentCommitTracking: consentCommitTracking ?? false,
      consentIpLocation: consentIpLocation ?? false,
    });

    return NextResponse.json(
      {
        message: "Onboarding complete",
        teamId: team._id,
        teamName: team.name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Participant onboarding error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Team name already exists for this hackathon" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
