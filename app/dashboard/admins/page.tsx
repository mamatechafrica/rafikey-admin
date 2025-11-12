"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface Admin {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  role: string;
  created_at: string;
}

import { useTheme } from "@/components/ThemeContext";

// Utility to read cookie by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

// Utility to decode JWT (without verifying signature)
function decodeJWT(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const AdminsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add admin form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [role, setRole] = useState("viewer");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  // On mount, read token and decode role
  React.useEffect(() => {
    const t = getCookie("admin_token");
    setToken(t);
    if (t) {
      const decoded = decodeJWT(t);
      // Debug: log the decoded JWT and role
      // console.log("Decoded JWT:", decoded);
      // console.log("Extracted role from JWT:", decoded?.role);
      setCurrentRole(decoded?.role || null);
    } else {
      setCurrentRole(null);
    }
  }, []);
  // For backward compatibility, treat "admin" as "editor"
  // Normalize role for robust permission checks
  const normalizedRole = (typeof currentRole === "string" ? currentRole.trim().toLowerCase() : "");
  const effectiveRole = normalizedRole === "admin" ? "editor" : normalizedRole;
  // Debug: log the normalized and effective role
  // console.log("Normalized role:", normalizedRole, "Effective role:", effectiveRole);

  // Fetch admins with token
  useEffect(() => {
    if (!token) {
      setAdmins([]);
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch("https://rafikey-backend.onrender.com/admin/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("You do not have permission to view admins.");
          }
          throw new Error("Failed to fetch admins");
        }
        return res.json();
      })
      .then((data) => setAdmins(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "Failed to fetch admins"))
      .finally(() => setLoading(false));
  }, [addSuccess, token]);

  // Add admin handler
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    setAddLoading(true);
    try {
      const res = await fetch("https://rafikey-backend.onrender.com/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          admin_code: adminCode,
          role,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.detail || "Failed to add admin");
        setAddLoading(false);
        return;
      }
      setAddSuccess("Admin added successfully");
      setUsername("");
      setEmail("");
      setPassword("");
      setAdminCode("");
      setRole("viewer");
    } catch {
      setAddError("Network error");
    }
    setAddLoading(false);
  };

  // Use global theme context
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <Sidebar
        isDarkMode={isDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-0 sm:ml-16" : "ml-0 sm:ml-64"
        }`}
      >
        <Header
          isDarkMode={isDarkMode}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
        />
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-6">Admins</h1>
          {/* Permission checks for editor/super_admin */}
          {!["super_admin", "editor"].includes(effectiveRole) ? (
            <div className="text-red-500 font-semibold">
              You do not have permission to view or manage admins.
            </div>
          ) : (
            <>
              {/* List Admins */}
              <div className="mb-8">
                {loading ? (
                  <div>Loading admins...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className={`overflow-x-auto rounded-xl shadow ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
                    <table className={`min-w-full divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                      <thead className={isDarkMode ? "bg-gray-900" : "bg-gradient-to-r from-purple-500 to-pink-500"}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 ${isDarkMode ? "text-purple-300 bg-gray-900" : "text-white"}`}>Username</th>
                          <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 ${isDarkMode ? "text-purple-300 bg-gray-900" : "text-white"}`}>Email</th>
                          <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 ${isDarkMode ? "text-purple-300 bg-gray-900" : "text-white"}`}>Is Admin</th>
                          <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 ${isDarkMode ? "text-purple-300 bg-gray-900" : "text-white"}`}>Created At</th>
                          <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 ${isDarkMode ? "text-purple-300 bg-gray-900" : "text-white"}`}>Role</th>
                          <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider sticky top-0 ${isDarkMode ? "text-purple-300 bg-gray-900" : "text-white"}`}>Action</th>
                        </tr>
                      </thead>
                      <tbody className={isDarkMode ? "divide-y divide-gray-700" : "divide-y divide-gray-100"}>
                        {admins.map((admin, idx) => (
                          <tr
                            key={admin.id}
                            className={
                              isDarkMode
                                ? idx % 2 === 0
                                  ? "bg-gray-800 hover:bg-gray-700"
                                  : "bg-gray-900 hover:bg-gray-700"
                                : idx % 2 === 0
                                ? "bg-gray-50 hover:bg-purple-50"
                                : "bg-white hover:bg-purple-50"
                            }
                          >
                            <td className={`px-6 py-3 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{admin.username}</td>
                            <td className={`px-6 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{admin.email}</td>
                            <td className="px-6 py-3">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                admin.is_admin
                                  ? isDarkMode
                                    ? "bg-green-900 text-green-300"
                                    : "bg-green-100 text-green-700"
                                  : isDarkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-200 text-gray-600"
                              }`}>
                                {admin.is_admin ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className={`px-6 py-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{new Date(admin.created_at).toLocaleString()}</td>
                            <td className={`px-6 py-3 ${isDarkMode ? "text-purple-200" : "text-purple-700"}`}>{admin.role}</td>
                            <td className="px-6 py-3">
                              {effectiveRole === "super_admin" && admin.role !== "super_admin" && (
                                <button
                                  onClick={async () => {
                                    if (!window.confirm(`Delete admin "${admin.username}"?`)) return;
                                    try {
                                      setLoading(true);
                                      setError(null);
                                      const res = await fetch(`https://rafikey-backend.onrender.com/admin/delete/${admin.id}`, {
                                        method: "DELETE",
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      });
                                      if (!res.ok) {
                                        const data = await res.json().catch(() => ({}));
                                        throw new Error(data.detail || "Failed to delete admin");
                                      }
                                      setAddSuccess("Admin deleted successfully");
                                    } catch (e: any) {
                                      setError(e.message || "Failed to delete admin");
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all text-xs"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Add Admin Button */}
              {effectiveRole === "super_admin" && (
                <>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mb-6 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded transition-all hover:scale-105"
                  >
                    Add Admin
                  </button>
                  {/* Modal for Add Admin Form */}
                  {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                      <div
                        className={`rounded-2xl shadow-2xl border p-8 max-w-md w-full relative transform transition-all duration-300 scale-100 opacity-100 animate-pop ${
                          isDarkMode
                            ? "bg-gray-900 border-gray-700 text-white"
                            : "bg-white border-purple-200"
                        }`}
                        style={{
                          animation: "popIn 0.25s cubic-bezier(0.4,0,0.2,1)"
                        }}
                      >
                        <button
                          onClick={() => setShowModal(false)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold transition-colors"
                          aria-label="Close"
                          style={{ lineHeight: 1 }}
                        >
                          &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center text-purple-700">Add New Admin</h2>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className={`w-full border rounded px-3 py-2 ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={`w-full border rounded px-3 py-2 ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={`w-full border rounded px-3 py-2 ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          {effectiveRole === "super_admin" ? (
                            <div>
                              <label className="block text-sm font-medium mb-1">Role</label>
                              <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={`w-full border rounded px-3 py-2 ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-white"
                                    : ""
                                }`}
                                required
                              >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                            </div>
                          ) : (
                            <input type="hidden" value="viewer" />
                          )}
                          <style jsx global>{`
                            @keyframes popIn {
                              0% {
                                opacity: 0;
                                transform: scale(0.85);
                              }
                              100% {
                                opacity: 1;
                                transform: scale(1);
                              }
                            }
                          `}</style>
                          <div>
                            <label className="block text-sm font-medium mb-1">Admin Registration Code</label>
                            <input
                              type="text"
                              value={adminCode}
                              onChange={(e) => setAdminCode(e.target.value)}
                              className={`w-full border rounded px-3 py-2 ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          {addError && <div className="text-red-500">{addError}</div>}
                          {addSuccess && <div className="text-green-600">{addSuccess}</div>}
                          <button
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded transition-all hover:scale-105"
                            disabled={addLoading}
                          >
                            {addLoading ? "Adding..." : "Add Admin"}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminsPage;