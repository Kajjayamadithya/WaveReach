import React, { useState, useEffect } from "react";
import { fetchReferralStatus, fetchLeaderboard } from "../api";

export default function ReferralTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard(10);
      setLeaderboard(data);
    } catch (err) {
      console.error("Leaderboard load failed:", err);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const data = await fetchReferralStatus(searchTerm.trim());
      setStudentData(data);
    } catch (err) {
      setErrorMsg(err.message || "No registration found with that code or email.");
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = (code) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?ref=${code}`;
    const text = encodeURIComponent(
      `Hey! Register for NxtWave's free online workshop: "Build Your First AI Project in 60 Minutes". Learn to build & deploy a live LLM app for your placement resume. Use my link to claim the starter pack:\n${fullUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Referral Tracker & Campus Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Invite batchmates to the workshop. Track your referrals and unlock placement perks.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-3 flex gap-2">
          <input
            type="text"
            placeholder="Enter Referral Code or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#09090b] border border-[#222227] text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-violet-900/20"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-1 px-3 rounded-lg inline-block">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Student Referral Card */}
      {studentData && (
        <div className="bg-[#121215] border border-[#222227] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222227] pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{studentData.student_name}</h2>
              <p className="text-xs text-zinc-400">{studentData.college}</p>
            </div>
            <div className="bg-[#09090b] px-4 py-2 rounded-xl border border-[#222227] text-center">
              <p className="text-[11px] text-zinc-400 font-medium">Total Friends Referred</p>
              <p className="text-xl font-bold text-violet-400">{studentData.total_referrals}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#222227] flex items-center justify-between text-xs">
            <div>
              Referral Code:{" "}
              <span className="font-mono font-bold text-violet-300 text-sm ml-1">
                {studentData.referral_code}
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `${window.location.origin}${window.location.pathname}?ref=${studentData.referral_code}`
                )
              }
              className="px-3 py-1 bg-[#18181c] hover:bg-[#222227] text-white rounded-lg font-medium transition"
            >
              {copied ? "Copied!" : "Copy Invite Link"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {studentData.rewards.map((r) => (
              <div
                key={r.tier_number}
                className={`p-4 rounded-xl border ${
                  r.is_unlocked
                    ? "bg-violet-950/20 border-violet-500/40"
                    : "bg-[#09090b] border-[#222227] opacity-60"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-violet-400">
                    Tier {r.tier_number} ({r.milestone} Refs)
                  </span>
                  {r.is_unlocked && (
                    <span className="text-xs text-emerald-400 font-semibold">✓ Unlocked</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{r.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-[#121215] border border-[#222227] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Campus Ambassador Leaderboard</h2>
            <p className="text-xs text-zinc-400">
              Top referrers competing for the ₹300 leaderboard cash bounty pool.
            </p>
          </div>
          <button
            onClick={loadLeaderboard}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#18181c] hover:bg-[#222227] text-zinc-200 border border-[#222227]"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#222227] bg-[#09090b]">
          <table className="w-full text-xs text-left text-zinc-300">
            <thead className="bg-[#18181c] text-zinc-400 font-semibold border-b border-[#222227]">
              <tr>
                <th className="px-4 py-2.5">Rank</th>
                <th className="px-4 py-2.5">Student</th>
                <th className="px-4 py-2.5">College</th>
                <th className="px-4 py-2.5 text-right">Referrals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222227]">
              {leaderboard.map((item) => (
                <tr key={item.referral_code} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-2.5 font-bold text-white">#{item.rank}</td>
                  <td className="px-4 py-2.5 font-semibold text-white">{item.name_masked}</td>
                  <td className="px-4 py-2.5 text-zinc-300">{item.college}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-violet-400 text-sm">
                    {item.total_referrals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
