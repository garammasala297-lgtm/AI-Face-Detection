"use client";

import { motion } from "framer-motion";
import { GitBranch, Building2, GraduationCap } from "lucide-react";

export type RoleTab = "participant" | "organizer" | "judge-mentor";

interface RoleToggleProps {
  activeRole: RoleTab;
  onChange: (role: RoleTab) => void;
}

const roles: { id: RoleTab; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "participant",
    label: "Participant",
    icon: <GitBranch size={16} />,
    color: "neon-green",
  },
  {
    id: "organizer",
    label: "Organizer",
    icon: <Building2 size={16} />,
    color: "neon-blue",
  },
  {
    id: "judge-mentor",
    label: "Judge / Mentor",
    icon: <GraduationCap size={16} />,
    color: "neon-purple",
  },
];

export default function RoleToggle({ activeRole, onChange }: RoleToggleProps) {
  return (
    <div className="relative flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
      {roles.map((role) => {
        const isActive = activeRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onChange(role.id)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeRoleTab"
                className={`absolute inset-0 rounded-xl ${
                  role.id === "participant"
                    ? "bg-neon-green/15 border border-neon-green/30"
                    : role.id === "organizer"
                    ? "bg-neon-blue/15 border border-neon-blue/30"
                    : "bg-neon-purple/15 border border-neon-purple/30"
                }`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  boxShadow:
                    role.id === "participant"
                      ? "0 0 20px rgba(0,255,136,0.1)"
                      : role.id === "organizer"
                      ? "0 0 20px rgba(0,212,255,0.1)"
                      : "0 0 20px rgba(168,85,247,0.1)",
                }}
              />
            )}
            <span className="relative">{role.icon}</span>
            <span className="relative hidden sm:inline">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}
