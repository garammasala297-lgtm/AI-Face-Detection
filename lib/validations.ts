import { z } from "zod";

// ─── Shared ──────────────────────────────────────────────────────
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const githubRepoUrlSchema = z
  .string()
  .url("Must be a valid URL")
  .regex(
    /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+\/?$/,
    "Must be a valid GitHub repository URL (https://github.com/owner/repo)"
  );

const githubUsernameSchema = z
  .string()
  .min(1, "GitHub username is required")
  .regex(
    /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
    "Invalid GitHub username format"
  );

// ─── Participant Schema ──────────────────────────────────────────
export const participantSchema = z.object({
  inviteCode: z
    .string()
    .min(4, "Invite code must be at least 4 characters")
    .max(50, "Invite code is too long"),
  teamName: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name is too long"),
  teammates: z
    .array(githubUsernameSchema)
    .min(1, "At least one teammate is required")
    .max(5, "Maximum 5 teammates allowed"),
  repoUrl: githubRepoUrlSchema,
  techStack: z
    .array(z.string())
    .min(1, "Select at least one technology"),
  preferredEmail: z
    .string()
    .email("Must be a valid email address"),
  consentCommitTracking: z
    .literal(true, {
      errorMap: () => ({ message: "You must agree to commit tracking" }),
    }),
  consentLocationAccess: z
    .literal(true, {
      errorMap: () => ({ message: "You must consent to location access" }),
    }),
});

// ─── Organizer Schema ────────────────────────────────────────────
export const organizerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  password: passwordSchema,
  confirmPassword: z.string(),
  organizationName: z.string().min(2, "Organization name is required"),
  contactPhone: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number (e.g., +1234567890)"),
  designation: z.enum(
    [
      "LEAD_ORGANIZER",
      "TECHNICAL_COORDINATOR",
      "EVENT_MANAGER",
      "VOLUNTEER_LEAD",
      "SPONSORSHIP_LEAD",
    ],
    { errorMap: () => ({ message: "Select a designation" }) }
  ),
  organizationLogo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ─── Judge / Mentor Schema ───────────────────────────────────────
export const judgeMentorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  password: passwordSchema,
  confirmPassword: z.string(),
  subRole: z.enum(["JUDGE", "MENTOR"], {
    errorMap: () => ({ message: "Select Judge or Mentor" }),
  }),
  accessToken: z.string().min(4, "Access token is required"),
  domainExpertise: z.enum(
    [
      "AI_ML",
      "WEB3",
      "FULL_STACK",
      "MOBILE",
      "CYBERSECURITY",
      "DATA_SCIENCE",
      "DEVOPS",
      "GAME_DEV",
      "IOT",
      "OTHER",
    ],
    { errorMap: () => ({ message: "Select your domain" }) }
  ),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .regex(/linkedin\.com/, "Must be a LinkedIn URL")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  availabilityStart: z.string().optional(),
  availabilityEnd: z.string().optional(),
  conflictOfInterest: z.literal(true, {
    errorMap: () => ({
      message: "You must declare no conflict of interest",
    }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.subRole === "MENTOR") {
      return !!data.availabilityStart && !!data.availabilityEnd;
    }
    return true;
  },
  { message: "Mentors must specify availability hours", path: ["availabilityStart"] }
);

// ─── Login Schema ────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;
export type OrganizerFormData = z.infer<typeof organizerSchema>;
export type JudgeMentorFormData = z.infer<typeof judgeMentorSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
