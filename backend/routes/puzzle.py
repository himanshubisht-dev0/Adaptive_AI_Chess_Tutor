from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from services.tutor_service import tutor_service

router = APIRouter()

class PuzzleRequest(BaseModel):
    user_id: str
    user_rating: int

class PuzzleSolutionRequest(BaseModel):
    puzzle_id: str
    user_moves: List[str]
    user_id: str

class HintRequest(BaseModel):
    fen: str
    puzzle_solution: List[str]
    hint_level: int

@router.post("/generate")
async def generate_puzzle(request: PuzzleRequest):
    """Generate an adaptive puzzle for the user"""
    return tutor_service.generate_adaptive_puzzle(request.user_id, request.user_rating)

@router.post("/validate")
async def validate_puzzle_solution(request: PuzzleSolutionRequest):
    """Validate a puzzle solution"""
    # In a full implementation, you'd retrieve the puzzle from database
    # For now, we'll use a simplified validation
    from services.puzzle_gen import puzzle_generator
    
    # This is a simplified validation - in practice, you'd look up the puzzle
    result = puzzle_generator.validate_puzzle_solution(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",  # Default start
        request.user_moves,
        ["e2e4"]  # Default solution
    )
    
    return result

@router.post("/hint")
async def get_hint(request: HintRequest):
    """Get a hint for the current puzzle"""
    return tutor_service.provide_hint(request.fen, request.puzzle_solution, request.hint_level)
