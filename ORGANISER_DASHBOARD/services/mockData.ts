// ============================================================================
// Mock Data Service - Organizer Dashboard
// ============================================================================

import type {
  OrganizerDashboardState,
  HackathonOverview,
  LiveActivityMonitor,
  RuleComplianceLocation,
  MentorSupportAlerts,
  RuleConfiguration,
  TeamDetails,
} from "../types";

// Helper to generate random data
const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================================
// Mock Hackathon Overview
// ============================================================================
export const mockHackathonOverview: HackathonOverview = {
  totalRegisteredTeams: 48,
  activeTeamsCount: 42,
  inactiveTeamsCount: 6,
  averageCommitsPerTeam: 127,
  totalCommits: 6096,
  totalPullRequests: 892,
  averageFairnessScore: 87.4,
};

// ============================================================================
// Mock Live Activity Monitor
// ============================================================================
export const mockLiveActivity: LiveActivityMonitor = {
  realTimeActivityHeatmap: [
    { hour: "00:00", intensity: 15, commits: 23, teamCount: 8 },
    { hour: "02:00", intensity: 8, commits: 12, teamCount: 5 },
    { hour: "04:00", intensity: 5, commits: 7, teamCount: 3 },
    { hour: "06:00", intensity: 12, commits: 18, teamCount: 7 },
    { hour: "08:00", intensity: 45, commits: 67, teamCount: 28 },
    { hour: "10:00", intensity: 78, commits: 124, teamCount: 38 },
    { hour: "12:00", intensity: 65, commits: 98, teamCount: 35 },
    { hour: "14:00", intensity: 92, commits: 156, teamCount: 42 },
    { hour: "16:00", intensity: 88, commits: 142, teamCount: 40 },
    { hour: "18:00", intensity: 75, commits: 118, teamCount: 36 },
    { hour: "20:00", intensity: 82, commits: 134, teamCount: 38 },
    { hour: "22:00", intensity: 58, commits: 89, teamCount: 32 },
  ],
  teamsCurrentlyCoding: [
    "Team Alpha",
    "Code Crusaders",
    "Binary Builders",
    "Pixel Pirates",
    "Data Dynamos",
    "Cloud Chasers",
    "React Rangers",
    "Node Ninjas",
  ],
  teamsIdleForLongTime: [
    "Team Omega",
    "Lazy Loaders",
    "Timeout Tribe",
  ],
  recentCommits: [
    {
      id: "c1",
      team: "Team Alpha",
      message: "feat: Implement user authentication",
      timestamp: "2 min ago",
      author: "alice_dev",
    },
    {
      id: "c2",
      team: "Code Crusaders",
      message: "fix: Resolve API endpoint issues",
      timestamp: "5 min ago",
      author: "bob_coder",
    },
    {
      id: "c3",
      team: "Binary Builders",
      message: "style: Update dashboard UI",
      timestamp: "8 min ago",
      author: "carol_ui",
    },
    {
      id: "c4",
      team: "Pixel Pirates",
      message: "docs: Add API documentation",
      timestamp: "12 min ago",
      author: "dave_docs",
    },
    {
      id: "c5",
      team: "Data Dynamos",
      message: "refactor: Optimize database queries",
      timestamp: "15 min ago",
      author: "eve_db",
    },
  ],
  peakActivityTime: "14:00 - 16:00",
};

// ============================================================================
// Mock Rule Compliance & Location
// ============================================================================
export const mockCompliance: RuleComplianceLocation = {
  teamsFullyCompliant: 38,
  teamsWithWarnings: 7,
  teamsWithMajorViolations: 3,
  onSiteTeamsCount: 32,
  mixedLocationTeams: 12,
  outsideGeoFenceTeams: 4,
  complianceHistory: [
    { time: "00:00", compliant: 45, warnings: 2, violations: 1 },
    { time: "04:00", compliant: 44, warnings: 3, violations: 1 },
    { time: "08:00", compliant: 42, warnings: 4, violations: 2 },
    { time: "12:00", compliant: 40, warnings: 5, violations: 3 },
    { time: "16:00", compliant: 38, warnings: 7, violations: 3 },
    { time: "20:00", compliant: 38, warnings: 7, violations: 3 },
  ],
  violationTypes: [
    { type: "Suspicious commit timing", count: 5, severity: "medium" },
    { type: "External contributor", count: 3, severity: "high" },
    { type: "Copy-paste detection", count: 4, severity: "medium" },
    { type: "Location mismatch", count: 4, severity: "low" },
    { type: "Inactive period", count: 6, severity: "low" },
  ],
};

