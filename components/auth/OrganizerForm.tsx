"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  Briefcase,
  Image,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { organizerSchema, type OrganizerFormData } from "@/lib/validations";

const designations = [
  { value: "LEAD_ORGANIZER", label: "Lead Organizer" },
  { value: "TECHNICAL_COORDINATOR", label: "Technical Coordinator" },
  { value: "EVENT_MANAGER", label: "Event Manager" },
  { value: "VOLUNTEER_LEAD", label: "Volunteer Lead" },
  { value: "SPONSORSHIP_LEAD", label: "Sponsorship Lead" },
];

export default function OrganizerForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizerFormData>({
    resolver: zodResolver(organizerSchema),
  });

  const onSubmit = async (data: OrganizerFormData) => {
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/register/organizer", {
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
        <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center">
          <CheckCircle2 className="text-neon-blue" size={32} />
        </div>
        <h3 className="text-xl font-bold">Account Created!</h3>
        <p className="text-zinc-400 text-sm text-center">
          You can now sign in with your credentials.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="neon-btn-blue mt-2"
        >
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

      {/* Full Name */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <User size={12} /> Full Name
        </label>
        <input {...register("fullName")} placeholder="John Doe" className="glass-input" />
        {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
      </motion.div>

      {/* Email */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Mail size={12} /> Work Email
        </label>
        <input {...register("email")} type="email" placeholder="john@university.edu" className="glass-input" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Lock size={12} /> Password
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="glass-input pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Lock size={12} /> Confirm Password
        </label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            className="glass-input pr-10"
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </motion.div>

      {/* Organization Name */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Building2 size={12} /> Organization / University
        </label>
        <input {...register("organizationName")} placeholder="MIT, Google, etc." className="glass-input" />
        {errors.organizationName && <p className="text-red-400 text-xs mt-1">{errors.organizationName.message}</p>}
      </motion.div>

      {/* Phone */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Phone size={12} /> Contact Phone
        </label>
        <input {...register("contactPhone")} placeholder="+1234567890" className="glass-input" />
        {errors.contactPhone && <p className="text-red-400 text-xs mt-1">{errors.contactPhone.message}</p>}
      </motion.div>

      {/* Designation */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Briefcase size={12} /> Role / Designation
        </label>
        <select {...register("designation")} className="glass-select">
          <option value="" className="bg-zinc-900">Select designation...</option>
          {designations.map((d) => (
            <option key={d.value} value={d.value} className="bg-zinc-900">{d.label}</option>
          ))}
        </select>
        {errors.designation && <p className="text-red-400 text-xs mt-1">{errors.designation.message}</p>}
      </motion.div>

      {/* Logo URL */}
      <motion.div variants={itemVariants}>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Image size={12} /> Organization Logo URL
          <span className="text-zinc-600">(optional)</span>
        </label>
        <input {...register("organizationLogo")} placeholder="https://example.com/logo.png" className="glass-input" />
        {errors.organizationLogo && <p className="text-red-400 text-xs mt-1">{errors.organizationLogo.message}</p>}
      </motion.div>

      <motion.div variants={itemVariants}>
        <button type="submit" disabled={submitting} className="w-full neon-btn-blue flex items-center justify-center gap-2 py-3.5 disabled:opacity-50">
          <Building2 size={18} />
          {submitting ? "Creating Account..." : "Create Organizer Account"}
        </button>
      </motion.div>
    </motion.form>
  );
}
