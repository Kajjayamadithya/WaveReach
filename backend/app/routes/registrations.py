import random
import string
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query, status
from ..models import (
    RegistrationCreate,
    RegistrationResponse,
    ReferralStatusResponse,
    LeaderboardEntry,
    RewardTier,
    RefereeItem
)
from ..database import db

router = APIRouter(prefix="/api", tags=["Registrations & Referrals"])

def generate_referral_code(name: str) -> str:
    clean_first = "".join(ch for ch in name.split()[0].upper() if ch.isalnum())[:5]
    random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    if clean_first:
        return f"NXT-{clean_first}-{random_suffix}"
    return f"NXT-{random_suffix}"

def mask_name(name: str) -> str:
    parts = name.strip().split()
    if len(parts) == 1:
        return parts[0][:3] + "***"
    return f"{parts[0]} {parts[-1][0]}."

MILESTONE_TIERS = [
    {
        "tier_number": 1,
        "milestone": 1,
        "title": "AI Project Starter Repo & Code Templates",
        "description": "Instant access to pre-built GitHub boilerplate, API integration scripts, and requirements file."
    },
    {
        "tier_number": 2,
        "milestone": 3,
        "title": "50+ Software Engineer Prompt Engineering Playbook",
        "description": "Curated production-grade prompts for debugging, code generation, system architecture, and resume bullets."
    },
    {
        "tier_number": 3,
        "milestone": 5,
        "title": "VIP Live Q&A & Certificate Priority",
        "description": "Direct priority mic access during the workshop with the NxtWave AI Mentor + Verified Credential Badge."
    },
    {
        "tier_number": 4,
        "milestone": 10,
        "title": "1-on-1 AI Capstone & Resume Evaluation",
        "description": "Personalized 20-minute mentor review of your final-year project code and placement resume."
    }
]

@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_student(payload: RegistrationCreate):
    existing = db.get_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email address has already registered for the workshop!"
        )

    valid_referred_by = None
    if payload.referred_by:
        inviter = db.get_by_referral_code(payload.referred_by)
        if inviter:
            valid_referred_by = inviter.get("referral_code")

    new_code = generate_referral_code(payload.name)
    attempts = 0
    while attempts < 5:
        existing_code = db.get_by_referral_code(new_code)
        if not existing_code:
            break
        new_code = generate_referral_code(payload.name)
        attempts += 1

    reg_data = {
        "name": payload.name.strip(),
        "email": payload.email.strip().lower(),
        "phone": payload.phone.strip(),
        "college": payload.college.strip(),
        "branch": payload.branch.strip(),
        "graduation_year": payload.graduation_year,
        "ai_experience": payload.ai_experience,
        "channel": payload.channel or "Direct",
        "referral_code": new_code,
        "referred_by": valid_referred_by,
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    created = db.create_registration(reg_data)

    return RegistrationResponse(
        id=str(created.get("id")),
        name=created["name"],
        email=created["email"],
        phone=created["phone"],
        college=created["college"],
        branch=created["branch"],
        graduation_year=created["graduation_year"],
        ai_experience=created["ai_experience"],
        channel=created["channel"],
        referral_code=created["referral_code"],
        referred_by=created.get("referred_by"),
        created_at=created["created_at"],
        referral_url=f"?ref={created['referral_code']}",
        status=created["status"]
    )

@router.get("/referral/{code_or_email}", response_model=ReferralStatusResponse)
def get_referral_status(code_or_email: str):
    term = code_or_email.strip()
    student = None

    if "@" in term:
        student = db.get_by_email(term)
    else:
        student = db.get_by_referral_code(term)

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No registration found with referral code or email: '{term}'"
        )

    code = student["referral_code"]
    raw_referees = db.get_referrals_by_code(code)
    total_count = len(raw_referees)

    rewards_list: list[RewardTier] = []
    current_tier_title = "Aspiring Ambassador"
    next_milestone = None
    needed = 0

    for tier in MILESTONE_TIERS:
        is_unlocked = total_count >= tier["milestone"]
        if is_unlocked:
            current_tier_title = tier["title"]
        elif next_milestone is None:
            next_milestone = tier["milestone"]
            needed = tier["milestone"] - total_count

        rewards_list.append(RewardTier(
            tier_number=tier["tier_number"],
            milestone=tier["milestone"],
            title=tier["title"],
            description=tier["description"],
            is_unlocked=is_unlocked
        ))

    referee_items = [
        RefereeItem(
            name_masked=mask_name(r.get("name", "Student")),
            college=r.get("college", "Engineering College"),
            branch=r.get("branch", "Engineering"),
            registered_at=str(r.get("created_at", ""))[:10]
        )
        for r in raw_referees
    ]

    return ReferralStatusResponse(
        referral_code=code,
        student_name=student["name"],
        college=student["college"],
        total_referrals=total_count,
        current_tier_title=current_tier_title,
        next_milestone=next_milestone,
        referrals_needed_for_next_tier=max(0, needed),
        rewards=rewards_list,
        referees=referee_items,
        referral_url=f"?ref={code}"
    )

@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_campus_leaderboard(limit: int = Query(default=10, ge=3, le=50)):
    raw_leaders = db.get_leaderboard(limit=limit)
    result = []
    
    badge_map = {
        1: "🏆 Diamond Ambassador",
        2: "🥈 Platinum Ambassador",
        3: "🥉 Gold Ambassador"
    }

    for idx, leader in enumerate(raw_leaders, start=1):
        badge = badge_map.get(idx, f"🎖️ Campus Champion Top {idx}")
        result.append(LeaderboardEntry(
            rank=idx,
            name_masked=mask_name(leader.get("name", "Student")),
            college=leader.get("college", "Engineering College"),
            referral_code=leader.get("referral_code", ""),
            total_referrals=leader.get("total_referrals", 0),
            badge=badge
        ))

    return result
