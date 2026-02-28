"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Users,
  Clock,
  MapPin,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  Award,
} from "lucide-react";
import type { BasicInfo, LocationCompliance } from "../../types";
import { TiltCard, GlowingBadge } from "../ui/Cards";

interface HeaderSectionProps {
  basicInfo: BasicInfo;
  locationCompliance: LocationCompliance;
  timeRemaining: string;
  onMentorHelp: () => void;
}

export function HeaderSection({
  basicInfo,
  locationCompliance,
  timeRemaining,
  onMentorHelp,
}: HeaderSectionProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <TiltCard className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {basicInfo.teamName}
            </motion.h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              {basicInfo.hackathonName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <GlowingBadge variant="default">
              <Clock className="w-4 h-4 mr-2" />
              {timeRemaining}
            </GlowingBadge>

            <motion.a
              href={basicInfo.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-purple-500 transition-all"
            >
              <Github className="w-4 h-4" />
              Repository
              <ExternalLink className="w-3 h-3" />
            </motion.a>

            <motion.button
              onClick={onMentorHelp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              Mentor Help
            </motion.button>
          </div>
        </div>

        {/* Team Members */}
        <div className="mt-6 flex items-center gap-4">
          <Users className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {basicInfo.teamMembers.map((member, i) => (
              <motion.span
                key={member}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="px-3 py-1 bg-gray-800/50 border border-gray-600 rounded-full text-sm text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-all cursor-pointer"
              >
                @{member}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Location Compliance */}
        <div className="mt-4 flex items-center gap-4">
          <MapPin
            className={`w-5 h-5 ${
              locationCompliance.isCompliant ? "text-green-400" : "text-yellow-400"
            }`}
          />
          <GlowingBadge
            variant={locationCompliance.isCompliant ? "success" : "warning"}
          >
            {!locationCompliance.isCompliant && (
              <AlertTriangle className="w-4 h-4 mr-1" />
            )}
            {locationCompliance.locationStatus}
          </GlowingBadge>
          <span className="text-gray-500 text-sm">
            {locationCompliance.geoFenceRuleSummary}
          </span>
        </div>
      </TiltCard>
    </motion.header>
  );
}
