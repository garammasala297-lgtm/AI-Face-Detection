// ============================================================================
// User Model (Mongoose) — supports participant, organizer, judge, admin roles
// ============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

// ---------------------------------------------------------------------------
// TypeScript interfaces
// ---------------------------------------------------------------------------
export type UserRole = "participant" | "organizer" | "judge" | "admin";

export type OrganizerDesignation =
  | "Lead Organizer"
  | "Technical Coordinator"
  | "Operations"
  | "Sponsorship"
  | "Community"
  | "Other";

export type DomainExpertise =
  | "AI/ML"
  | "Web3"
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Data Science"
  | "Security"
  | "Mobile"
  | "Product"
  | "Design"
  | "Other";

export interface IUser extends Document {
  role: UserRole;
  name: string;
  email: string;
  image?: string;

  // --- Participant (GitHub OAuth) ---
  githubId?: string;
  githubUsername?: string;
  preferredContactEmail?: string;
  consentCommitTracking?: boolean;
  consentIpLocation?: boolean;

  // --- Judge / Organizer / Admin (Email + Password) ---
  passwordHash?: string;

  // --- Organizer-specific ---
  organizationName?: string;
  organizerPhoneNumber?: string;
  organizerDesignation?: OrganizerDesignation;
  organizationLogoUrl?: string;

  // --- Judge-specific ---
  domainExpertise?: DomainExpertise;
  linkedinOrPortfolioUrl?: string;
  availabilityShift?: string;
  conflictOfInterestAccepted?: boolean;
  hackathonAccessToken?: string;

  // --- Team reference (participant) ---
  teamId?: mongoose.Types.ObjectId;

  // --- Hackathon reference (organizer / judge) ---
  hackathonId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["participant", "organizer", "judge", "admin"],
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },

    // Participant (GitHub)
    githubId: { type: String, unique: true, sparse: true },
    githubUsername: { type: String, sparse: true },
    preferredContactEmail: { type: String },
    consentCommitTracking: { type: Boolean, default: false },
    consentIpLocation: { type: Boolean, default: false },

    // Password-based roles
    passwordHash: { type: String },

    // Organizer
    organizationName: { type: String },
    organizerPhoneNumber: { type: String },
    organizerDesignation: {
      type: String,
      enum: [
        "Lead Organizer",
        "Technical Coordinator",
        "Operations",
        "Sponsorship",
        "Community",
        "Other",
      ],
    },
    organizationLogoUrl: { type: String },

    // Judge
    domainExpertise: {
      type: String,
      enum: [
        "AI/ML",
        "Web3",
        "Full Stack",
        "Frontend",
        "Backend",
        "DevOps",
        "Data Science",
        "Security",
        "Mobile",
        "Product",
        "Design",
        "Other",
      ],
    },
    linkedinOrPortfolioUrl: { type: String },
    availabilityShift: { type: String },
    conflictOfInterestAccepted: { type: Boolean, default: false },
    hackathonAccessToken: { type: String },

    // Relations
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    hackathonId: { type: Schema.Types.ObjectId, ref: "Hackathon" },
  },
  { timestamps: true }
);

// Prevent model re-compilation in development (hot-reload safe)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
