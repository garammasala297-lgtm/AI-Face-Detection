"use client";

// ============================================================================
// Recent Commits Feed Component
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, User, Clock, Code } from "lucide-react";
import { GlassCard, GlowingBadge } from "../ui/Cards";
import type { RecentCommit } from "../../types";

// ============================================================================
// Commit Item
// ============================================================================
interface CommitItemProps {
  commit: RecentCommit;
  index: number;
}

function CommitItem({ commit, index }: CommitItemProps) {
  // Parse commit message type
  const getCommitType = (message: string) => {
    if (message.startsWith("feat:")) return { type: "feature", color: "green" };
    if (message.startsWith("fix:")) return { type: "fix", color: "amber" };
    if (message.startsWith("docs:")) return { type: "docs", color: "cyan" };
    if (message.startsWith("style:")) return { type: "style", color: "purple" };
    if (message.startsWith("refactor:")) return { type: "refactor", color: "pink" };
    if (message.startsWith("test:")) return { type: "test", color: "orange" };
    return { type: "commit", color: "slate" };
  };

  const { type, color } = getCommitType(commit.message);

  const colorClasses: Record<string, string> = {
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    slate: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
    >
      {/* Commit Icon */}
      <div className="relative mt-0.5">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <GitCommit className="w-4 h-4 text-purple-400" />
        </div>
        {/* Connection line */}
        {index < 4 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-purple-500/50 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-medium text-sm truncate">
            {commit.team}
          </span>
          <span
            className={`px-1.5 py-0.5 text-xs rounded border ${colorClasses[color]}`}
          >
            {type}
          </span>
        </div>
        <p className="text-slate-300 text-xs truncate group-hover:text-white transition-colors">
          {commit.message}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {commit.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {commit.timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Recent Commits Feed
// ============================================================================
interface RecentCommitsFeedProps {
  commits: RecentCommit[];
}

export function RecentCommitsFeed({ commits }: RecentCommitsFeedProps) {
  return (
    <GlassCard glow="cyan" className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Live Commits</h3>
        </div>
        <GlowingBadge color="cyan" size="sm" pulse>
          Real-time
        </GlowingBadge>
      </div>

      {/* Commits List */}
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {commits.map((commit, index) => (
            <CommitItem key={commit.id} commit={commit} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <motion.button
        className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        View All Commits →
      </motion.button>
    </GlassCard>
  );
}
