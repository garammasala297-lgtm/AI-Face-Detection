"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Scale, Shield, Check } from "lucide-react";
import type { UserRole, RoleOption } from "../../types";

// ============================================================================
// Role Options Configuration
// ============================================================================
const roleOptions: RoleOption[] = [
  {
    role: "participant",
    label: "Participant",
    description: "Join as a team member and compete",
    icon: "Users",
    color: "purple",
  },
  {
    role: "organizer",
    label: "Organizer",
    description: "Manage hackathon events",
    icon: "Trophy",
    color: "cyan",
  },
  {
    role: "judge",
    label: "Judge",
    description: "Evaluate team submissions",
    icon: "Scale",
    color: "amber",
  },
];

// ============================================================================
// Role Card Component
// ============================================================================
interface RoleCardProps {
  option: RoleOption;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

function RoleCard({ option, isSelected, onSelect }: RoleCardProps) {
  const IconComponent = {
    Users,
    Trophy,
    Scale,
    Shield,
  }[option.icon] || Users;

  const colorMap = {
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500",
      text: "text-purple-400",
      glow: "shadow-purple-500/30",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/30",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500",
      text: "text-amber-400",
      glow: "shadow-amber-500/30",
    },
  };

  const colorClasses = colorMap[option.color as keyof typeof colorMap] || colorMap.purple;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(option.role)}
      className={`
        relative w-full p-4 rounded-xl text-left transition-all duration-300
        ${isSelected ? `${colorClasses.bg} border-2 ${colorClasses.border} shadow-lg ${colorClasses.glow}` : "bg-slate-800/30 border-2 border-transparent hover:border-slate-700"}
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute top-3 right-3 w-5 h-5 rounded-full ${colorClasses.bg} flex items-center justify-center`}
        >
          <Check className={`w-3 h-3 ${colorClasses.text}`} />
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`
            p-2 rounded-lg
            ${isSelected ? colorClasses.bg : "bg-slate-800/50"}
          `}
        >
          <IconComponent
            className={`w-5 h-5 ${isSelected ? colorClasses.text : "text-slate-400"}`}
          />
        </div>
        <div>
          <h3 className={`font-semibold ${isSelected ? colorClasses.text : "text-white"}`}>
            {option.label}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{option.description}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Role Selector Component
// ============================================================================
interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Select your role
      </label>
      <div className="flex flex-col gap-3">
        {roleOptions.map((option, index) => (
          <motion.div
            key={option.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RoleCard
              option={option}
              isSelected={selectedRole === option.role}
              onSelect={onSelectRole}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
