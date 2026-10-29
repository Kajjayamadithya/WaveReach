import React from "react";

export default function StrategyGuide() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 text-zinc-200">
      <div className="text-center space-y-1.5 border-b border-[#222227] pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">500 Student Registration Strategy Plan</h1>
        <p className="text-xs sm:text-sm text-zinc-400">7-Day Tactical Roadmap, ₹2,000 Budget Allocation, and Evaluation Answers.</p>
      </div>

      <div className="bg-[#121215] border border-[#222227] rounded-xl p-5 space-y-3">
        <h2 className="text-base font-bold text-white">1. Understand the Student Persona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#222227]">
            <h3 className="font-bold text-violet-400 mb-1">Target Audience</h3>
            <p className="text-zinc-300 leading-relaxed">
              Final-year engineering undergraduates (Batch 2025/2026) across Tier 1, 2, and 3 colleges (CSE, IT, ECE, EEE, and core streams pivoting to tech).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#222227]">
            <h3 className="font-bold text-violet-400 mb-1">Why They Care</h3>
            <p className="text-zinc-300 leading-relaxed">
              Urgency for campus placements requiring Generative AI projects on their resume, capstone deadlines, and avoiding 40 hours of heavy theory.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#222227]">
            <h3 className="font-bold text-violet-400 mb-1">Why They Register</h3>
            <p className="text-zinc-300 leading-relaxed">
              Tangible outcome: a working GitHub project in 60 mins, official certificate, zero monetary cost, and peer viral referral unlocks.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#121215] border border-[#222227] rounded-xl p-5 space-y-3">
        <h2 className="text-base font-bold text-white">2. Marketing Channels, Targets (Total: 500) & ₹2,000 Budget</h2>
        <div className="overflow-x-auto rounded-xl border border-[#222227] bg-[#09090b] text-xs">
          <table className="w-full text-left text-zinc-300">
            <thead className="bg-[#18181c] text-zinc-400 font-semibold border-b border-[#222227]">
              <tr>
                <th className="px-3.5 py-2">Channel</th>
                <th className="px-3.5 py-2">Action Plan</th>
                <th className="px-3.5 py-2 text-center">Registrations</th>
                <th className="px-3.5 py-2 text-center">Budget</th>
                <th className="px-3.5 py-2 text-right">CAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222227]">
              <tr>
                <td className="px-3.5 py-2 font-semibold text-white">1. WhatsApp Class Groups</td>
                <td className="px-3.5 py-2 text-zinc-400">Incentivize Class Reps (CRs) in 35 colleges</td>
                <td className="px-3.5 py-2 text-center font-bold text-violet-400">190 (38%)</td>
                <td className="px-3.5 py-2 text-center">₹400</td>
                <td className="px-3.5 py-2 text-right">₹2.11</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2 font-semibold text-white">2. Campus Tech Clubs</td>
                <td className="px-3.5 py-2 text-zinc-400">Co-host with 6 developer clubs (GDSC, CSI)</td>
                <td className="px-3.5 py-2 text-center font-bold text-violet-400">125 (25%)</td>
                <td className="px-3.5 py-2 text-center">₹500</td>
                <td className="px-3.5 py-2 text-right">₹4.00</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2 font-semibold text-white">3. Peer Referral Engine</td>
                <td className="px-3.5 py-2 text-zinc-400">Milestone digital perks + ₹300 leaderboard bounty</td>
                <td className="px-3.5 py-2 text-center font-bold text-violet-400">95 (19%)</td>
                <td className="px-3.5 py-2 text-center">₹300</td>
                <td className="px-3.5 py-2 text-right">₹3.16</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2 font-semibold text-white">4. Meta Micro-Boost</td>
                <td className="px-3.5 py-2 text-zinc-400">Targeted IG Stories to final-year engineers</td>
                <td className="px-3.5 py-2 text-center font-bold text-violet-400">55 (11%)</td>
                <td className="px-3.5 py-2 text-center">₹600</td>
                <td className="px-3.5 py-2 text-right">₹10.90</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2 font-semibold text-white">5. LinkedIn & Placement</td>
                <td className="px-3.5 py-2 text-zinc-400">Placement Telegram & LinkedIn community posts</td>
                <td className="px-3.5 py-2 text-center font-bold text-violet-400">35 (7%)</td>
                <td className="px-3.5 py-2 text-center">₹200</td>
                <td className="px-3.5 py-2 text-right">₹5.71</td>
              </tr>
              <tr className="bg-[#18181c] font-bold text-white">
                <td className="px-3.5 py-2">TOTAL CAMPAIGN</td>
                <td className="px-3.5 py-2">Multi-Channel Blend</td>
                <td className="px-3.5 py-2 text-center text-violet-400">500 Students</td>
                <td className="px-3.5 py-2 text-center text-amber-400">₹2,000</td>
                <td className="px-3.5 py-2 text-right text-emerald-400">₹4.00 Avg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#121215] border border-[#222227] rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-white">3. Show Us How You Thought (Assignment Answers)</h2>
        <div className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <h3 className="font-semibold text-violet-300">What changed between your first idea and final solution?</h3>
            <p className="text-zinc-300 mt-1 leading-relaxed">
              Initially planned to spend all ₹2,000 on Meta and Google Ads. Realized ₹2,000 at ₹4 CPC yields only ~500 clicks, converting to barely ~100 registrations (CAC ₹20+). Pivoted to a peer-led community viral strategy where 80%+ of signups come from Class WhatsApp groups, campus clubs, and referral loops, slashing CAC to ₹4.00.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-violet-300">If you had another 24 hours, what would you improve?</h3>
            <p className="text-zinc-300 mt-1 leading-relaxed">
              Integrate automated WhatsApp Cloud API bots for instant pass delivery and 1-hour pre-workshop reminders (boosting attendance from 40% to 70%+), build a real-time inter-college rivalry leaderboard, and add a branch-specific AI capstone project idea generator.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-violet-300">What did AI suggest that you deliberately rejected and why?</h3>
            <p className="text-zinc-300 mt-1 leading-relaxed">
              AI suggested cold email outreach to college Training & Placement Officers (TPOs) and HODs. Deliberately rejected because college administration takes 2–4 weeks for approvals (our timeline is 7 days), and mandatory college workshops suffer from poor student enthusiasm compared to student-to-student peer buzz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
