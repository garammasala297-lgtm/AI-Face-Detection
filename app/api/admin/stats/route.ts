// ============================================================================
// Admin Stats API — GET /api/admin/stats
// ============================================================================

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Team from "@/models/Team";
import Hackathon from "@/models/Hackathon";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();

  const [participants, judges, organizers, admins, teams, hackathons] =
    await Promise.all([
      User.countDocuments({ role: "participant" }),
      User.countDocuments({ role: "judge" }),
      User.countDocuments({ role: "organizer" }),
      User.countDocuments({ role: "admin" }),
      Team.countDocuments(),
      Hackathon.countDocuments(),
    ]);

  return NextResponse.json({
    stats: { participants, judges, organizers, admins, teams, hackathons },
  });
}
