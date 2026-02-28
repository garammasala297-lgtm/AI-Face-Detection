import type {
  DashboardData,
  ApiResponse,
  MentorHelpRequest,
  FlagExplanation,
  DetectedFlag,
} from "../types";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data generator - in production, this would come from your database
const generateMockData = (teamId: string): DashboardData => ({
  basicInfo: {
    teamName: "CodeCrafters",
    hackathonName: "Diversion 2026",
    repoLink: `https://github.com/${teamId}/hackathon-project`,
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    teamMembers: ["alice-dev", "bob-coder", "charlie-hacker", "diana-js"],
  },
  commitActivity: {
    totalCommits: 147,
    commitsInsideWindowPct: 92,
    commitsOutsideWindowCount: 12,
    hourWiseTimeline: [
      { hour: "09:00", commits: 5 },
      { hour: "10:00", commits: 12 },
      { hour: "11:00", commits: 8 },
      { hour: "12:00", commits: 3 },
      { hour: "13:00", commits: 15 },
      { hour: "14:00", commits: 22 },
      { hour: "15:00", commits: 18 },
      { hour: "16:00", commits: 25 },
      { hour: "17:00", commits: 14 },
      { hour: "18:00", commits: 8 },
      { hour: "19:00", commits: 6 },
      { hour: "20:00", commits: 11 },
    ],
  },
  locationCompliance: {
    locationStatus: "Mixed",
    geoFenceRuleSummary: "All commits must originate within 500m of venue",
    isCompliant: false,
  },
  contributionBreakdown: {
    memberStats: [
      {
        username: "alice-dev",
        commitsCount: 52,
        linesAdded: 2340,
        linesDeleted: 890,
        contributionPercentage: 35,
      },
      {
        username: "bob-coder",
        commitsCount: 38,
        linesAdded: 1560,
        linesDeleted: 420,
        contributionPercentage: 26,
      },
      {
        username: "charlie-hacker",
        commitsCount: 31,
        linesAdded: 1120,
        linesDeleted: 380,
        contributionPercentage: 21,
      },
      {
        username: "diana-js",
        commitsCount: 26,
        linesAdded: 980,
        linesDeleted: 210,
        contributionPercentage: 18,
      },
    ],
  },
  fairnessIndicator: {
    teamFairnessScore: 78,
    balanceStatus: "Moderately Balanced",
    dominanceWarning: "alice-dev has 35% of contributions - monitor for balance",
  },
  transparencyFlags: {
    detectedFlags: [
      {
        id: 1,
        flagName: "Large Time Gap",
        reason: "No commits between 12:00-13:00 (1 hour gap)",
        explained: false,
      },
      {
        id: 2,
        flagName: "External Location",
        reason: "3 commits from IP outside geofence",
        explained: false,
      },
      {
        id: 3,
        flagName: "Unusual Commit Pattern",
        reason: "Bulk commit of 8 files at 16:45",
        explained: true,
        explanation: "Design assets were prepared offline",
      },
    ],
    learningSummary: {
      strengths: [
        "Strong React/TypeScript expertise",
        "Excellent Git workflow practices",
        "Consistent code review participation",
      ],
      improvements: [
        "Add more inline documentation",
        "Consider smaller, atomic commits",
        "Improve test coverage",
      ],
      collaborationFeedback: [
        "Great pair programming sessions observed",
        "Active Slack communication",
        "Helped other teams with debugging",
      ],
    },
  },
});

/**
 * Dashboard API Service
 * Replace these mock implementations with real API calls in production
 */
export const dashboardService = {
  /**
   * Fetch dashboard data for a team
   */
  async getDashboardData(teamId: string): Promise<ApiResponse<DashboardData>> {
    try {
      // Simulate API call
      await delay(500);
      
      // In production, replace with:
      // const response = await fetch(`/api/teams/${teamId}/dashboard`);
      // const data = await response.json();
      
      const data = generateMockData(teamId);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch dashboard data",
      };
    }
  },

  /**
   * Submit an explanation for a detected flag
   */
  async submitFlagExplanation(
    teamId: string,
    flagId: number,
    explanation: string
  ): Promise<ApiResponse<DetectedFlag>> {
    try {
      await delay(300);
      
      // In production, replace with:
      // const response = await fetch(`/api/teams/${teamId}/flags/${flagId}/explain`, {
      //   method: 'POST',
      //   body: JSON.stringify({ explanation }),
      // });
      
      const updatedFlag: DetectedFlag = {
        id: flagId,
        flagName: "Flag",
        reason: "Updated",
        explained: true,
        explanation,
      };
      
      return { success: true, data: updatedFlag };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit explanation",
      };
    }
  },

  /**
   * Request mentor help
   */
  async requestMentorHelp(
    request: MentorHelpRequest
  ): Promise<ApiResponse<{ ticketId: string }>> {
    try {
      await delay(400);
      
      // In production, replace with real API call
      const ticketId = `MENTOR-${Date.now()}`;
      
      return { success: true, data: { ticketId } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit help request",
      };
    }
  },

  /**
   * Fetch real-time commit activity (for live updates)
   */
  async getRealtimeCommits(teamId: string): Promise<ApiResponse<{ newCommits: number }>> {
    try {
      await delay(200);
      
      // Simulate random new commits
      const newCommits = Math.floor(Math.random() * 3);
      
      return { success: true, data: { newCommits } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch commits",
      };
    }
  },
};

export default dashboardService;
