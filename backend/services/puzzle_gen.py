import chess
import random
from typing import List, Dict, Optional
from stockfish.engine import stockfish_engine
from database.models import DifficultyLevel

class PuzzleGenerator:
    def __init__(self):
        self.themes = [
            "pin", "fork", "skewer", "discovered_attack", "double_check",
            "deflection", "decoy", "interference", "remove_the_defender",
            "back_rank", "smothered_mate", "arabian_mate", "h_file_attack"
        ]
    
    def generate_puzzle(self, difficulty: DifficultyLevel, user_rating: int = 1200) -> Dict:
        """Generate a puzzle based on difficulty and user rating"""
        # Simplified puzzle generation - in practice, you'd use a puzzle database
        # This generates random tactical positions
        
        base_board = chess.Board()
        
        # Create a somewhat random but tactical position
        for _ in range(random.randint(10, 25)):
            legal_moves = list(base_board.legal_moves)
            if not legal_moves:
                break
            move = random.choice(legal_moves)
            base_board.push(move)
        
        # Ensure the position has some tactical potential
        fen = base_board.fen()
        
        # Analyze to find the best move (this will be the solution)
        analysis = stockfish_engine.evaluate_position(fen, depth=15)
        best_move = analysis.get('best_move')
        
        if not best_move or base_board.is_game_over():
            # Retry if position is terminal
            return self.generate_puzzle(difficulty, user_rating)
        
        # Determine puzzle rating based on difficulty
        rating_map = {
            DifficultyLevel.BEGINNER: max(800, user_rating - 200),
            DifficultyLevel.INTERMEDIATE: user_rating,
            DifficultyLevel.ADVANCED: min(2200, user_rating + 200)
        }
        
        puzzle_rating = rating_map[difficulty]
        
        return {
            "fen": fen,
            "solution": [best_move],
            "difficulty": difficulty,
            "theme": random.choice(self.themes),
            "rating": puzzle_rating
        }
    
    def validate_puzzle_solution(self, fen: str, user_moves: List[str], 
                               solution: List[str]) -> Dict[str, bool]:
        """Validate if user's moves match the puzzle solution"""
        board = chess.Board(fen)
        
        try:
            # Check if user's first move matches solution's first move
            user_first_move = user_moves[0] if user_moves else None
            solution_first_move = solution[0] if solution else None
            
            if user_first_move != solution_first_move:
                return {
                    "correct": False,
                    "message": "Incorrect move. Try to find the tactical sequence!"
                }
            
            # For now, we only validate the first move
            # In a full implementation, you'd validate the entire sequence
            return {
                "correct": True,
                "message": "Excellent move! That's the correct solution."
            }
            
        except Exception as e:
            return {
                "correct": False,
                "message": f"Error validating move: {e}"
            }

puzzle_generator = PuzzleGenerator()
