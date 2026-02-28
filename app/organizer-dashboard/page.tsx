"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Import the existing organizer dashboard component
import OrganizerDashboard from "../../ORGANISER_DASHBOARD/app/OrganizerDashboard";

export default function OrganizerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
    if (status === "authenticated" && session?.user?.role !== "organizer") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "organizer") {
    return null;
  }

  return (
    <div className="relative">
      <div className="fixed top-0 right-0 z-50 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/auth" })}
          className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all"
        >
          Sign out
        </button>
      </div>
      <OrganizerDashboard />
    </div>
  );
}
