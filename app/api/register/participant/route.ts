import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { participantSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in via GitHub to register as a participant" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = participantSchema.parse(body);

    // Verify the invite code maps to an actual hackathon
    const hackathon = await prisma.hackathon.findUnique({
      where: { inviteCode: validated.inviteCode },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Invalid hackathon invite code" },
        { status: 400 }
      );
    }

    // Update the GitHub-authenticated user with participant-specific data
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: "PARTICIPANT",
        preferredEmail: validated.preferredEmail,
        primaryTechStack: validated.techStack,
        consentCommitTracking: validated.consentCommitTracking,
        consentLocationAccess: validated.consentLocationAccess,
      },
    });

    // Create or find the team
    let team = await prisma.team.findUnique({
      where: {
        name_hackathonId: {
          name: validated.teamName,
          hackathonId: hackathon.id,
        },
      },
    });

    if (!team) {
      team = await prisma.team.create({
        data: {
          name: validated.teamName,
          repoUrl: validated.repoUrl,
          hackathonId: hackathon.id,
        },
      });
    }

    // Add current user as team leader
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: team.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        teamId: team.id,
        githubUsername: user.githubUsername || "",
        isLeader: true,
      },
    });

    // Add teammates (they may not have accounts yet — store their GitHub usernames)
    for (const teammate of validated.teammates) {
      if (!teammate) continue;
      const existingUser = await prisma.user.findUnique({
        where: { githubUsername: teammate },
      });

      if (existingUser) {
        await prisma.teamMember.upsert({
          where: {
            userId_teamId: {
              userId: existingUser.id,
              teamId: team.id,
            },
          },
          update: {},
          create: {
            userId: existingUser.id,
            teamId: team.id,
            githubUsername: teammate,
            isLeader: false,
          },
        });
      }
      // If teammate doesn't have an account, they'll be linked when they sign up
    }

    return NextResponse.json({
      success: true,
      message: "Participant registered and linked to hackathon successfully",
      userId: user.id,
      teamId: team.id,
      hackathonId: hackathon.id,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Participant registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
