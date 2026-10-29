import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import RegistrationForm from "./components/RegistrationForm";
import ReferralTracker from "./components/ReferralTracker";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import StrategyGuide from "./components/StrategyGuide";
import { fetchHealth, fetchAnalyticsOverview, seedSimulationData, resetDatabase } from "./api";

export default function App() {
  const [activeTab, setActiveTab] = useState("register");
  const [health, setHealth] = useState(null);
  const [overview, setOverview] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const [hData, oData] = await Promise.all([fetchHealth(), fetchAnalyticsOverview()]);
      setHealth(hData);
      setOverview(oData);
    } catch (err) {
      console.error("Status load failed:", err);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedSimulationData();
      await loadStatus();
      showToast(res.message || "Loaded 500 realistic student registrations!", "success");
    } catch (err) {
      showToast(err.message || "Seeding failed.", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all registrations to 0?")) return;
    try {
      await resetDatabase();
      await loadStatus();
      showToast("Database successfully cleared to 0 registrations.", "info");
    } catch (err) {
      showToast(err.message || "Reset failed.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border ${
              toast.type === "success"
                ? "bg-zinc-900 border-emerald-500/40 text-emerald-300"
                : toast.type === "error"
                ? "bg-zinc-900 border-rose-500/40 text-rose-300"
                : "bg-zinc-900 border-purple-500/40 text-purple-300"
            }`}
          >
            <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        onSeed={handleSeed}
        onReset={handleReset}
        isSeeding={isSeeding}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "register" && (
          <RegistrationForm
            overview={overview}
            onRegistrationSuccess={loadStatus}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "referral" && <ReferralTracker />}

        {activeTab === "analytics" && (
          <AnalyticsDashboard
            overview={overview}
            refreshOverview={loadStatus}
            onSeed={handleSeed}
            onReset={handleReset}
            isSeeding={isSeeding}
          />
        )}

        {activeTab === "strategy" && <StrategyGuide />}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-[#18181c] bg-[#0c0c0e] py-5 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 NxtWave Disruptive Technologies — Growth Challenge</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Target: 500 Registrations</span>
            <span>•</span>
            <span>Budget: ₹2,000</span>
            <span>•</span>
            <span>Python FastAPI + Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
