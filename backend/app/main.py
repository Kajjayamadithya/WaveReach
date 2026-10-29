import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import db
from .routes.registrations import router as registrations_router
from .routes.analytics import router as analytics_router

app = FastAPI(
    title="NxtWave AI Workshop Registration & Growth Engine",
    description="Backend API powering the 500 final-year engineering student registration drive, referral tracker, and growth analytics dashboard.",
    version="1.0.0"
)

# Configure CORS - allows React frontend to communicate directly without proxy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development and production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(registrations_router)
app.include_router(analytics_router)

@app.get("/api/health")
def health_check():
    db_health = db.check_health()
    return {
        "status": "healthy",
        "service": "nxtwave-growth-api",
        "target_students": settings.TARGET_REGISTRATIONS,
        "database": db_health
    }

# Check if static frontend build exists to serve
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def root():
    static_index = os.path.join(static_dir, "index.html")
    if os.path.exists(static_index):
        return FileResponse(static_index)
    
    health = db.check_health()
    return {
        "project": "NxtWave Growth Intern Challenge",
        "workshop": "Build Your First AI Project in 60 Minutes",
        "target": "500 Final-Year Engineering Students",
        "budget": "₹2,000 (₹4.00 blended CAC)",
        "docs": "/docs",
        "database": health
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
