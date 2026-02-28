// ============================================================================
// Organizer Dashboard Types
// ============================================================================

// Hackathon Overview
export interface HackathonOverview {
  totalRegisteredTeams: number;
  activeTeamsCount: number;
  inactiveTeamsCount: number;
  averageCommitsPerTeam: number;
  totalCommits: number;
  totalPullRequests: number;
  averageFairnessScore: number;
}

// Live Activity Monitor
export interface ActivityDataPoint {
  hour: string;
  intensity: number;
  commits: number;
  teamCount: number;
}

export interface LiveActivityMonitor {
  realTimeActivityHeatmap: ActivityDataPoint[];
  teamsCurrentlyCoding: string[];
  teamsIdleForLongTime: string[];
  recentCommits: RecentCommit[];
  peakActivityTime: string;
}

export interface RecentCommit {
  id: string;
  team: string;
  message: string;
  timestamp: string;
  author: string;
}

// Rule Compliance & Location
export interface RuleComplianceLocation {
  teamsFullyCompliant: number;
  teamsWithWarnings: number;
  teamsWithMajorViolations: number;
  onSiteTeamsCount: number;
  mixedLocationTeams: number;
  outsideGeoFenceTeams: number;
  complianceHistory: ComplianceHistoryPoint[];
  violationTypes: ViolationType[];
}

export interface ComplianceHistoryPoint {
  time: string;
  compliant: number;
  warnings: number;
  violations: number;
}

export interface ViolationType {
  type: string;
  count: number;
  severity: "low" | "medium" | "high";
}

// Mentor Support Alerts
export interface MentorSupportAlerts {
  teamsInactiveForXHours: TeamAlert[];
  teamsWithRepeatedBuildFailures: TeamAlert[];
  teamsWithVeryLowActivity: TeamAlert[];
  teamsNeedingUrgentHelp: TeamAlert[];
  totalActiveAlerts: number;
}

export interface TeamAlert {
  teamName: string;
  teamId: string;
  issue: string;
  duration: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
}

// Rule Configuration
export type HackathonStatus = "not-started" | "live" | "ended";

export interface TimeWindow {
  start: string;
  end: string;
}

export interface ScoringWeights {
  commits: number;
  codeQuality: number;
  collaboration: number;
  consistency: number;
  innovation: number;
}

export interface RuleConfiguration {
  hackathonTimeWindow: TimeWindow;
  allowedLocations: string;
  offlineWorkAllowed: boolean;
  scoringWeightAdjustment: ScoringWeights;
  hackathonStatus: HackathonStatus;
  maxTeamSize: number;
  minCommitInterval: number;
  autoDisqualifyInactiveHours: number;
}

// Team Details
export interface TeamDetails {
  id: string;
  name: string;
  members: string[];
  commits: number;
  lastActivity: string;
  complianceStatus: "compliant" | "warning" | "violation";
  location: "on-site" | "remote" | "mixed";
  fairnessScore: number;
}

// Toast Notifications
export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

// Dashboard State
export interface OrganizerDashboardState {
  overview: HackathonOverview;
  liveActivity: LiveActivityMonitor;
  compliance: RuleComplianceLocation;
  alerts: MentorSupportAlerts;
  configuration: RuleConfiguration;
  teams: TeamDetails[];
  isLoading: boolean;
  lastUpdated: string;
}
