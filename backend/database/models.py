from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class User(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    password_hash: str
    created_at: datetime = datetime.now()
    elo_rating: int = 1200
    puzzle_rating: int = 1200
    role: UserRole = UserRole.BEGINNER
    games_played: int = 0
    puzzles_solved: int = 0

class GameType(str, Enum):
    PRACTICE = "practice"
    VS_STOCKFISH = "vs_stockfish"
    PUZZLE = "puzzle"

class Game(BaseModel):
    game_id: str
    user_id: str
    game_type: GameType
    white_player: str  # "user" or "stockfish"
    black_player: str  # "user" or "stockfish"
    stockfish_level: Optional[int] = None  # 1-20
    moves: List[str] = []
    positions: List[str] = []
    analysis: List[Dict] = []
    result: Optional[str] = None
    started_at: datetime = datetime.now()
    ended_at: Optional[datetime] = None

class PuzzleAttempt(BaseModel):
    attempt_id: str
    user_id: str
    puzzle_id: str
    solved: bool
    time_taken: float
    attempted_at: datetime = datetime.now()
