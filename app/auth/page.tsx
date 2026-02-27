"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import RoleToggle, { type RoleTab } from "@/components/auth/RoleToggle";
import ParticipantForm from "@/components/auth/ParticipantForm";
import OrganizerForm from "@/components/auth/OrganizerForm";
import JudgeMentorForm from "@/components/auth/JudgeMentorForm";
import LoginForm from "@/components/auth/LoginForm";
import { Terminal, ArrowRightLeft } from "lucide-react";

export default function AuthPage() {
  const [activeRole, setActiveRole] = useState<RoleTab>("participant");
  const [isLogin, setIsLogin] = useState(false);

  const roleDescriptions: Record<RoleTab, { title: string; subtitle: string }> = {
    participant: {
      title: "Join as Participant",
      subtitle: "Connect your GitHub, register your team, and start building.",
    },
    organizer: {
      title: "Organizer Portal",
      subtitle: "Set up your hackathon, define rules, and monitor compliance.",
    },
    "judge-mentor": {
      title: "Judge & Mentor Access",
      subtitle: "Evaluate projects fairly or provide real-time guidance.",
    },
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel: Animated Background ─── */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-950">
        <AnimatedBackground />
      </div>

      {/* ─── Right Panel: Auth Forms ─── */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-4 sm:p-8 bg-zinc-950 relative overflow-y-auto min-h-screen">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg relative z-10 py-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-extrabold">
              <span className="text-gradient-cyber">Commit</span>
              <span className="text-white">Lens</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Hackathon Intelligence Platform
            </p>
          </div>

          {/* Glass Card */}
          <div className="glass-card p-6 sm:p-8">
            {/* Mode toggle: Sign Up / Login */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-neon-blue" />
                <h2 className="text-lg font-bold">
                  {isLogin ? "Welcome Back" : roleDescriptions[activeRole].title}
                </h2>
              </div>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-neon-blue transition-colors"
              >
                <ArrowRightLeft size={12} />
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </div>

            {!isLogin && (
              <p className="text-xs text-zinc-500 mb-5">
                {roleDescriptions[activeRole].subtitle}
              </p>
            )}

            {/* Role Toggle (only for sign-up) */}
            {!isLogin && (
              <div className="mb-6 flex justify-center">
                <RoleToggle activeRole={activeRole} onChange={setActiveRole} />
              </div>
            )}

            {/* Form Area */}
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LoginForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeRole}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    {activeRole === "participant" && <ParticipantForm />}
                    {activeRole === "organizer" && <OrganizerForm />}
                    {activeRole === "judge-mentor" && <JudgeMentorForm />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-[10px] text-zinc-600">
                By continuing, you agree to CommitLens&apos;s{" "}
                <a href="#" className="text-neon-blue/60 hover:text-neon-blue">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-neon-blue/60 hover:text-neon-blue">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Security badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green/50" />
            Secured with end-to-end encryption &bull; SOC2 Compliant
          </div>
        </div>
      </div>
    </div>
  );
}
