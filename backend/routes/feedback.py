from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime
from database.db_client import db_client
from database.models import Feedback

router = APIRouter()

class FeedbackRequest(BaseModel):
    user_id: str
    puzzle_id: str = None
    move_sequence: List[str]
    correct: bool
    time_taken: float
    difficulty_level: str

@router.post("/submit")
async def submit_feedback(request: FeedbackRequest):
    """Store user performance feedback for RL training"""
    feedback = Feedback(
        feedback_id=f"fb_{datetime.now().timestamp()}",
        user_id=request.user_id,
        puzzle_id=request.puzzle_id,
        move_sequence=request.move_sequence,
        correct=request.correct,
        time_taken=request.time_taken,
        difficulty_level=request.difficulty_level
    )
    
    # Store in MongoDB
    collection = db_client.get_collection("feedback")
    result = collection.insert_one(feedback.dict())
    
    return {"success": True, "feedback_id": str(result.inserted_id)}

@router.get("/user/{user_id}")
async def get_user_feedback(user_id: str):
    """Get feedback history for a user"""
    collection = db_client.get_collection("feedback")
    feedback_data = list(collection.find({"user_id": user_id}).sort("created_at", -1).limit(50))
    
    # Convert ObjectId to string for JSON serialization
    for item in feedback_data:
        item["_id"] = str(item["_id"])
    
    return feedback_data
