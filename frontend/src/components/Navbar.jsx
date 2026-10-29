import React from "react";

export default function Navbar({ activeTab, setActiveTab, health, onSeed, onReset, isSeeding }) {
  const isSupabase = health?.database?.provider === "supabase" && health?.database?.connected;

  return (
    <header className="sticky top-0 z-50 bg-[#121215]/95 backdrop-blur-md border-b border-[#222227] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Workshop Tag */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-purple-900/30">
              NW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-zinc-100 tracking-tight">
                  NxtWave Growth
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  Goal: 500 Students
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Build Your First AI Project in 60 Mins
              </p>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#09090b] p-1 rounded-xl border border-[#222227]">
            {[
              { id: "register", label: "Registration" },
              { id: "referral", label: "Referral Hub" },
              { id: "analytics", label: "Analytics" },
              { id: "strategy", label: "Strategy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition duration-150 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Database Status & Quick Testing Actions */}
          <div className="flex items-center gap-2.5">
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isSupabase
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSupabase ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
              <span>{isSupabase ? "Supabase Live" : "Local DB"}</span>
            </div>

            <button
              onClick={onSeed}
              disabled={isSeeding}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#18181c] hover:bg-[#222227] text-zinc-200 border border-[#2e2e36] transition"
            >
              {isSeeding ? "Seeding..." : "⚡ Seed 500"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
