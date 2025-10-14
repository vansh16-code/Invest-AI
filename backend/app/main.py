from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, users, stocks, trades, market, leaderboard, ai

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

app = FastAPI(
    title="Investment Trading API",
    description="A comprehensive API for investment trading and portfolio management",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

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

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"message": "OK"}