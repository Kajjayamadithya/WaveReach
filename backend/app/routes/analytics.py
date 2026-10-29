import io
import csv
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Response, HTTPException, status
from ..models import (
    AnalyticsOverview,
    ChannelMetric,
    CollegeMetric,
    BranchMetric,
    DailyTimelineMetric
)
from ..database import db
from ..config import settings

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Strategy Tracking"])

CHANNEL_TARGETS = {
    "WhatsApp Groups": {"target": 190, "budget": 400.0},
    "Campus Tech Clubs": {"target": 125, "budget": 500.0},
    "Referral Engine": {"target": 95, "budget": 300.0},
    "Instagram Micro-Boost": {"target": 55, "budget": 600.0},
    "LinkedIn & Placement": {"target": 35, "budget": 200.0},
}

DAY_TARGETS = [
    {"day": "Day 1", "target": 25, "focus": "Ambassador Seeding & Class Rep Launch"},
    {"day": "Day 2", "target": 70, "focus": "Class WhatsApp Blast & Direct Referral Sparks"},
    {"day": "Day 3", "target": 85, "focus": "Tech Clubs Co-Hosting Announcements"},
    {"day": "Day 4", "target": 90, "focus": "Referral Leaderboard Bounty Launch & Meta Micro-Boost"},
    {"day": "Day 5", "target": 80, "focus": "Placement & Resume AI Project Feature Blitz"},
    {"day": "Day 6", "target": 90, "focus": "Social Proof Surge: '400 Seats Filled' Scarcity Push"},
    {"day": "Day 7", "target": 60, "focus": "Final 6-Hour Countdown to 500 Capstone Spots"}
]

@router.get("/overview", response_model=AnalyticsOverview)
def get_overview():
    all_regs = db.get_all_registrations()
    total = len(all_regs)
    target = settings.TARGET_REGISTRATIONS
    
    total_referrals = sum(1 for r in all_regs if r.get("referred_by"))
    unique_colleges = len(set(r.get("college", "").strip().lower() for r in all_regs if r.get("college")))
    
    progress = round((total / target) * 100.0, 1) if target > 0 else 0.0
    referral_pct = round((total_referrals / total) * 100.0, 1) if total > 0 else 0.0
    
    budget_allocated = settings.CAMPAIGN_BUDGET
    budget_spent = round(min(budget_allocated, (total / target) * budget_allocated), 2) if target > 0 else 0.0
    cpa = round(budget_spent / total, 2) if total > 0 else 0.0

    health = db.check_health()

    return AnalyticsOverview(
        total_registrations=total,
        target_registrations=target,
        progress_percentage=progress,
        total_referrals=total_referrals,
        referral_percentage=referral_pct,
        unique_colleges=unique_colleges,
        budget_allocated=budget_allocated,
        budget_spent=budget_spent,
        cost_per_registration=cpa,
        db_connected=health["connected"],
        db_type=health["provider"]
    )

@router.get("/channels", response_model=List[ChannelMetric])
def get_channels_breakdown():
    all_regs = db.get_all_registrations()
    total = len(all_regs)

    channel_counts: Dict[str, int] = {}
    for r in all_regs:
        ch = r.get("channel", "Direct").strip()
        matched_channel = "Direct"
        for key in CHANNEL_TARGETS.keys():
            if key.lower() in ch.lower() or ch.lower() in key.lower():
                matched_channel = key
                break
        if matched_channel == "Direct":
            if r.get("referred_by"):
                matched_channel = "Referral Engine"
            else:
                matched_channel = "WhatsApp Groups"

        channel_counts[matched_channel] = channel_counts.get(matched_channel, 0) + 1

    result = []
    for ch_name, conf in CHANNEL_TARGETS.items():
        actual = channel_counts.get(ch_name, 0)
        pct = round((actual / total) * 100.0, 1) if total > 0 else 0.0
        allocated = conf["budget"]
        cpa = round(allocated / actual, 2) if actual > 0 else round(allocated / conf["target"], 2)
        result.append(ChannelMetric(
            channel=ch_name,
            registrations=actual,
            target=conf["target"],
            percentage_of_total=pct,
            cost_allocated=allocated,
            cost_per_reg=cpa
        ))

    return result

