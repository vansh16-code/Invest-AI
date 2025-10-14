from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, users, stocks, trades, market, leaderboard, ai

# Ensure database tables exist (but don't recreate existing ones)
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

app = FastAPI(
    title="Investment Trading API",
    description="A comprehensive API for investment trading and portfolio management",
    version="1.0.0"
)

# Configure CORS - More permissive for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Specific origins for development
    allow_credentials=True,  # Allow credentials
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stocks.router)
app.include_router(trades.router)
app.include_router(market.router)
app.include_router(leaderboard.router)
app.include_router(ai.router)

@app.on_event("startup")
async def startup_event():
    await create_tables()

@app.get("/")
async def read_root():
    return {"message": "Investment Trading API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test")
async def test_endpoint():
    return {"message": "API is working", "cors": "enabled"}

# Add explicit OPTIONS handler for preflight requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"message": "OK"}