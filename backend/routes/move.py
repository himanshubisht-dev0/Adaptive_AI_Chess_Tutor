from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Dict, Any
import json
from services.tutor_service import tutor_service

router = APIRouter()

class MoveRequest(BaseModel):
    fen: str
    move: str
    user_id: str

class MoveResponse(BaseModel):
    valid: bool
    correct: bool
    new_fen: str
    explanation: str
    improvement_suggestion: str
    best_move: str
    tutor_action: int
    evaluation: Dict[str, Any]

@router.post("/analyze", response_model=MoveResponse)
async def analyze_move(request: MoveRequest):
    """Analyze a chess move with AI tutoring"""
    return tutor_service.analyze_move(request.fen, request.move, request.user_id)

@router.websocket("/ws/tutor")
async def websocket_tutor(websocket: WebSocket):
    """WebSocket endpoint for real-time tutoring"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            move_data = json.loads(data)
            
            # Analyze the move
            result = tutor_service.analyze_move(
                move_data["fen"], 
                move_data["move"], 
                move_data["user_id"]
            )
            
            # Send back analysis
            await websocket.send_text(json.dumps(result))
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        error_response = {"error": str(e)}
        await websocket.send_text(json.dumps(error_response))
