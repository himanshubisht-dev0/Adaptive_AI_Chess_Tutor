import chess
import chess.engine
import random
from typing import Dict, List

class MultiLevelStockfish:
    def __init__(self, stockfish_path: str = "stockfish"):
        self.engine = chess.engine.SimpleEngine.popen_uci(stockfish_path)
        self.levels = {
            1: {"depth": 1, "skill": 0, "time": 0.1},   # 800 ELO
            5: {"depth": 5, "skill": 10, "time": 0.5},  # 1200 ELO
            10: {"depth": 10, "skill": 15, "time": 1.0}, # 1800 ELO
            15: {"depth": 15, "skill": 20, "time": 2.0}, # 2200 ELO
            20: {"depth": 20, "skill": 20, "time": 3.0}  # 2800 ELO
        }
    
    def get_move(self, fen: str, level: int) -> str:
        board = chess.Board(fen)
        level_config = self.levels.get(level, self.levels[10])
        
        # Add some randomness for lower levels to simulate human mistakes
        if level <= 5 and random.random() < 0.3:
            legal_moves = list(board.legal_moves)
            return random.choice(legal_moves).uci()
        
        result = self.engine.play(
            board,
            chess.engine.Limit(
                depth=level_config["depth"],
                time=level_config["time"]
            )
        )
        return result.move.uci()
    
    def get_level_description(self, level: int) -> Dict:
        descriptions = {
            1: {"elo": 800, "description": "Beginner - Makes basic mistakes"},
            5: {"elo": 1200, "description": "Intermediate - Solid fundamentals"},
            10: {"elo": 1800, "description": "Advanced - Strong tactical player"},
            15: {"elo": 2200, "description": "Expert - Master level"},
            20: {"elo": 2800, "description": "Super GM - World class"}
        }
        return descriptions.get(level, descriptions[10])

stockfish_service = MultiLevelStockfish()
