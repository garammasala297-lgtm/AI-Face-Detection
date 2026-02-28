"use client";

// ============================================================================
// KPI Overview Cards Component
// ============================================================================

import { motion } from "framer-motion";
import {
  Users,
  Activity,
  GitCommit,
  GitPullRequest,
  TrendingUp,
  UserCheck,
  UserX,
  Award,
} from "lucide-react";
import { TiltCard, GlowingBadge, CircularProgress } from "../ui/Cards";
import { fadeInUp } from "../../hooks";
import type { HackathonOverview } from "../../types";

// ============================================================================
// Overview Cards
// ============================================================================
interface OverviewCardsProps {
  data: HackathonOverview;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      label: "Total Teams",
      value: data.totalRegisteredTeams,
      icon: Users,
      color: "purple" as const,
      subValue: `${data.activeTeamsCount} active`,
    },
    {
      label: "Active Now",
      value: data.activeTeamsCount,
      icon: UserCheck,
      color: "green" as const,
      subValue: `${Math.round((data.activeTeamsCount / data.totalRegisteredTeams) * 100)}% of total`,
    },
    {
      label: "Inactive Teams",
      value: data.inactiveTeamsCount,
      icon: UserX,
      color: "amber" as const,
      subValue: "Need attention",
    },
    {
      label: "Total Commits",
      value: data.totalCommits.toLocaleString(),
      icon: GitCommit,
      color: "cyan" as const,
      subValue: `${data.averageCommitsPerTeam} avg/team`,
    },
    {
      label: "Pull Requests",
      value: data.totalPullRequests,
      icon: GitPullRequest,
      color: "purple" as const,
      subValue: "Merged & open",
    },
    {
      label: "Avg Fairness",
      value: `${data.averageFairnessScore}%`,
      icon: Award,
      color: "green" as const,
      isProgress: true,
      progressValue: data.averageFairnessScore,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div key={card.label} variants={fadeInUp}>
          <TiltCard glow={card.color} className="p-4 h-full">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    card.color === "purple"
                      ? "bg-purple-500/20"
                      : card.color === "cyan"
                      ? "bg-cyan-500/20"
                      : card.color === "green"
                      ? "bg-green-500/20"
                      : "bg-amber-500/20"
                  }`}
                >
                  <card.icon
                    className={`w-4 h-4 ${
                      card.color === "purple"
                        ? "text-purple-400"
                        : card.color === "cyan"
                        ? "text-cyan-400"
                        : card.color === "green"
                        ? "text-green-400"
                        : "text-amber-400"
                    }`}
                  />
                </div>
                {card.isProgress && (
                  <CircularProgress
                    value={card.progressValue || 0}
                    size={40}
                    strokeWidth={4}
                    color={card.color as "green"}
                    showLabel={false}
                  />
                )}
              </div>

              <h3 className="text-xs text-slate-400 uppercase tracking-wider">
                {card.label}
              </h3>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              {card.subValue && !card.isProgress && (
                <p className="text-xs text-slate-500 mt-1">{card.subValue}</p>
              )}
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// Live Activity Summary
// ============================================================================
interface LiveActivitySummaryProps {
  teamsCurrentlyCoding: string[];
  teamsIdleForLongTime: string[];
  peakActivityTime: string;
}

export function LiveActivitySummary({
  teamsCurrentlyCoding,
  teamsIdleForLongTime,
  peakActivityTime,
}: LiveActivitySummaryProps) {
  return (
    <div className="space-y-4">
      {/* Currently Coding */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-green-400" />
          <h4 className="text-sm font-semibold text-green-400">Currently Coding</h4>
          <GlowingBadge color="green" size="sm">
            {teamsCurrentlyCoding.length}
          </GlowingBadge>
        </div>
        <div className="flex flex-wrap gap-2">
          {teamsCurrentlyCoding.slice(0, 6).map((team) => (
            <motion.span
              key={team}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-lg"
            >
              {team}
            </motion.span>
          ))}
          {teamsCurrentlyCoding.length > 6 && (
            <span className="px-2 py-1 text-xs text-slate-400">
              +{teamsCurrentlyCoding.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Peak Activity */}
      <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-slate-300">Peak Activity</span>
        </div>
        <GlowingBadge color="cyan" size="sm">
          {peakActivityTime}
        </GlowingBadge>
      </div>

      {/* Idle Teams */}
      {teamsIdleForLongTime.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserX className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-amber-400">Long Idle</h4>
            <GlowingBadge color="amber" size="sm" pulse>
              {teamsIdleForLongTime.length}
            </GlowingBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            {teamsIdleForLongTime.map((team) => (
              <span
                key={team}
                className="px-2 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-lg"
              >
                {team}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
