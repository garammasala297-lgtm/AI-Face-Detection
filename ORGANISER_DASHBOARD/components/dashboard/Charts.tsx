"use client";

// ============================================================================
// Charts Components with Custom Styled Recharts
// ============================================================================

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { GlassCard } from "../ui/Cards";
import type {
  ActivityDataPoint,
  ComplianceHistoryPoint,
  ViolationType,
} from "../../types";

// ============================================================================
// Custom Tooltip Component
// ============================================================================
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-slate-300 text-xs font-medium mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white text-sm font-semibold">{entry.value}</span>
          <span className="text-slate-400 text-xs">{entry.name}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Activity Heatmap Chart
// ============================================================================
interface ActivityHeatmapProps {
  data: ActivityDataPoint[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  return (
    <GlassCard glow="purple" className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Real-Time Activity</h3>
        <span className="text-xs text-slate-400">Last 24 hours</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="hour"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={{ stroke: "#475569" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={{ stroke: "#475569" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="intensity"
              name="Intensity"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#activityGradient)"
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#commitsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

// ============================================================================
// Compliance Pie Chart
// ============================================================================
interface ComplianceChartProps {
  compliant: number;
  warnings: number;
  violations: number;
}

export function ComplianceChart({ compliant, warnings, violations }: ComplianceChartProps) {
  const data = [
    { name: "Compliant", value: compliant, color: "#22c55e" },
    { name: "Warnings", value: warnings, color: "#f59e0b" },
    { name: "Violations", value: violations, color: "#ef4444" },
  ];

  const total = compliant + warnings + violations;

  return (
    <GlassCard glow="green" className="h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Rule Compliance</h3>
      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-300">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ============================================================================
// Location Distribution Chart
// ============================================================================
interface LocationChartProps {
  onSite: number;
  mixed: number;
  outsideGeoFence: number;
}

export function LocationChart({ onSite, mixed, outsideGeoFence }: LocationChartProps) {
  const data = [
    { name: "On-Site", value: onSite, color: "#06b6d4" },
    { name: "Mixed", value: mixed, color: "#a855f7" },
    { name: "Outside Geofence", value: outsideGeoFence, color: "#f59e0b" },
  ];

  return (
    <GlassCard glow="cyan" className="h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Location Monitoring</h3>
      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-slate-400">{item.name}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ============================================================================
// Compliance History Line Chart
// ============================================================================
interface ComplianceHistoryChartProps {
  data: ComplianceHistoryPoint[];
}

export function ComplianceHistoryChart({ data }: ComplianceHistoryChartProps) {
  return (
    <GlassCard padding="md">
      <h3 className="text-lg font-semibold text-white mb-4">Compliance Over Time</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="compliant"
              name="Compliant"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="warnings"
              name="Warnings"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="violations"
              name="Violations"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

// ============================================================================
// Violations Bar Chart
// ============================================================================
interface ViolationsChartProps {
  data: ViolationType[];
}

export function ViolationsChart({ data }: ViolationsChartProps) {
  const severityColors = {
    low: "#06b6d4",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  const chartData = data.map((v) => ({
    ...v,
    fill: severityColors[v.severity],
  }));

  return (
    <GlassCard padding="md">
      <h3 className="text-lg font-semibold text-white mb-4">Violation Types</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="type"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 10 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

// ============================================================================
// Scoring Weights Radial Chart
// ============================================================================
interface ScoringWeightsChartProps {
  weights: {
    commits: number;
    codeQuality: number;
    collaboration: number;
    consistency: number;
    innovation: number;
  };
}

export function ScoringWeightsChart({ weights }: ScoringWeightsChartProps) {
  const data = [
    { name: "Commits", value: weights.commits, fill: "#a855f7" },
    { name: "Code Quality", value: weights.codeQuality, fill: "#06b6d4" },
    { name: "Collaboration", value: weights.collaboration, fill: "#22c55e" },
    { name: "Consistency", value: weights.consistency, fill: "#f59e0b" },
    { name: "Innovation", value: weights.innovation, fill: "#ec4899" },
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ fill: "#fff", fontSize: 10 }}
            background={{ fill: "#1e293b" }}
            dataKey="value"
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
