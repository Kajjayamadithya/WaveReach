import random
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

FIRST_NAMES = [
    "Aarav", "Aditi", "Akhil", "Ananya", "Aniket", "Anushka", "Arjun", "Deepak",
    "Divya", "Gaurav", "Harsh", "Isha", "Ishaan", "Kavya", "Manish", "Meera",
    "Mohit", "Neha", "Nikhil", "Pooja", "Pranav", "Priya", "Rahul", "Riya",
    "Rohan", "Sanjay", "Sanjana", "Shreya", "Siddharth", "Sneha", "Surya",
    "Tanvi", "Tarun", "Varun", "Vikas", "Yash", "Aditya", "Sai", "Karthik", "Ravi"
]

LAST_NAMES = [
    "Sharma", "Verma", "Reddy", "Patel", "Gupta", "Kumar", "Singh", "Nair",
    "Iyer", "Rao", "Joshi", "Choudhury", "Bose", "Mehta", "Mishra", "Deshmukh",
    "Kulkarni", "Aggarwal", "Pillai", "Shah", "Bhat", "Chauhan", "Ghosh", "Saxena"
]

COLLEGES = [
    "Vellore Institute of Technology (VIT)",
    "SRM Institute of Science and Technology",
    "JNTU College of Engineering Hyderabad",
    "PES University, Bengaluru",
    "BMS College of Engineering",
    "RV College of Engineering",
    "Manipal Institute of Technology (MIT)",
    "Thapar Institute of Engineering & Technology",
    "Osmania University College of Engineering",
    "PSG College of Technology, Coimbatore",
    "Delhi Technological University (DTU)",
    "Chaitanya Bharathi Institute of Technology (CBIT)",
    "Vasavi College of Engineering",
    "Kumaraguru College of Technology",
    "National Institute of Technology (NIT) Warangal"
]

BRANCHES = [
    ("Computer Science & Engineering (CSE)", 0.52),
    ("Electronics & Communication (ECE)", 0.20),
    ("Information Technology (IT)", 0.14),
    ("Electrical & Electronics (EEE)", 0.08),
    ("Mechanical Engineering", 0.04),
    ("Civil Engineering", 0.02)
]

def choose_branch():
    r = random.random()
    cumulative = 0.0
    for branch, weight in BRANCHES:
        cumulative += weight
        if r <= cumulative:
            return branch
    return BRANCHES[0][0]

def generate_500_students() -> List[Dict[str, Any]]:
    students: List[Dict[str, Any]] = []
    base_time = datetime.now(timezone.utc) - timedelta(days=7)

    # Channel quota totaling exactly 500
    channels_quota = [
        ("WhatsApp Groups", 190),
        ("Campus Tech Clubs", 125),
        ("Referral Engine", 95),
        ("Instagram Micro-Boost", 55),
        ("LinkedIn & Placement", 35)
    ]

    # Daily distribution targets
    # Day 1: 25, Day 2: 70, Day 3: 85, Day 4: 90, Day 5: 80, Day 6: 90, Day 7: 60
    daily_quota = [25, 70, 85, 90, 80, 90, 60]
    current_day = 0
    day_count = 0

    # Maintain pool of early registrants as potential referrers
    ambassador_codes: List[str] = []

    student_index = 0
    for channel_name, target_count in channels_quota:
        for _ in range(target_count):
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            name = f"{first} {last}"
            email = f"{first.lower()}.{last.lower()}{student_index + 101}@gmail.com"
            phone = f"+91 {random.choice(['98', '99', '94', '97', '88', '70'])}{random.randint(10000000, 99999999)}"
            college = random.choice(COLLEGES)
            branch = choose_branch()
            ai_exp = random.choice(["Beginner (No prior AI)", "Beginner (No prior AI)", "Intermediate (Python basics)", "Know concepts but never built"])

            # Determine day
            if day_count >= daily_quota[current_day] and current_day < len(daily_quota) - 1:
                current_day += 1
                day_count = 0
            
            day_count += 1
            registered_time = base_time + timedelta(
                days=current_day,
                hours=random.randint(8, 22),
                minutes=random.randint(0, 59),
                seconds=random.randint(0, 59)
            )

            # Referral code for this student
            clean_first = "".join(c for c in first.upper() if c.isalnum())[:4]
            ref_code = f"NXT-{clean_first}-{student_index + 1000}"

            # Link referral if this is part of Referral Engine or natural referral
            referred_by = None
            if channel_name == "Referral Engine" and ambassador_codes:
                # Top ambassadors get more referrals
                if len(ambassador_codes) >= 8 and random.random() < 0.65:
                    referred_by = random.choice(ambassador_codes[:5])
                else:
                    referred_by = random.choice(ambassador_codes)

            students.append({
                "id": str(uuid.uuid4()),
                "name": name,
                "email": email,
                "phone": phone,
                "college": college,
                "branch": branch,
                "graduation_year": 2025,
                "ai_experience": ai_exp,
                "channel": channel_name,
                "referral_code": ref_code,
                "referred_by": referred_by,
                "status": "confirmed",
                "created_at": registered_time.isoformat()
            })

            # Add early registrants into ambassador pool
            if student_index < 30:
                ambassador_codes.append(ref_code)

            student_index += 1

    return students

