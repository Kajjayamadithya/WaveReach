from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr

class RegistrationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120, description="Student Full Name")
    email: str = Field(..., description="Student Email Address")
    phone: str = Field(..., min_length=10, max_length=20, description="WhatsApp Phone Number")
    college: str = Field(..., min_length=2, max_length=250, description="Engineering College Name")
    branch: str = Field(..., description="Engineering Branch/Stream (e.g., CSE, ECE, IT)")
    graduation_year: int = Field(default=2025, description="Year of Graduation")
    ai_experience: str = Field(default="Beginner", description="Prior AI/Coding Experience Level")
    channel: Optional[str] = Field(default="Direct", description="Acquisition Channel")
    referred_by: Optional[str] = Field(default=None, description="Referral Code of Inviter")

class RegistrationResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    college: str
    branch: str
    graduation_year: int
    ai_experience: str
    channel: str
    referral_code: str
    referred_by: Optional[str] = None
    created_at: str
    referral_url: str
    status: str

class RefereeItem(BaseModel):
    name_masked: str
    college: str
    branch: str
    registered_at: str

class RewardTier(BaseModel):
    tier_number: int
    milestone: int
    title: str
    description: str
    is_unlocked: bool

class ReferralStatusResponse(BaseModel):
    referral_code: str
    student_name: str
    college: str
    total_referrals: int
    current_tier_title: str
    next_milestone: Optional[int] = None
    referrals_needed_for_next_tier: int = 0
    rewards: List[RewardTier]
    referees: List[RefereeItem]
    referral_url: str

class LeaderboardEntry(BaseModel):
    rank: int
    name_masked: str
    college: str
    referral_code: str
    total_referrals: int
    badge: str

class ChannelMetric(BaseModel):
    channel: str
    registrations: int
    target: int
    percentage_of_total: float
    cost_allocated: float
    cost_per_reg: float

class CollegeMetric(BaseModel):
    college: str
    registrations: int
    percentage: float

class BranchMetric(BaseModel):
    branch: str
    registrations: int
    percentage: float

class DailyTimelineMetric(BaseModel):
    day: str
    date: str
    target: int
    actual: int
    cumulative: int

class AnalyticsOverview(BaseModel):
    total_registrations: int
    target_registrations: int
    progress_percentage: float
    total_referrals: int
    referral_percentage: float
    unique_colleges: int
    budget_allocated: float
    budget_spent: float
    cost_per_registration: float
    db_connected: bool
    db_type: str

