// ============================================================================
// Admin Seed Script — creates the initial admin account
// ============================================================================
// Run with: npx tsx scripts/seed-admin.ts
// Requires MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@commitlens.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe!Str0ng";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set. Add it to .env.local");
  process.exit(1);
}

// Inline schema for the seed script (avoids import issues)
const UserSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    passwordHash: { type: String },
    githubId: { type: String, unique: true, sparse: true },
    githubUsername: { type: String },
  },
  { timestamps: true, strict: false }
);

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  // Check if admin already exists
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`⚠️  Admin account already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await User.create({
    role: "admin",
    name: "CommitLens Admin",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
  });

  console.log(`✅ Admin account created: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log("   ⚠️  Change this password after first login!");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
