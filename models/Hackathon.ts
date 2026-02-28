// ============================================================================
// Hackathon Model (Mongoose)
// ============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHackathon extends Document {
  name: string;
  eventCode: string;
  judgeMentorAccessToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema = new Schema<IHackathon>(
  {
    name: { type: String, required: true },
    eventCode: { type: String, required: true, unique: true },
    judgeMentorAccessToken: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Hackathon: Model<IHackathon> =
  mongoose.models.Hackathon ||
  mongoose.model<IHackathon>("Hackathon", HackathonSchema);

export default Hackathon;
