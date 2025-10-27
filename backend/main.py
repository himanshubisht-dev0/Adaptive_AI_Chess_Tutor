from routes.auth import router as auth_router
from routes.game import router as game_router
from routes.analysis import router as analysis_router
import sys
import asyncio
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from routes import move, puzzle, feedback
from database.db_client import db_client
from stockfish.engine import stockfish_engine



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Adaptive AI Chess Tutor...")
    db_client.connect()
    stockfish_engine.start_engine()
    print("Services started successfully!")
    
    yield
    
    # Shutdown
    print("Shutting down...")
    stockfish_engine.stop_engine()
    db_client.close()
    print("Services stopped.")

app = FastAPI(
    title="Adaptive AI Chess Tutor",
    description="An intelligent chess tutoring system with adaptive learning",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(move.router, prefix="/api/move", tags=["Move Analysis"])
app.include_router(puzzle.router, prefix="/api/puzzle", tags=["Puzzles"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(game_router, prefix="/api/game", tags=["Game Management"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["Move Analysis"])

@app.get("/")
async def root():
    return {"message": "Adaptive AI Chess Tutor API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected" if db_client.client else "disconnected",
            "stockfish": "running" if stockfish_engine.engine else "stopped"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
