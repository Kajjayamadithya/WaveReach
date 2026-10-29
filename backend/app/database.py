import os
import json
import uuid
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import requests
from .config import settings

logger = logging.getLogger("uvicorn.error")

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOCAL_STORE_PATH = DATA_DIR / "registrations.json"

class DatabaseClient:
    def __init__(self):
        self.is_supabase = settings.is_supabase_configured
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_KEY
        
        self.session = requests.Session()
        if self.is_supabase:
            self.session.headers.update({
                "apikey": self.supabase_key,
                "Authorization": f"Bearer {self.supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            })
            logger.info(f"Supabase configured: Connected to {self.supabase_url}")
        else:
            logger.warning(
                "Supabase credentials not configured in backend/.env. "
                "Operating in persistent local storage mode. Add SUPABASE_URL and SUPABASE_KEY to connect live Supabase."
            )
            
        self._load_local_store()

    def _load_local_store(self):
        self._local_registrations: List[Dict[str, Any]] = []
        if LOCAL_STORE_PATH.exists():
            try:
                with open(LOCAL_STORE_PATH, "r", encoding="utf-8") as f:
                    self._local_registrations = json.load(f)
            except Exception as e:
                logger.error(f"Error loading local registrations: {e}")
                self._local_registrations = []

    def _save_local_store(self):
        try:
            with open(LOCAL_STORE_PATH, "w", encoding="utf-8") as f:
                json.dump(self._local_registrations, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving local registrations: {e}")

    def check_health(self) -> Dict[str, Any]:
        """Check connection status with Supabase or persistent local store"""
        if not self.is_supabase:
            return {
                "connected": False,
                "provider": "local_storage",
                "message": "Add SUPABASE_URL & SUPABASE_KEY in backend/.env to connect your Supabase project. Currently saving to backend/data/registrations.json.",
                "local_records": len(self._local_registrations)
            }
        try:
            res = self.session.get(
                f"{self.supabase_url}/rest/v1/registrations?select=id&limit=1",
                timeout=5.0
            )
            if res.status_code in [200, 206]:
                return {
                    "connected": True,
                    "provider": "supabase",
                    "status_code": res.status_code,
                    "message": "Successfully connected to Supabase PostgreSQL database."
                }
            else:
                return {
                    "connected": False,
                    "provider": "supabase",
                    "status_code": res.status_code,
                    "message": f"Supabase responded with status {res.status_code}: {res.text[:200]}"
                }
        except Exception as e:
            return {
                "connected": False,
                "provider": "supabase",
                "message": f"Supabase connection error: {str(e)}"
            }

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.strip().lower()
        if self.is_supabase:
            try:
                res = self.session.get(
                    f"{self.supabase_url}/rest/v1/registrations?email=eq.{clean_email}&select=*",
                    timeout=5.0
                )
                if res.status_code == 200:
                    items = res.json()
                    if items:
                        return items[0]
            except Exception as e:
                logger.error(f"Error querying email from Supabase: {e}")
        
        for reg in self._local_registrations:
            if reg.get("email", "").lower() == clean_email:
                return reg
        return None

    def get_by_referral_code(self, referral_code: str) -> Optional[Dict[str, Any]]:
        code = referral_code.strip().upper()
        if self.is_supabase:
            try:
                res = self.session.get(
                    f"{self.supabase_url}/rest/v1/registrations?referral_code=eq.{code}&select=*",
                    timeout=5.0
                )
                if res.status_code == 200:
                    items = res.json()
                    if items:
                        return items[0]
            except Exception as e:
                logger.error(f"Error querying referral code from Supabase: {e}")

        for reg in self._local_registrations:
            if (reg.get("referral_code") or "").upper() == code:
                return reg
        return None

    def create_registration(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data["id"] = data.get("id") or str(uuid.uuid4())
        data["created_at"] = data.get("created_at") or datetime.now(timezone.utc).isoformat()
        data["email"] = data["email"].strip().lower()
        data["referral_code"] = data["referral_code"].strip().upper()
        if data.get("referred_by"):
            data["referred_by"] = data["referred_by"].strip().upper()

        if self.is_supabase:
            try:
                res = self.session.post(
                    f"{self.supabase_url}/rest/v1/registrations",
                    json=data,
                    timeout=8.0
                )
                if res.status_code in [200, 201]:
                    result = res.json()
                    inserted = result[0] if isinstance(result, list) and result else data
                    self._local_registrations.append(inserted)
                    self._save_local_store()
                    return inserted
                else:
                    logger.error(f"Supabase insert failed ({res.status_code}): {res.text}")
            except Exception as e:
                logger.error(f"Supabase insert exception: {e}")

        self._local_registrations.append(data)
        self._save_local_store()
        return data

    def get_referrals_by_code(self, referral_code: str) -> List[Dict[str, Any]]:
        code = referral_code.strip().upper()
        if self.is_supabase:
            try:
                res = self.session.get(
                    f"{self.supabase_url}/rest/v1/registrations?referred_by=eq.{code}&order=created_at.desc&select=name,college,branch,created_at",
                    timeout=6.0
                )
                if res.status_code == 200:
                    return res.json()
            except Exception as e:
                logger.error(f"Error querying referrals by code from Supabase: {e}")

        return [
            {
                "name": r.get("name"),
                "college": r.get("college"),
                "branch": r.get("branch"),
                "created_at": r.get("created_at")
            }
            for r in self._local_registrations
            if (r.get("referred_by") or "").upper() == code
        ]

    def get_all_registrations(self) -> List[Dict[str, Any]]:
        if self.is_supabase:
            try:
                res = self.session.get(
                    f"{self.supabase_url}/rest/v1/registrations?select=*&order=created_at.desc",
                    timeout=10.0
                )
                if res.status_code == 200:
                    items = res.json()
                    self._local_registrations = items
                    self._save_local_store()
                    return items
            except Exception as e:
                logger.error(f"Error getting all registrations from Supabase: {e}")

        return sorted(self._local_registrations, key=lambda x: x.get("created_at", ""), reverse=True)

    def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        all_regs = self.get_all_registrations()
        
        referral_counts: Dict[str, int] = {}
        student_info: Dict[str, Dict[str, Any]] = {}
        
        for reg in all_regs:
            code = reg.get("referral_code")
            if code:
                student_info[code] = {
                    "name": reg.get("name"),
                    "college": reg.get("college"),
                    "referral_code": code
                }
            
            ref_by = reg.get("referred_by")
            if ref_by:
                referral_counts[ref_by] = referral_counts.get(ref_by, 0) + 1

        leaderboard = []
        for code, count in sorted(referral_counts.items(), key=lambda x: x[1], reverse=True):
            info = student_info.get(code, {"name": "Campus Lead", "college": "Engineering College", "referral_code": code})
            leaderboard.append({
                "referral_code": code,
                "name": info["name"],
                "college": info["college"],
                "total_referrals": count
            })

        return leaderboard[:limit]

    def seed_records(self, records: List[Dict[str, Any]]) -> int:
        inserted_count = 0
        if self.is_supabase:
            try:
                chunk_size = 50
                for i in range(0, len(records), chunk_size):
                    chunk = records[i:i + chunk_size]
                    res = self.session.post(
                        f"{self.supabase_url}/rest/v1/registrations",
                        json=chunk,
                        timeout=15.0
                    )
                    if res.status_code in [200, 201]:
                        inserted_count += len(chunk)
                if inserted_count > 0:
                    self._local_registrations.extend(records)
                    self._save_local_store()
                    return inserted_count
            except Exception as e:
                logger.error(f"Supabase bulk seed error: {e}")

        self._local_registrations.extend(records)
        self._save_local_store()
        return len(records)

    def clear_all(self) -> bool:
        if self.is_supabase:
            try:
                self.session.delete(
                    f"{self.supabase_url}/rest/v1/registrations?id=neq.00000000-0000-0000-0000-000000000000",
                    timeout=8.0
                )
            except Exception as e:
                logger.error(f"Supabase clear exception: {e}")
        self._local_registrations = []
        self._save_local_store()
        return True

db = DatabaseClient()
