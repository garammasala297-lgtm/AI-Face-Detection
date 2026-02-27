"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Brain,
  Linkedin,
  Globe,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Gavel,
  HeartHandshake,
} from "lucide-react";
import { judgeMentorSchema, type JudgeMentorFormData } from "@/lib/validations";

const domains = [
  { value: "AI_ML", label: "AI / Machine Learning" },
  { value: "WEB3", label: "Web3 / Blockchain" },
  { value: "FULL_STACK", label: "Full Stack Development" },
  { value: "MOBILE", label: "Mobile Development" },
  { value: "CYBERSECURITY", label: "Cybersecurity" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "DEVOPS", label: "DevOps / Cloud" },
  { value: "GAME_DEV", label: "Game Development" },
  { value: "IOT", label: "IoT / Hardware" },
  { value: "OTHER", label: "Other" },
];

export default function JudgeMentorForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JudgeMentorFormData>({
    resolver: zodResolver(judgeMentorSchema),
    defaultValues: { subRole: "JUDGE" },
  });

  const subRole = watch("subRole");

  const onSubmit = async (data: JudgeMentorFormData) => {
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/register/judge-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setApiError(json.error || "Registration failed");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12"
      >
        <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center">
          <CheckCircle2 className="text-neon-purple" size={32} />
        </div>
        <h3 className="text-xl font-bold">
          {subRole === "JUDGE" ? "Judge" : "Mentor"} Account Created!
        </h3>
        <p className="text-zinc-400 text-sm text-center">
          You&apos;ve been linked to the hackathon. Sign in to continue.
        </p>
        <button onClick={() => window.location.reload()} className="neon-btn-purple mt-2">
          Go to Login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {apiError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
        >
          {apiError}
        </motion.div>
      )}

      {/* Sub-role Toggle */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-2 block">Role Type</label>
        <div className="flex gap-2">
          {(["JUDGE", "MENTOR"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setValue("subRole", r)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                subRole === r
                  ? r === "JUDGE"
                    ? "bg-neon-purple/15 border-neon-purple/40 text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : "bg-neon-blue/15 border-neon-blue/40 text-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                  : "bg-white/[0.03] border-white/10 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {r === "JUDGE" ? <Gavel size={16} /> : <HeartHandshake size={16} />}
              {r === "JUDGE" ? "Judge" : "Mentor"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600 mt-1.5">
          {subRole === "JUDGE"
            ? "Judges get post-event evaluation access to all team dashboards."
            : "Mentors get real-time access to help tickets and inactivity alerts."}
        </p>
      </motion.div>

      {/* Full Name */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5"><User size={12} /> Full Name</label>
        <input {...register("fullName")} placeholder="Jane Smith" className="glass-input" />
        {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
      </motion.div>

      {/* Email */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5"><Mail size={12} /> Email</label>
        <input {...register("email")} type="email" placeholder="jane@company.com" className="glass-input" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5"><Lock size={12} /> Password</label>
        <div className="relative">
          <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="glass-input pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5"><Lock size={12} /> Confirm Password</label>
        <div className="relative">
          <input {...register("confirmPassword")} type={showConfirm ? "text" : "password"} placeholder="••••••••" className="glass-input pr-10" />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </motion.div>

      {/* Access Token */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5"><KeyRound size={12} /> Hackathon Access Token</label>
        <input {...register("accessToken")} placeholder="Provided by the organizer" className="glass-input font-mono text-sm" />
        {errors.accessToken && <p className="text-red-400 text-xs mt-1">{errors.accessToken.message}</p>}
      </motion.div>

      {/* Domain Expertise */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5"><Brain size={12} /> Domain Expertise</label>
        <select {...register("domainExpertise")} className="glass-select">
          <option value="" className="bg-zinc-900">Select your domain...</option>
          {domains.map((d) => <option key={d.value} value={d.value} className="bg-zinc-900">{d.label}</option>)}
        </select>
        {errors.domainExpertise && <p className="text-red-400 text-xs mt-1">{errors.domainExpertise.message}</p>}
      </motion.div>

      {/* LinkedIn */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Linkedin size={12} /> LinkedIn URL <span className="text-zinc-600">(optional)</span>
        </label>
        <input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/janesmith" className="glass-input" />
        {errors.linkedinUrl && <p className="text-red-400 text-xs mt-1">{errors.linkedinUrl.message}</p>}
      </motion.div>

      {/* Portfolio */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Globe size={12} /> Portfolio URL <span className="text-zinc-600">(optional)</span>
        </label>
        <input {...register("portfolioUrl")} placeholder="https://janesmith.dev" className="glass-input" />
        {errors.portfolioUrl && <p className="text-red-400 text-xs mt-1">{errors.portfolioUrl.message}</p>}
      </motion.div>

      {/* Availability (Mentor only) */}
      {subRole === "MENTOR" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <label className="text-xs text-zinc-400 flex items-center gap-1.5"><Clock size={12} /> Availability / Shift Hours</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 mb-1 block">Start Time</label>
              <input {...register("availabilityStart")} type="time" className="glass-input" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 mb-1 block">End Time</label>
              <input {...register("availabilityEnd")} type="time" className="glass-input" />
            </div>
          </div>
          {errors.availabilityStart && <p className="text-red-400 text-xs">{errors.availabilityStart.message}</p>}
        </motion.div>
      )}

      {/* Conflict of Interest */}
      <motion.div variants={itemVariants}>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" {...register("conflictOfInterest")} className="mt-1 accent-neon-purple" />
          <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
            <ShieldAlert size={12} className="inline mr-1 text-neon-purple" />
            I declare that I have <span className="text-neon-purple">no conflict of interest</span> with any
            participating team and will evaluate projects impartially.
          </span>
        </label>
        {errors.conflictOfInterest && <p className="text-red-400 text-xs ml-6">{errors.conflictOfInterest.message}</p>}
      </motion.div>

      <motion.div variants={itemVariants}>
        <button type="submit" disabled={submitting} className={`w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 ${subRole === "JUDGE" ? "neon-btn-purple" : "neon-btn-blue"}`}>
          {subRole === "JUDGE" ? <Gavel size={18} /> : <HeartHandshake size={18} />}
          {submitting ? "Creating Account..." : `Register as ${subRole === "JUDGE" ? "Judge" : "Mentor"}`}
        </button>
      </motion.div>
    </motion.form>
  );
}
