"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Github } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    setApiError("");
    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setApiError("Invalid email or password");
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGitHubSignIn = async () => {
    const { signIn } = await import("next-auth/react");
    await signIn("github", { callbackUrl: "/auth" });
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {apiError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs error-shake">
          {apiError}
        </div>
      )}

      <div>
        <label className="text-xs text-zinc-400 mb-1.5 flex items-center gap-1.5">
          <Mail size={12} /> Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@email.com"
          className="glass-input"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full neon-btn-blue flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
      >
        <LogIn size={18} />
        {submitting ? "Signing in..." : "Sign In"}
      </button>

      <div className="relative flex items-center gap-4 py-1">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] text-zinc-600 uppercase">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGitHubSignIn}
        className="w-full neon-btn-green flex items-center justify-center gap-2 py-3.5"
      >
        <Github size={18} />
        Sign in with GitHub
      </button>
    </motion.form>
  );
}
