"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  Trophy,
  Scale,
  Search,
  Trash2,
  Edit3,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  LogOut,
  RefreshCw,
  BarChart3,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  githubUsername?: string;
  organizationName?: string;
  domainExpertise?: string;
  createdAt: string;
}

interface Stats {
  participants: number;
  judges: number;
  organizers: number;
  admins: number;
  teams: number;
  hackathons: number;
}

// ============================================================================
// Admin Dashboard Page
// ============================================================================
export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  // Show toast with auto-dismiss
  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 4000);
    },
    []
  );

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const roleParam =
        roleFilter !== "all" ? `?role=${roleFilter}` : "";
      const res = await fetch(`/api/admin/users${roleParam}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch {
      showToast("error", "Failed to fetch users");
    }
  }, [roleFilter, showToast]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
      }
    } catch {
      // Stats fetch failure is non-critical
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      setLoading(true);
      Promise.all([fetchUsers(), fetchStats()]).finally(() =>
        setLoading(false)
      );
    }
  }, [status, session, fetchUsers, fetchStats]);

  // Refetch on filter change
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [roleFilter, status, session, fetchUsers]);

  // Delete user
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        showToast("success", "User deleted successfully");
        fetchStats();
      } else {
        showToast("error", data.error || "Failed to delete user");
      }
    } catch {
      showToast("error", "Network error");
    }
    setActionLoading(null);
  };

  // Start editing
  const handleStartEdit = (user: UserRecord) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setActionLoading(editingUser._id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser._id,
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? data.user : u))
        );
        setEditingUser(null);
        showToast("success", "User updated successfully");
        fetchStats();
      } else {
        showToast("error", data.error || "Failed to update user");
      }
    } catch {
      showToast("error", "Network error");
    }
    setActionLoading(null);
  };

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.githubUsername
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false)
  );

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") return null;

  const roleColors: Record<string, string> = {
    participant: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    judge: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    organizer: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    admin: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  const roleIcons: Record<string, React.ReactNode> = {
    participant: <Users className="w-4 h-4" />,
    judge: <Scale className="w-4 h-4" />,
    organizer: <Trophy className="w-4 h-4" />,
    admin: <Shield className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Portal</h1>
              <p className="text-xs text-slate-500">
                CommitLens Data Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth" })}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: "Participants",
                value: stats.participants,
                color: "purple",
                icon: <Users className="w-5 h-5" />,
              },
              {
                label: "Judges",
                value: stats.judges,
                color: "amber",
                icon: <Scale className="w-5 h-5" />,
              },
              {
                label: "Organizers",
                value: stats.organizers,
                color: "cyan",
                icon: <Trophy className="w-5 h-5" />,
              },
              {
                label: "Admins",
                value: stats.admins,
                color: "red",
                icon: <Shield className="w-5 h-5" />,
              },
              {
                label: "Teams",
                value: stats.teams,
                color: "green",
                icon: <Users className="w-5 h-5" />,
              },
              {
                label: "Hackathons",
                value: stats.hackathons,
                color: "blue",
                icon: <BarChart3 className="w-5 h-5" />,
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border border-white/10 bg-white/5`}
              >
                <div
                  className={`text-${stat.color}-400 flex items-center gap-2 mb-2`}
                >
                  {stat.icon}
                  <span className="text-xs font-medium text-slate-400">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or GitHub username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition"
            />
          </div>

          {/* Role filter */}
          <div className="flex gap-2">
            {["all", "participant", "judge", "organizer", "admin"].map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                    roleFilter === role
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={() => {
              fetchUsers();
              fetchStats();
            }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            {user.githubUsername && (
                              <p className="text-xs text-slate-500">
                                @{user.githubUsername}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            roleColors[user.role] || ""
                          }`}
                        >
                          {roleIcons[user.role]}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {user.organizationName ||
                          user.domainExpertise ||
                          user.githubUsername ||
                          "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                            title="Edit user"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={
                              actionLoading === user._id ||
                              user._id === session.user.id
                            }
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition disabled:opacity-30"
                            title="Delete user"
                          >
                            {actionLoading === user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Edit User</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Name
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Email
                  </label>
                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  >
                    <option value="participant" className="bg-slate-900">
                      Participant
                    </option>
                    <option value="judge" className="bg-slate-900">
                      Judge
                    </option>
                    <option value="organizer" className="bg-slate-900">
                      Organizer
                    </option>
                    <option value="admin" className="bg-slate-900">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={actionLoading === editingUser._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl font-medium transition disabled:opacity-50"
                >
                  {actionLoading === editingUser._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <p className="text-sm">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
