import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory
base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # Supabase credentials
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "").strip()
    
    # Optional PostgreSQL direct URI
    DATABASE_URL: str = os.getenv("DATABASE_URL", "").strip()
    
    # Target students metric
    TARGET_REGISTRATIONS: int = int(os.getenv("TARGET_REGISTRATIONS", "500"))
    CAMPAIGN_BUDGET: float = float(os.getenv("CAMPAIGN_BUDGET", "2000.0"))
    
    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ]
    
    @property
    def is_supabase_configured(self) -> bool:
        return bool(
            self.SUPABASE_URL
            and "your-project" not in self.SUPABASE_URL
            and self.SUPABASE_KEY
            and "your-supabase" not in self.SUPABASE_KEY
        )

settings = Settings()

