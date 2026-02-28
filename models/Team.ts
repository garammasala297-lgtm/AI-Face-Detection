// ============================================================================
// Team Model (Mongoose)
// ============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeam extends Document {
  name: string;
  hackathonId: mongoose.Types.ObjectId;
  memberGithubUsernames: string[];
  repositoryUrl: string;
  primaryTechStack: string[];
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    hackathonId: {
      type: Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
      index: true,
    },
    memberGithubUsernames: [{ type: String }],
    repositoryUrl: { type: String, required: true },
    primaryTechStack: [{ type: String }],
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Compound unique: one team name per hackathon
TeamSchema.index({ hackathonId: 1, name: 1 }, { unique: true });

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
