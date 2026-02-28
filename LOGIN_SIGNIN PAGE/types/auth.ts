// ============================================================================
// Authentication & Registration Types
// ============================================================================

export type UserRole = "participant" | "organizer" | "judge";

export interface User {
  id: string;
  githubUsername: string;
  avatarUrl: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  selectedRole: UserRole | null;
  error: string | null;
}

export interface GitHubProfile {
  login: string;
  id: number;
  avatarUrl: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  githubUsername: string;
  isValid: boolean;
  isValidating: boolean;
  profile?: GitHubProfile;
}

export interface TeamRegistrationData {
  teamName: string;
  githubRepoLink: string;
  teamMembers: TeamMember[];
  consentAccepted: boolean;
}

export interface RegistrationState {
  data: TeamRegistrationData;
  isSubmitting: boolean;
  isValidatingRepo: boolean;
  isRegistered: boolean;
  errors: {
    teamName?: string;
    githubRepoLink?: string;
    teamMembers?: string;
    consent?: string;
  };
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration: number;
}

export interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: string;
  color: string;
}
