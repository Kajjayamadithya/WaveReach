import React, { useState, useEffect } from "react";
import {
  fetchAnalyticsOverview,
  fetchChannelsBreakdown,
  fetchCollegesBreakdown,
  fetchBranchesBreakdown,
  fetchDailyTimeline,
  fetchRecentRegistrations,
  getCsvExportUrl,
} from "../api";

export default function AnalyticsDashboard({ overview, refreshOverview, onSeed, onReset, isSeeding }) {
  const [channels, setChannels] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [branches, setBranches] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [recent, setRecent] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    loadAllAnalytics();
  }, []);

  const loadAllAnalytics = async () => {
    try {
      const [chData, colData, brData, timeData, recData] = await Promise.all([
        fetchChannelsBreakdown(),
        fetchCollegesBreakdown(10),
        fetchBranchesBreakdown(),
        fetchDailyTimeline(),
        fetchRecentRegistrations(20),
      ]);
      setChannels(chData);
      setColleges(colData);
      setBranches(brData);
      setTimeline(timeData);
      setRecent(recData);
      if (refreshOverview) refreshOverview();
    } catch (err) {
      console.error("Failed loading analytics:", err);
    }
  };

  const filteredRecent = recent.filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      (r.name || "").toLowerCase().includes(q) ||
      (r.college || "").toLowerCase().includes(q) ||
      (r.channel || "").toLowerCase().includes(q) ||
      (r.branch || "").toLowerCase().includes(q) ||
      (r.referral_code || "").toLowerCase().includes(q)
    );
  });

  const currentCount = overview?.total_registrations || 0;
  const targetCount = overview?.target_registrations || 500;
  const progressPct = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222227] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Campaign Analytics Dashboard</h1>
            <span
              className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                overview?.db_connected
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "bg-violet-500/10 text-violet-300 border border-violet-500/20"
              }`}
            >
              {overview?.db_type === "supabase" ? "Supabase Live" : "Local Database"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time tracking of the 500 final-year student registration goal, channel ROI, and ₹2,000 budget efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAnalytics}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#18181c] hover:bg-[#222227] text-zinc-200 border border-[#2e2e36] transition"
          >
            ↻ Refresh
          </button>

          <a
            href={getCsvExportUrl()}
            download="nxtwave_500_registrations.csv"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <span>📥 Export CSV</span>
          </a>

          <button
            onClick={onSeed}
            disabled={isSeeding}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            {isSeeding ? "Seeding..." : "⚡ Simulate 500"}
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#121215] border border-[#222227] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span>Total Registrations</span>
            <span className="text-violet-400 font-bold">{progressPct}%</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currentCount} <span className="text-xs text-zinc-500 font-normal">/ {targetCount}</span>
          </div>
          <div className="mt-2.5 w-full bg-[#18181c] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-[#121215] border border-[#222227] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span>Viral Referrals</span>
            <span className="text-emerald-400 font-bold">{overview?.referral_percentage || 0}%</span>
          </div>
          <div className="text-2xl font-bold text-white">{overview?.total_referrals || 0}</div>
          <p className="text-[11px] text-zinc-500 mt-2">Target: 95 students via peer loops</p>
        </div>

        <div className="bg-[#121215] border border-[#222227] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span>Colleges Represented</span>
            <span className="text-zinc-300 font-bold">Tier 1, 2 & 3</span>
          </div>
          <div className="text-2xl font-bold text-white">{overview?.unique_colleges || 0}</div>
          <p className="text-[11px] text-zinc-500 mt-2">Campuses participating</p>
        </div>

        <div className="bg-[#121215] border border-[#222227] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
            <span>Budget & CAC</span>
            <span className="text-amber-400 font-bold">₹2,000 Budget</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{overview?.cost_per_registration || 0} <span className="text-xs text-zinc-400 font-normal">CAC</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Spent: ₹{overview?.budget_spent || 0} / ₹2,000</p>
        </div>
      </div>

      {/* Strategic Channel Attribution Breakdown */}
      <div className="bg-[#121215] border border-[#222227] rounded-xl p-5 space-y-3">
        <h2 className="text-base font-bold text-white">Channel Attribution vs Planned Targets (Total: 500)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((ch) => {
            const pctOfTarget = ch.target > 0 ? Math.min(100, Math.round((ch.registrations / ch.target) * 100)) : 0;
            return (
              <div key={ch.channel} className="p-3.5 rounded-xl bg-[#09090b] border border-[#222227] space-y-1.5">
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-white text-xs">{ch.channel}</span>
                  <span className="text-violet-400 font-bold text-xs">{ch.registrations} / {ch.target}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Budget: ₹{ch.cost_allocated}</span>
                  <span>CAC: ₹{ch.cost_per_reg}</span>
                </div>
                <div className="w-full bg-[#18181c] rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${pctOfTarget}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Velocity Curve */}
      <div className="bg-[#121215] border border-[#222227] rounded-xl p-5 space-y-3">
        <h2 className="text-base font-bold text-white">7-Day Campaign Pace & Velocity</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {timeline.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#09090b] border border-[#222227] text-center">
              <span className="text-[11px] font-bold text-violet-400 uppercase">{item.day}</span>
              <div className="text-base font-bold text-white mt-0.5">{item.actual}</div>
              <div className="text-[10px] text-zinc-400">Target: {item.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feed */}
      <div className="bg-[#121215] border border-[#222227] rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white">Live Registrations Stream</h2>
          <input
            type="text"
            placeholder="Search student, college, branch..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-[#09090b] border border-[#222227] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#222227] bg-[#09090b]">
          <table className="w-full text-xs text-left text-zinc-300">
            <thead className="bg-[#18181c] text-zinc-400 font-semibold border-b border-[#222227]">
              <tr>
                <th className="px-3.5 py-2">Student</th>
                <th className="px-3.5 py-2">College</th>
                <th className="px-3.5 py-2">Branch</th>
                <th className="px-3.5 py-2">Channel</th>
                <th className="px-3.5 py-2">Referral Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222227]">
              {filteredRecent.map((r, i) => (
                <tr key={i} className="hover:bg-zinc-800/20">
                  <td className="px-3.5 py-2 font-medium text-white">{r.name}</td>
                  <td className="px-3.5 py-2 text-zinc-300 truncate max-w-[200px]">{r.college}</td>
                  <td className="px-3.5 py-2 text-zinc-400">{r.branch}</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px]">{r.channel || "Direct"}</span>
                  </td>
                  <td className="px-3.5 py-2 font-mono text-violet-400">{r.referral_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
