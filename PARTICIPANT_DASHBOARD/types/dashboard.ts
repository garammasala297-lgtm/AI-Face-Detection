// ============================================================================
// DASHBOARD TYPES & INTERFACES
// ============================================================================

export type LocationStatus = "On-site" | "Mixed" | "Outside";

export interface TeamMember {
  username: string;
  avatarUrl?: string;
}

export interface BasicInfo {
  teamName: string;
  hackathonName: string;
  repoLink: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  teamMembers: string[];
}

export interface HourWiseCommit {
  hour: string;
  commits: number;
}

export interface CommitActivity {
  totalCommits: number;
  commitsInsideWindowPct: number;
  commitsOutsideWindowCount: number;
  hourWiseTimeline: HourWiseCommit[];
}

export interface LocationCompliance {
  locationStatus: LocationStatus;
  geoFenceRuleSummary: string;
  isCompliant: boolean;
}

export interface MemberStat {
  username: string;
  commitsCount: number;
  linesAdded: number;
  linesDeleted: number;
  contributionPercentage: number;
}

export interface ContributionBreakdown {
  memberStats: MemberStat[];
}

export interface FairnessIndicator {
  teamFairnessScore: number;
  balanceStatus: string;
  dominanceWarning: string | null;
}

export interface DetectedFlag {
  id: number;
  flagName: string;
  reason: string;
  explained: boolean;
  explanation?: string;
}

export interface LearningSummary {
  strengths: string[];
  improvements: string[];
  collaborationFeedback: string[];
}

export interface TransparencyFlags {
  detectedFlags: DetectedFlag[];
  learningSummary: LearningSummary;
}

export interface DashboardData {
  basicInfo: BasicInfo;
  commitActivity: CommitActivity;
  locationCompliance: LocationCompliance;
  contributionBreakdown: ContributionBreakdown;
  fairnessIndicator: FairnessIndicator;
  transparencyFlags: TransparencyFlags;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Toast notification types
export interface Toast {
  id: number;
  type: "warning" | "alert" | "success" | "info";
  title: string;
  message: string;
}

// Mentor help request
export interface MentorHelpRequest {
  teamId: string;
  message: string;
  priority: "low" | "medium" | "high";
  timestamp: string;
}

// Flag explanation submission
export interface FlagExplanation {
  flagId: number;
  explanation: string;
  submittedAt: string;
}
