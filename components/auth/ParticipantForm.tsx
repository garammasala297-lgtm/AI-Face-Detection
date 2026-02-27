"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Github,
  Ticket,
  Users,
  GitFork,
  Cpu,
  Mail,
  Shield,
  MapPin,
  X,
  Plus,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { participantSchema, type ParticipantFormData } from "@/lib/validations";

const STORAGE_KEY = "commitlens_participant_form";

const techOptions = [
  "React", "Next.js", "Vue", "Angular", "Node.js", "Python", "Go", "Rust",
  "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Firebase",
  "TensorFlow", "Solidity", "Flutter", "Swift", "Kotlin",
];

export default function ParticipantForm() {
  const [teammates, setTeammates] = useState<string[]>([""]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [completingRegistration, setCompletingRegistration] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      teammates: [""],
      techStack: [],
      consentCommitTracking: false as any,
      consentLocationAccess: false as any,
    },
  });

  // On mount, check if we're returning from GitHub OAuth with saved form data
  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as ParticipantFormData;
        // We have saved form data — complete the registration
        setCompletingRegistration(true);
        completeRegistration(parsed);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  async function completeRegistration(data: ParticipantFormData) {
    try {
      const res = await fetch("/api/register/participant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        sessionStorage.removeItem(STORAGE_KEY);
        setSuccess(true);
      } else {
        setApiError(json.error || "Registration failed. Please try again.");
        setCompletingRegistration(false);
      }
    } catch {
      setApiError("Network error. Please try again.");
      setCompletingRegistration(false);
    }
  }

  const addTeammate = () => {
    if (teammates.length < 5) {
      const updated = [...teammates, ""];
      setTeammates(updated);
    }
  };

  const removeTeammate = (index: number) => {
    if (teammates.length > 1) {
      const updated = teammates.filter((_, i) => i !== index);
      setTeammates(updated);
      setValue("teammates", updated);
    }
  };

  const updateTeammate = (index: number, value: string) => {
    const updated = [...teammates];
    updated[index] = value;
    setTeammates(updated);
    setValue("teammates", updated);
  };

  const toggleTech = (tech: string) => {
    const updated = selectedTech.includes(tech)
      ? selectedTech.filter((t) => t !== tech)
      : [...selectedTech, tech];
    setSelectedTech(updated);
    setValue("techStack", updated);
  };

  const onSubmit = async (data: ParticipantFormData) => {
    setSubmitting(true);
    setApiError("");
    try {
      // Save form data to sessionStorage so we can retrieve it after GitHub OAuth
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // Redirect to GitHub OAuth via Auth.js
      // After sign-in, GitHub redirects back to /auth where the form picks up saved data
      const { signIn } = await import("next-auth/react");
      await signIn("github", { callbackUrl: "/auth" });
    } catch {
      setApiError("Failed to initiate GitHub sign-in. Please try again.");
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  if (completingRegistration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12"
      >
        <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center">
          <Loader2 className="text-neon-green animate-spin" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white">Completing Registration...</h3>
        <p className="text-zinc-400 text-sm text-center">
          Saving your hackathon details with your GitHub account.
        </p>
      </motion.div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12"
      >
        <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center">
          <CheckCircle2 className="text-neon-green" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white">Registration Complete!</h3>
        <p className="text-zinc-400 text-sm text-center">
          You&apos;re signed in with GitHub and linked to the hackathon.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {apiError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs error-shake"
        >
          {apiError}
        </motion.div>
      )}

      {/* GitHub Sign-in CTA */}
      <motion.div variants={itemVariants}>
        <p className="text-xs text-zinc-500 mb-3">
          Fill out your hackathon details below. Clicking &ldquo;Sign in with GitHub&rdquo;
          will authenticate you via GitHub OAuth and register your team.
        </p>
      </motion.div>

      {/* Invite Code */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Ticket size={12} /> Hackathon Invite Code
        </label>
        <input
          {...register("inviteCode")}
          placeholder="e.g., HACKFEST-2025-ABCD"
          className="glass-input"
        />
        {errors.inviteCode && (
          <p className="text-red-400 text-xs mt-1">{errors.inviteCode.message}</p>
        )}
      </motion.div>

      {/* Team Name */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Users size={12} /> Team Name
        </label>
        <input
          {...register("teamName")}
          placeholder="Code Crusaders"
          className="glass-input"
        />
        {errors.teamName && (
          <p className="text-red-400 text-xs mt-1">{errors.teamName.message}</p>
        )}
      </motion.div>

      {/* Teammates */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Github size={12} /> Teammate GitHub Usernames
        </label>
        <div className="space-y-2">
          {teammates.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={t}
                onChange={(e) => updateTeammate(i, e.target.value)}
                placeholder={`teammate${i + 1}`}
                className="glass-input flex-1"
              />
              {teammates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTeammate(i)}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {teammates.length < 5 && (
            <button
              type="button"
              onClick={addTeammate}
              className="flex items-center gap-1.5 text-xs text-neon-green/70 hover:text-neon-green transition-colors"
            >
              <Plus size={12} /> Add teammate
            </button>
          )}
        </div>
        {errors.teammates && (
          <p className="text-red-400 text-xs mt-1">
            {errors.teammates.message || errors.teammates.root?.message}
          </p>
        )}
      </motion.div>

      {/* Repository URL */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <GitFork size={12} /> GitHub Repository URL
        </label>
        <input
          {...register("repoUrl")}
          placeholder="https://github.com/team/project"
          className="glass-input font-mono text-sm"
        />
        {errors.repoUrl && (
          <p className="text-red-400 text-xs mt-1">{errors.repoUrl.message}</p>
        )}
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Cpu size={12} /> Primary Tech Stack
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-white/[0.02] rounded-xl border border-white/5">
          {techOptions.map((tech) => (
            <button
              type="button"
              key={tech}
              onClick={() => toggleTech(tech)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedTech.includes(tech)
                  ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                  : "bg-white/5 text-zinc-500 border border-white/5 hover:text-zinc-300"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
        {errors.techStack && (
          <p className="text-red-400 text-xs mt-1">{errors.techStack.message}</p>
        )}
      </motion.div>

      {/* Preferred Email */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Mail size={12} /> Preferred Contact Email
        </label>
        <input
          {...register("preferredEmail")}
          type="email"
          placeholder="you@email.com"
          className="glass-input"
        />
        {errors.preferredEmail && (
          <p className="text-red-400 text-xs mt-1">
            {errors.preferredEmail.message}
          </p>
        )}
      </motion.div>

      {/* Consents */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("consentCommitTracking")}
            className="mt-1 accent-neon-green"
          />
          <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
            <Shield size={12} className="inline mr-1 text-neon-green" />
            I agree to the <span className="text-neon-green">transparency policy</span> for
            live commit tracking and analysis during the hackathon.
          </span>
        </label>
        {errors.consentCommitTracking && (
          <p className="text-red-400 text-xs ml-6">
            {errors.consentCommitTracking.message}
          </p>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("consentLocationAccess")}
            className="mt-1 accent-neon-green"
          />
          <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
            <MapPin size={12} className="inline mr-1 text-neon-blue" />
            I consent to <span className="text-neon-blue">location access</span> via IP
            tracking for geo-fence verification.
          </span>
        </label>
        {errors.consentLocationAccess && (
          <p className="text-red-400 text-xs ml-6">
            {errors.consentLocationAccess.message}
          </p>
        )}
      </motion.div>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <button
          type="submit"
          disabled={submitting}
          className="w-full neon-btn-green flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
        >
          <Github size={18} />
          {submitting ? "Saving..." : "Save Details & Sign in with GitHub"}
        </button>
      </motion.div>
    </motion.form>
  );
}
