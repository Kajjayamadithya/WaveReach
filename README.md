# NxtWave Growth Challenge — 500 Student Registration & Referral Engine

**Workshop:** *"Build Your First AI Project in 60 Minutes"*  
**Candidate Submission:** NxtWave Growth Intern Challenge (Round 1)  
**Tech Stack:** Python FastAPI, React, Tailwind CSS, Supabase (PostgreSQL)  
**Campaign Constraints:** ₹2,000 Budget | 7 Days | 500 Final-Year Engineering Students Target (Blended CAC: ₹4.00)  

---

## 🌟 Overview & What We Built

This project is a complete, production-grade growth marketing system designed to acquire **500 final-year engineering students** for NxtWave's free online AI workshop.

Rather than building a static mockup with fake numbers, this project features:
1. **Interactive Workshop Registration Portal:** High-converting landing page with urgency countdown clock, live seat tracker, branch/college selector, and instant confirmation pass.
2. **Viral Peer-to-Peer Referral Engine:** Unique referral codes (`NXT-NAME-XXXX`), 1-click WhatsApp viral share button, 4 milestone tiers (unlocking prompt playbooks, boilerplate code, and 1-on-1 reviews), and a live Campus Ambassador Leaderboard.
3. **Live Growth Analytics Dashboard:** Real-time database metrics calculating progress towards 500, peer viral share, channel attribution ROI, 7-day velocity tracking, branch breakdowns, and 1-click CSV data export.
4. **No Dummy Data:** All analytics and referral checks query the real database backend (Supabase / local persistent engine).
5. **Direct CORS Architecture (No Proxy Server in `package.json`):** Clean separation of concerns with modern REST API endpoints.

---

## 📁 Repository Structure

```
nextwave/
├── backend/
│   ├── app/
│   │   ├── config.py           # Configuration & environment variables
│   │   ├── database.py         # Supabase client & persistent data layer
│   │   ├── models.py           # Pydantic schemas & data validation
│   │   ├── main.py             # FastAPI entrypoint & CORS middleware
│   │   └── routes/
│   │       ├── registrations.py # Register, referral lookup, and leaderboard
│   │       ├── analytics.py     # Channel ROI, daily velocity, export CSV
│   │       └── seed_data.py     # 500 realistic final-year student generator
│   ├── static/
│   │   └── index.html          # Standalone React + Tailwind SPA for 1-click test
│   ├── schema.sql              # Supabase PostgreSQL schema with RLS & indexes
│   ├── requirements.txt        # Python backend dependencies
│   ├── .env.example            # Environment variables template
│   └── data/                   # Persistent local storage (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── api.js              # Direct API client (calls FastAPI without proxy)
│   │   ├── App.jsx             # Main application orchestrator
│   │   ├── main.jsx            # React root mount
│   │   ├── index.css           # Tailwind directives & styles
│   │   └── components/
│   │       ├── Navbar.jsx               # Navigation bar & Supabase badge
│   │       ├── RegistrationForm.jsx     # Landing page & registration modal
│   │       ├── ReferralTracker.jsx      # Referral hub & ambassador ranks
│   │       ├── AnalyticsDashboard.jsx   # Live KPI cards & channel attribution
│   │       └── StrategyGuide.jsx        # In-app 7-day strategy presentation
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies (NO proxy configured)
│   ├── vite.config.js          # Vite config
│   ├── tailwind.config.js      # Tailwind configuration
│   └── postcss.config.js       # PostCSS plugins
│
├── GROWTH_PLAN.md              # 2-Page / 5-Slide Growth Strategy Document
├── SUBMISSION_ANSWERS.md       # Answers to 3 assignment questions & AI notes
├── VIDEO_SCRIPT_3MIN.md        # Timed 3-minute video presentation script
└── README.md                   # Setup guide and architecture overview
```

---

## 🚀 Setup & Execution Instructions

You can run the application in **two flexible ways**:

### Option A: Instant 1-Command Demo (Fastest)
Run the Python FastAPI server. It serves both the REST API and the complete React + Tailwind UI at `http://localhost:8000`:

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (if not already installed)
pip install -r requirements.txt

# 3. Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Now open your browser at **`http://localhost:8000`** to see the full application live!

---

### Option B: Standalone Full-Stack (Vite + React & FastAPI)
Run the Vite development server on port 5173 alongside the FastAPI backend on port 8000:

#### 1. Start the Backend (Terminal 1)
```bash
cd backend
python -m uvicorn app.main:app --port 8000 --reload
```

#### 2. Start the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`**. The React frontend communicates directly with `http://localhost:8000/api` via CORS (no `"proxy"` in `package.json`).

---

## 🗄️ Supabase Database Configuration

The application is built to connect directly to **Supabase**.

1. Create a free project on [Supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and paste the contents of `backend/schema.sql`. Click **Run** to create the `registrations` table, performance indexes, and RLS policies.
3. Go to **Project Settings $\rightarrow$ API** and copy:
   - **Project URL**
   - **anon / public key** or **service_role key**
4. Create a `.env` file inside the `backend/` directory (or edit `backend/.env`):
   ```env
   PORT=8000
   HOST=0.0.0.0
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-or-service-role-key
   CORS_ORIGINS=*
   ```
5. Restart the backend server. The navbar status badge will turn green: **"Supabase Live"**.

> **Note on Resilient Fallback:** If you do not configure Supabase credentials immediately, the backend automatically operates in **persistent local mode** (`backend/data/registrations.json`). It will never crash and seamlessly transitions to Supabase the moment you add credentials!

---

## 📊 Testing the 500 Student Target

To test how the system behaves when all 500 registrations are achieved:
1. Open the application.
2. Click the **"⚡ Seed 500"** button in the top navigation bar or in the Analytics Dashboard.
3. The system generates and inserts **500 realistic final-year engineering students** across all 5 acquisition channels, 15 top colleges, 6 engineering branches, and distributed across the 7-day timeline.
4. Open the **Live Dashboard** tab to inspect:
   - **Total Registrations:** 500 / 500 (100% of Goal)
   - **Channel Breakdown:** WhatsApp (190), Tech Clubs (125), Referral Engine (95), Instagram (55), LinkedIn (35)
   - **Budget Efficiency:** ₹2,000 spent @ ₹4.00 CAC
   - **1-Click Export:** Download all 500 records as CSV.
5. You can reset to 0 at any time using the **Reset** button.

---

## 📋 Deliverables Summary

| Deliverable | Location | Description |
| :--- | :--- | :--- |
| **Growth Plan** | [`GROWTH_PLAN.md`](GROWTH_PLAN.md) | 2-page / 5-slide plan with student persona, ₹2,000 budget, channel targets totaling 500, and 7-day timeline. |
| **Working Asset** | `backend/` & `frontend/` | Complete working web application with Registration, Referral Tracker, and Growth Dashboard. |
| **Thought Process & AI Notes** | [`SUBMISSION_ANSWERS.md`](SUBMISSION_ANSWERS.md) | In-depth answers to the 3 mandatory evaluation questions and 3 AI learning notes. |
| **3-Minute Video Script** | [`VIDEO_SCRIPT_3MIN.md`](VIDEO_SCRIPT_3MIN.md) | Timed word-for-word presentation script for the Round 1 video submission. |
| **Supabase SQL Schema** | [`backend/schema.sql`](backend/schema.sql) | Production SQL migration for the `registrations` table with indexes and RLS. |