@router.get("/colleges", response_model=List[CollegeMetric])
def get_colleges_breakdown(limit: int = 10):
    all_regs = db.get_all_registrations()
    total = len(all_regs)

    counts: Dict[str, int] = {}
    for r in all_regs:
        col = r.get("college", "Other").strip()
        counts[col] = counts.get(col, 0) + 1

    sorted_colleges = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
    return [
        CollegeMetric(
            college=c,
            registrations=cnt,
            percentage=round((cnt / total) * 100.0, 1) if total > 0 else 0.0
        )
        for c, cnt in sorted_colleges
    ]

@router.get("/branches", response_model=List[BranchMetric])
def get_branches_breakdown():
    all_regs = db.get_all_registrations()
    total = len(all_regs)

    counts: Dict[str, int] = {}
    for r in all_regs:
        br = r.get("branch", "Other").strip()
        counts[br] = counts.get(br, 0) + 1

    sorted_branches = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    return [
        BranchMetric(
            branch=b,
            registrations=cnt,
            percentage=round((cnt / total) * 100.0, 1) if total > 0 else 0.0
        )
        for b, cnt in sorted_branches
    ]

@router.get("/timeline", response_model=List[DailyTimelineMetric])
def get_timeline():
    all_regs = db.get_all_registrations()
    total = len(all_regs)

    timeline = []
    cumulative = 0

    date_counts: Dict[str, int] = {}
    for r in all_regs:
        raw_date = str(r.get("created_at", ""))[:10]
        if raw_date:
            date_counts[raw_date] = date_counts.get(raw_date, 0) + 1

    sorted_dates = sorted(date_counts.keys())
    for idx, day_cfg in enumerate(DAY_TARGETS):
        day_actual = 0
        if idx < len(sorted_dates):
            day_actual = date_counts[sorted_dates[idx]]
        elif total > 0:
            day_actual = round(total * (day_cfg["target"] / 500.0))

        cumulative += day_actual
        timeline.append(DailyTimelineMetric(
            day=day_cfg["day"],
            date=day_cfg["focus"],
            target=day_cfg["target"],
            actual=day_actual,
            cumulative=cumulative
        ))

    return timeline

@router.get("/recent")
def get_recent_registrations(limit: int = 20):
    all_regs = db.get_all_registrations()
    return all_regs[:limit]

@router.get("/export")
def export_registrations_csv():
    all_regs = db.get_all_registrations()
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Registration ID",
        "Student Name",
        "Email",
        "Phone",
        "College",
        "Branch",
        "Graduation Year",
        "AI Experience",
        "Acquisition Channel",
        "Referral Code",
        "Referred By",
        "Registration Timestamp",
        "Status"
    ])

    for r in all_regs:
        writer.writerow([
            r.get("id"),
            r.get("name"),
            r.get("email"),
            r.get("phone"),
            r.get("college"),
            r.get("branch"),
            r.get("graduation_year", 2025),
            r.get("ai_experience", "Beginner"),
            r.get("channel", "Direct"),
            r.get("referral_code"),
            r.get("referred_by") or "None",
            r.get("created_at"),
            r.get("status", "confirmed")
        ])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=nxtwave_500_student_registrations.csv"}
    )

@router.post("/seed")
def seed_simulation_data():
    from .seed_data import generate_500_students
    students = generate_500_students()
    count = db.seed_records(students)
    return {
        "status": "success",
        "message": f"Successfully loaded {count} realistic student registrations into database!",
        "target": 500,
        "channel_targets": CHANNEL_TARGETS
    }

@router.delete("/reset")
def reset_database():
    db.clear_all()
    return {"status": "success", "message": "Database reset to 0 registrations."}
