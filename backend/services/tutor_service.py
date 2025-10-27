from typing import Dict, Any, Optional,List
import chess
from stockfish.engine import stockfish_engine
from reasoning.ollama_client import ollama_client
from services.rl_agent import adaptive_tutor, Action
from services.puzzle_gen import puzzle_generator
from database.models import DifficultyLevel

class TutorService:
    def __init__(self):
        self.stockfish = stockfish_engine
        self.ollama = ollama_client
        self.tutor = adaptive_tutor
        self.puzzle_gen = puzzle_generator
    
    def analyze_move(self, fen: str, move: str, user_id: str) -> Dict[str, Any]:
        """Comprehensive move analysis with AI tutoring"""
        # Validate the move
        validation_result = self.stockfish.validate_move(fen, move)
        
        if not validation_result["valid"]:
            return {
                "valid": False,
                "error": validation_result["error"],
                "explanation": "This move is not legal. Please try a different move."
            }
        
        # Get best move for comparison
        best_move = self.stockfish.get_best_move(fen)
        user_move_correct = (move == best_move)
        
        # Generate explanation
        explanation = self.ollama.explain_move(fen, move)
        
        # If move is suboptimal, provide improvement suggestion
        improvement = ""
        if not user_move_correct:
            improvement = self.ollama.suggest_improvement(fen, move, best_move)
        
        # Get adaptive tutoring decision
        action = self.tutor.decide_action(user_id, user_move_correct, 30.0)  # Default time
        
        return {
            "valid": True,
            "correct": user_move_correct,
            "new_fen": validation_result["new_fen"],
            "explanation": explanation,
            "improvement_suggestion": improvement,
            "best_move": best_move,
            "tutor_action": action.value,
            "evaluation": validation_result.get("evaluation", {})
        }
    
    def generate_adaptive_puzzle(self, user_id: str, user_rating: int) -> Dict[str, Any]:
        """Generate a puzzle adapted to user's skill level"""
        # Get current difficulty based on user performance
        state = self.tutor.get_state(user_id)
        accuracy = state[0]
        
        # Determine difficulty based on accuracy
        if accuracy < 0.4:
            difficulty = DifficultyLevel.BEGINNER
        elif accuracy < 0.7:
            difficulty = DifficultyLevel.INTERMEDIATE
        else:
            difficulty = DifficultyLevel.ADVANCED
        
        puzzle = self.puzzle_gen.generate_puzzle(difficulty, user_rating)
        
        return {
            "puzzle_id": f"puzzle_{hash(puzzle['fen'])}",  # Simple ID generation
            **puzzle
        }
    
    def provide_hint(self, fen: str, puzzle_solution: List[str], 
                    hint_level: int = 1) -> Dict[str, Any]:
        """Provide adaptive hints for puzzles"""
        if hint_level == 1:
            # Basic hint - piece to move
            board = chess.Board(fen)
            first_move = puzzle_solution[0]
            moving_piece = board.piece_at(chess.parse_square(first_move[:2]))
            
            hint = f"Consider moving your {moving_piece} to create a threat."
        elif hint_level == 2:
            # More specific hint - target square
            first_move = puzzle_solution[0]
            hint = f"Look at moving a piece to {first_move[2:4]}."
        else:
            # Direct hint - the move itself
            hint = f"The best move is {puzzle_solution[0]}."
        
        return {
            "hint_level": hint_level,
            "hint": hint,
            "max_hint_level": 3
        }

# Global tutor service
tutor_service = TutorService()