// ============================================================================
// Mock Mentor Support Alerts
// ============================================================================
export const mockAlerts: MentorSupportAlerts = {
  teamsInactiveForXHours: [
    {
      teamName: "Team Omega",
      teamId: "t-omega",
      issue: "No commits for 4+ hours",
      duration: "4h 23m",
      severity: "warning",
      timestamp: "Started 4h ago",
    },
    {
      teamName: "Lazy Loaders",
      teamId: "t-lazy",
      issue: "No commits for 6+ hours",
      duration: "6h 12m",
      severity: "critical",
      timestamp: "Started 6h ago",
    },
    {
      teamName: "Timeout Tribe",
      teamId: "t-timeout",
      issue: "No commits for 3+ hours",
      duration: "3h 45m",
      severity: "warning",
      timestamp: "Started 3h ago",
    },
  ],
  teamsWithRepeatedBuildFailures: [
    {
      teamName: "Bug Bashers",
      teamId: "t-bugs",
      issue: "12 consecutive build failures",
      duration: "Last 2 hours",
      severity: "critical",
      timestamp: "Latest failure 5m ago",
    },
    {
      teamName: "Error Explorers",
      teamId: "t-error",
      issue: "8 consecutive build failures",
      duration: "Last 1.5 hours",
      severity: "warning",
      timestamp: "Latest failure 12m ago",
    },
  ],
  teamsWithVeryLowActivity: [
    {
      teamName: "Slow Starters",
      teamId: "t-slow",
      issue: "Only 12 commits total",
      duration: "Since start",
      severity: "info",
      timestamp: "Avg 0.5 commits/hour",
    },
    {
      teamName: "Minimal Makers",
      teamId: "t-minimal",
      issue: "Only 18 commits total",
      duration: "Since start",
      severity: "info",
      timestamp: "Avg 0.8 commits/hour",
    },
  ],
  teamsNeedingUrgentHelp: [
    {
      teamName: "Help Seekers",
      teamId: "t-help",
      issue: "Requested mentor support",
      duration: "Waiting 15m",
      severity: "critical",
      timestamp: "Request at 14:32",
    },
  ],
  totalActiveAlerts: 9,
};

// ============================================================================
// Mock Rule Configuration
// ============================================================================
export const mockConfiguration: RuleConfiguration = {
  hackathonTimeWindow: {
    start: "2026-02-27T09:00:00",
    end: "2026-02-28T21:00:00",
  },
  allowedLocations: "Building A, Building B, Remote (with VPN)",
  offlineWorkAllowed: false,
  scoringWeightAdjustment: {
    commits: 25,
    codeQuality: 30,
    collaboration: 15,
    consistency: 15,
    innovation: 15,
  },
  hackathonStatus: "live",
  maxTeamSize: 4,
  minCommitInterval: 5,
  autoDisqualifyInactiveHours: 8,
};

// ============================================================================
// Mock Teams
// ============================================================================
export const mockTeams: TeamDetails[] = [
  {
    id: "t-alpha",
    name: "Team Alpha",
    members: ["alice_dev", "alex_code", "amy_ui", "aaron_db"],
    commits: 156,
    lastActivity: "2 min ago",
    complianceStatus: "compliant",
    location: "on-site",
    fairnessScore: 94,
  },
  {
    id: "t-crusaders",
    name: "Code Crusaders",
    members: ["bob_coder", "betty_dev", "brian_api"],
    commits: 142,
    lastActivity: "5 min ago",
    complianceStatus: "compliant",
    location: "on-site",
    fairnessScore: 92,
  },
  {
    id: "t-builders",
    name: "Binary Builders",
    members: ["carol_ui", "charlie_back", "cathy_full", "chris_dev"],
    commits: 138,
    lastActivity: "8 min ago",
    complianceStatus: "compliant",
    location: "mixed",
    fairnessScore: 88,
  },
  {
    id: "t-pirates",
    name: "Pixel Pirates",
    members: ["dave_docs", "diana_ux", "derek_fe"],
    commits: 124,
    lastActivity: "12 min ago",
    complianceStatus: "warning",
    location: "remote",
    fairnessScore: 78,
  },
  {
    id: "t-omega",
    name: "Team Omega",
    members: ["oscar_lazy", "olivia_slow"],
    commits: 45,
    lastActivity: "4h 23m ago",
    complianceStatus: "warning",
    location: "on-site",
    fairnessScore: 65,
  },
  {
    id: "t-bugs",
    name: "Bug Bashers",
    members: ["frank_fix", "fiona_debug", "felix_test"],
    commits: 89,
    lastActivity: "5 min ago",
    complianceStatus: "violation",
    location: "on-site",
    fairnessScore: 52,
  },
];

// ============================================================================
// Full Dashboard State
// ============================================================================
export const mockDashboardState: OrganizerDashboardState = {
  overview: mockHackathonOverview,
  liveActivity: mockLiveActivity,
  compliance: mockCompliance,
  alerts: mockAlerts,
  configuration: mockConfiguration,
  teams: mockTeams,
  isLoading: false,
  lastUpdated: "2026-02-27T00:00:00.000Z", // Static to avoid hydration mismatch
};

// ============================================================================
// Service Functions
// ============================================================================
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  async fetchDashboardData(): Promise<OrganizerDashboardState> {
    await delay(800);
    return {
      ...mockDashboardState,
      lastUpdated: new Date().toISOString(),
    };
  },

  async updateConfiguration(config: Partial<RuleConfiguration>): Promise<RuleConfiguration> {
    await delay(500);
    return { ...mockConfiguration, ...config };
  },

  async updateHackathonStatus(status: "not-started" | "live" | "ended"): Promise<void> {
    await delay(1000);
  },

  async generateReports(): Promise<{ url: string }> {
    await delay(2000);
    return { url: "/reports/hackathon-summary-2026.pdf" };
  },

  async dismissAlert(alertId: string): Promise<void> {
    await delay(300);
  },

  async sendMentorToTeam(teamId: string): Promise<void> {
    await delay(500);
  },

  getActivityColor(intensity: number): string {
    if (intensity < 20) return "#1e293b";
    if (intensity < 40) return "#7c3aed";
    if (intensity < 60) return "#8b5cf6";
    if (intensity < 80) return "#a78bfa";
    return "#c4b5fd";
  },
};
