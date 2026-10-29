// API Service for NxtWave Growth Engine
// Connects directly to Python FastAPI backend via CORS (No proxy in package.json)

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:8000/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function registerStudent(payload) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Registration failed. Please try again.");
  }
  return data;
}

export async function fetchReferralStatus(codeOrEmail) {
  const res = await fetch(`${API_BASE}/referral/${encodeURIComponent(codeOrEmail.trim())}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "No referral details found.");
  }
  return data;
}

export async function fetchLeaderboard(limit = 10) {
  const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load leaderboard");
  return res.json();
}

export async function fetchAnalyticsOverview() {
  const res = await fetch(`${API_BASE}/analytics/overview`);
  if (!res.ok) throw new Error("Failed to fetch analytics overview");
  return res.json();
}

export async function fetchChannelsBreakdown() {
  const res = await fetch(`${API_BASE}/analytics/channels`);
  if (!res.ok) throw new Error("Failed to fetch channels breakdown");
  return res.json();
}

export async function fetchCollegesBreakdown() {
  const res = await fetch(`${API_BASE}/analytics/colleges`);
  if (!res.ok) throw new Error("Failed to fetch colleges breakdown");
  return res.json();
}

export async function fetchBranchesBreakdown() {
  const res = await fetch(`${API_BASE}/analytics/branches`);
  if (!res.ok) throw new Error("Failed to fetch branches breakdown");
  return res.json();
}

export async function fetchDailyTimeline() {
  const res = await fetch(`${API_BASE}/analytics/timeline`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}

export async function fetchRecentRegistrations(limit = 15) {
  const res = await fetch(`${API_BASE}/analytics/recent?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch recent registrations");
  return res.json();
}

export async function seedSimulationData() {
  const res = await fetch(`${API_BASE}/analytics/seed`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to seed simulation data");
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/analytics/reset`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to reset database");
  return res.json();
}

export function getCsvExportUrl() {
  return `${API_BASE}/analytics/export`;
}

