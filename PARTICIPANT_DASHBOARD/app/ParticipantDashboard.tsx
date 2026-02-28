"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle, XCircle, Flag } from "lucide-react";

// Components
import {
  AnimatedBackground,
  StatCard,
  ToastContainer,
  ExplanationModal,
  MentorHelpModal,
  CommitTimelineChart,
  ContributionBarChart,
  HeaderSection,
  FairnessCard,
  FlagsList,
  LearningSummarySection,
  LoadingSpinner,
} from "../components";

// Hooks
import {
  useDashboard,
  useFlags,
  useToasts,
  useTimeRemaining,
  useMentorHelp,
} from "../hooks";

// Types
import type { DetectedFlag } from "../types";

interface ParticipantDashboardProps {
  teamId?: string;
}

export default function ParticipantDashboard({
  teamId = "codecrafters",
}: ParticipantDashboardProps) {
  // Fetch dashboard data
  const { data, loading, error, refetch } = useDashboard(teamId);

  // Toast notifications
  const { toasts, addToast, removeToast } = useToasts();

  // Mentor help
  const { requestHelp, requesting: mentorRequesting } = useMentorHelp(teamId);
  const [showMentorModal, setShowMentorModal] = useState(false);

  // Flag management
  const {
    flags,
    submitExplanation,
    submitting: flagSubmitting,
  } = useFlags(data?.transparencyFlags.detectedFlags || [], teamId);

  const [selectedFlag, setSelectedFlag] = useState<DetectedFlag | null>(null);

  // Time remaining countdown
  const timeRemaining = useTimeRemaining(data?.basicInfo.endTime || "");

  // Simulate initial notifications
  useEffect(() => {
    if (!data) return;

    const timer1 = setTimeout(() => {
      addToast("warning", "Malpractice Warning", "Unusual commit pattern detected at 16:45");
    }, 2000);

    const timer2 = setTimeout(() => {
      addToast("alert", "Long Inactivity Alert", "No commits detected for 45 minutes");
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [data, addToast]);

  // Handle flag explanation submission
  const handleExplanationSubmit = async (flagId: number, explanation: string) => {
    const success = await submitExplanation(flagId, explanation);
    if (success) {
      addToast("success", "Explanation Submitted", "Your explanation has been recorded");
      setSelectedFlag(null);
    } else {
      addToast("alert", "Submission Failed", "Please try again");
    }
  };

  // Handle mentor help request
  const handleMentorHelp = async (message: string) => {
    const success = await requestHelp(message);
    if (success) {
      addToast("success", "Help Request Sent", "A mentor will respond shortly");
      setShowMentorModal(false);
    } else {
      addToast("alert", "Request Failed", "Please try again");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Loading state
  if (loading) {
    return (
      <AnimatedBackground>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <AnimatedBackground>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Failed to load dashboard</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <motion.button
              onClick={refetch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-semibold"
            >
              Retry
            </motion.button>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto p-6 space-y-6"
      >
        {/* Header Section */}
        <HeaderSection
          basicInfo={data.basicInfo}
          locationCompliance={data.locationCompliance}
          timeRemaining={timeRemaining.formatted}
          onMentorHelp={() => setShowMentorModal(true)}
        />

        {/* Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <StatCard
            label="Total Commits"
            value={data.commitActivity.totalCommits}
            icon={<Activity className="w-8 h-8" />}
            color="purple"
            delay={0.2}
          />
          <StatCard
            label="In-Window"
            value={`${data.commitActivity.commitsInsideWindowPct}%`}
            icon={<CheckCircle className="w-8 h-8" />}
            color="green"
            delay={0.3}
          />
          <StatCard
            label="Outside Window"
            value={data.commitActivity.commitsOutsideWindowCount}
            icon={<XCircle className="w-8 h-8" />}
            color="red"
            delay={0.4}
          />
          <StatCard
            label="Active Flags"
            value={flags.filter((f) => !f.explained).length}
            icon={<Flag className="w-8 h-8" />}
            color="yellow"
            delay={0.5}
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <CommitTimelineChart data={data.commitActivity.hourWiseTimeline} />
          <ContributionBarChart data={data.contributionBreakdown.memberStats} />
        </motion.div>

        {/* Fairness & Flags Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <FairnessCard fairness={data.fairnessIndicator} />
          <FlagsList flags={flags} onExplain={setSelectedFlag} />
        </motion.div>

        {/* Learning Summary Footer */}
        <LearningSummarySection summary={data.transparencyFlags.learningSummary} />
      </motion.div>

      {/* Explanation Modal */}
      <AnimatePresence>
        {selectedFlag && (
          <ExplanationModal
            flag={selectedFlag}
            onClose={() => setSelectedFlag(null)}
            onSubmit={handleExplanationSubmit}
            submitting={flagSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Mentor Help Modal */}
      <AnimatePresence>
        {showMentorModal && (
          <MentorHelpModal
            onClose={() => setShowMentorModal(false)}
            onSubmit={handleMentorHelp}
            submitting={mentorRequesting}
          />
        )}
      </AnimatePresence>
    </AnimatedBackground>
  );
}
