import React, { useState, useEffect } from "react";
import { registerStudent } from "../api";

const TOP_COLLEGES = [
  "Vellore Institute of Technology (VIT)",
  "SRM Institute of Science and Technology",
  "JNTU College of Engineering Hyderabad",
  "PES University, Bengaluru",
  "BMS College of Engineering",
  "RV College of Engineering",
  "Manipal Institute of Technology (MIT)",
  "Thapar Institute of Engineering & Technology",
  "PSG College of Technology, Coimbatore",
  "Delhi Technological University (DTU)",
  "Osmania University College of Engineering",
  "Chaitanya Bharathi Institute of Technology (CBIT)",
  "National Institute of Technology (NIT)",
];

const BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Electronics & Communication (ECE)",
  "Information Technology (IT)",
  "Electrical & Electronics (EEE)",
  "Artificial Intelligence & Data Science",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other Engineering Stream",
];

export default function RegistrationForm({ overview, onRegistrationSuccess, setActiveTab }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: BRANCHES[0],
    graduation_year: 2025,
    ai_experience: "Beginner",
    referred_by: "",
    channel: "Direct",
  });

  const [hasReferralParam, setHasReferralParam] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 24, seconds: 12 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    const channel = params.get("utm_source") || (refCode ? "Referral Engine" : "Direct");

    if (refCode) {
      setFormData((prev) => ({ ...prev, referred_by: refCode.trim().toUpperCase(), channel }));
      setHasReferralParam(true);
    } else if (channel) {
      setFormData((prev) => ({ ...prev, channel }));
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const result = await registerStudent(formData);
      setSuccessData(result);
      if (onRegistrationSuccess) onRegistrationSuccess();
    } catch (err) {
      setErrorMsg(err.message || "Failed to register. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFullReferralUrl = (code) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?ref=${code}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openWhatsAppShare = (code) => {
    const url = getFullReferralUrl(code);
    const text = encodeURIComponent(
      `Hey! I just registered for NxtWave's free hands-on workshop: "Build Your First AI Project in 60 Minutes" for final-year engineering students.\n\nWe'll build & deploy a live LLM AI app for our placement resumes. Only 500 seats available!\n\nRegister using my invite link to get the AI Boilerplate Code Pack:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const currentCount = overview?.total_registrations || 0;
  const targetCount = overview?.target_registrations || 500;
  const progressPct = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Status Bar */}
      <div className="bg-[#121215] border border-[#222227] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                Cohort Capacity
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {currentCount} of {targetCount} Seats Confirmed
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#09090b] px-4 py-2.5 rounded-xl border border-[#222227]">
            <span className="text-xs text-zinc-400 font-medium">Starts In:</span>
            <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold text-amber-300">
              <span className="bg-[#18181c] px-2 py-0.5 rounded text-zinc-100">{timeLeft.hours}h</span>
              <span>:</span>
              <span className="bg-[#18181c] px-2 py-0.5 rounded text-zinc-100">{timeLeft.minutes}m</span>
              <span>:</span>
              <span className="bg-[#18181c] px-2 py-0.5 rounded text-zinc-100">{timeLeft.seconds}s</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-zinc-400 mb-1.5 font-medium">
            <span>Registration Pace</span>
            <span className="text-violet-400 font-bold">{progressPct}% Claimed</span>
          </div>
          <div className="w-full bg-[#18181c] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Overview Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <span>⚡ Live Hands-On Masterclass</span>
            <span>•</span>
            <span>Final-Year Placement Prep</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Build Your First AI Project in 60 Minutes
          </h1>

          <p className="text-base text-zinc-300 leading-relaxed">
            Stand out in campus placement drives and final-year capstone reviews. Build and deploy a working Generative AI application with Python and LLMs—with zero heavy math.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {[
              { title: "Hands-On Coding", desc: "Build a real working LLM app from scratch in 60 minutes.", tag: "Practical" },
              { title: "Placement Edge", desc: "Add a verifiable AI project link to your resume & GitHub.", tag: "Career" },
              { title: "Official Certificate", desc: "Get an authentic NxtWave Certificate of Completion.", tag: "Verified" },
              { title: "Starter Prompt Kit", desc: "50+ tested AI prompts, architectures, and boilerplate.", tag: "Bonus" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#121215] border border-[#222227] hover:border-[#2e2e36] transition">
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#121215] border border-[#222227] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              AI
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Curated by NxtWave AI Engineering Mentors</h4>
              <p className="text-xs text-zinc-400">
                IIT alumni and leading industry practitioners. Trusted by 100,000+ engineers.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#121215] border border-[#222227] rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">Reserve Your Free Seat</h2>
              <p className="text-xs text-zinc-400 mt-1">
                100% Free. Zoom link will be delivered via WhatsApp and Email.
              </p>
            </div>

            {hasReferralParam && (
              <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
                <span>🎁</span>
                <div>
                  <span>Invited by friend: </span>
                  <span className="font-mono font-bold text-white">{formData.referred_by}</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-[#222227] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="rahul.sharma@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-[#222227] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-[#222227] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">College *</label>
                  <input
                    type="text"
                    name="college"
                    required
                    list="colleges-react-aesthetic"
                    placeholder="Enter college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-[#222227] text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
                  />
                  <datalist id="colleges-react-aesthetic">
                    {TOP_COLLEGES.map((c, i) => (
                      <option key={i} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Branch *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-[#222227] text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
                  >
                    {BRANCHES.map((b, i) => (
                      <option key={i} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Graduation Year</label>
                  <select
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-[#222227] text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value={2025}>2025 (Final Year)</option>
                    <option value={2026}>2026 (Pre-Final Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">AI Experience</label>
                  <select
                    name="ai_experience"
                    value={formData.ai_experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-[#222227] text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="Beginner">Beginner (No prior AI)</option>
                    <option value="Intermediate">Intermediate (Know Python)</option>
                    <option value="Never Coded">Never built a project</option>
                  </select>
                </div>
              </div>

              {!hasReferralParam && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="referred_by"
                    placeholder="e.g. NXT-ROHAN-4812"
                    value={formData.referred_by}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#09090b] border border-[#222227] text-white text-xs font-mono uppercase focus:outline-none focus:border-violet-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-purple-900/25 transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {submitting ? "Confirming Seat..." : "Confirm Free Registration Now →"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Clean Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121215] border border-[#222227] max-w-md w-full rounded-2xl p-6 shadow-2xl relative text-white">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl mb-3">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Registration Confirmed</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Welcome, {successData.name}. Your workshop pass has been generated.
              </p>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-[#09090b] border border-[#222227] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">College:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {successData.college}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Your Referral Code:</span>
                <span className="font-mono font-bold text-violet-400 text-sm">
                  {successData.referral_code}
                </span>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 space-y-2.5">
              <h4 className="text-xs font-bold text-purple-200">
                🎁 Invite 3 Classmates & Unlock 50+ AI Prompts
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getFullReferralUrl(successData.referral_code)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#09090b] border border-[#222227] text-zinc-300 font-mono select-all"
                />
                <button
                  onClick={() => copyToClipboard(getFullReferralUrl(successData.referral_code))}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#18181c] hover:bg-[#222227] text-white border border-[#2e2e36] transition"
                >
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>

              <button
                onClick={() => openWhatsAppShare(successData.referral_code)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Share in WhatsApp Class Groups</span>
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setSuccessData(null);
                  setActiveTab("referral");
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-[#18181c] hover:bg-[#222227] text-zinc-200 border border-[#222227] transition"
              >
                View Referral Hub
              </button>
              <button
                onClick={() => setSuccessData(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
