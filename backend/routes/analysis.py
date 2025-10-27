from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.tutor_service import tutor_service
from services.auth_service import auth_service

router = APIRouter()

class AnalyzeMoveRequest(BaseModel):
    fen: str
    move: str

def get_current_user(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.post("/move")
async def analyze_move(request: AnalyzeMoveRequest, user: dict = Depends(get_current_user)):
    try:
        analysis = tutor_service.analyze_move(request.fen, request.move, user.user_id)
        return {"success": True, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/position/{fen}")
async def analyze_position(fen: str, user: dict = Depends(get_current_user)):
    try:
        from stockfish.engine import stockfish_engine
        analysis = stockfish_engine.evaluate_position(fen)
        return {"success": True, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
