from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import chess

from services.game_service import game_service
from services.auth_service import auth_service
from database.models import Game, GameType

router = APIRouter()

class CreateGameRequest(BaseModel):
    game_type: str
    white_player: str
    black_player: str
    stockfish_level: Optional[int] = None

class MakeMoveRequest(BaseModel):
    game_id: str
    move: str
    fen: str

def get_current_user(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.post("/create")
async def create_game(request: CreateGameRequest, user: dict = Depends(get_current_user)):
    try:
        game = game_service.create_game(
            user.user_id,
            request.game_type,
            request.white_player,
            request.black_player,
            request.stockfish_level
        )
        return {"success": True, "game": game.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/move")
async def make_move(request: MakeMoveRequest, user: dict = Depends(get_current_user)):
    try:
        # Validate the move locally first
        board = chess.Board(request.fen)
        try:
            move = chess.Move.from_uci(request.move)
            if move not in board.legal_moves:
                return {"valid": False, "error": "Illegal move"}
        except ValueError:
            return {"valid": False, "error": "Invalid move notation"}
        
        result = game_service.make_move(request.game_id, request.move, user.user_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
async def get_user_games(user_id: str):
    try:
        games = game_service.get_user_games(user_id)
        return {"success": True, "games": [game.dict() for game in games]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{game_id}")
async def get_game(game_id: str, user: dict = Depends(get_current_user)):
    try:
        game = game_service.get_game(game_id)
        if game.user_id != user.user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        return {"success": True, "game": game.dict()}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
