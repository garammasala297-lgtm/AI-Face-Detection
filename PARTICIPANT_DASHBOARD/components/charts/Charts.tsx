"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import type { HourWiseCommit, MemberStat } from "../../types";
import { TiltCard } from "../ui/Cards";

// Custom Tooltip for Line Chart
const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3 shadow-2xl"
      >
        <p className="text-purple-300 font-semibold">{label}</p>
        <p className="text-white">
          <span className="text-cyan-400">{payload[0].value}</span> commits
        </p>
      </motion.div>
    );
  }
  return null;
};

// Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl"
      >
        <p className="text-cyan-300 font-bold mb-2">@{label}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-300">
            Commits:{" "}
            <span className="text-white font-semibold">{data.commitsCount}</span>
          </p>
          <p className="text-green-400">+{data.linesAdded} lines</p>
          <p className="text-red-400">-{data.linesDeleted} lines</p>
          <p className="text-purple-400">{data.contributionPercentage}% contribution</p>
        </div>
      </motion.div>
    );
  }
  return null;
};

interface CommitTimelineChartProps {
  data: HourWiseCommit[];
}

export function CommitTimelineChart({ data }: CommitTimelineChartProps) {
  return (
    <TiltCard className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Hour-wise Commit Timeline</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomLineTooltip />} />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#06b6d4" }}
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </TiltCard>
  );
}

interface ContributionBarChartProps {
  data: MemberStat[];
}

const barColors = ["#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

export function ContributionBarChart({ data }: ContributionBarChartProps) {
  return (
    <TiltCard className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Commits per Team Member</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="username" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar dataKey="commitsCount" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </TiltCard>
  );
}
