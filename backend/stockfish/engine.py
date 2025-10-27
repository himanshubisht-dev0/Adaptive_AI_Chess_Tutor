import chess
import chess.engine
import os
import shutil
from typing import Optional, Dict, Any

class StockfishEngine:
    def __init__(self, stockfish_path: str = None):
        self.stockfish_path = stockfish_path or self._find_stockfish()
        self.engine = None
    
    def _find_stockfish(self) -> str:
        # 1) Explicit env var
        env_path = os.getenv("STOCKFISH_PATH")
        if env_path and os.path.exists(env_path):
            return env_path

        # 2) Local project binary: backend/stockfish/bin/stockfish.exe
        local_bin = os.path.join(os.path.dirname(__file__), "bin", "stockfish.exe")
        if os.path.exists(local_bin):
            return local_bin

        # 3) Common install paths (Linux/macOS/Windows)
        possible_paths = [
            "/usr/bin/stockfish",
            "/usr/local/bin/stockfish",
            "/opt/homebrew/bin/stockfish",  # macOS Homebrew
            r"C:\Program Files\Stockfish\stockfish.exe",
            r"C:\Program Files (x86)\Stockfish\stockfish.exe",
            r"D:\projects\Adaptive_AI_Tutor\backend\stockfish\bin\stockfish-windows-x86-64-avx2.exe"
        ]
        for path in possible_paths:
            if os.path.exists(path):
                return path

        # 4) PATH lookup
        which_path = shutil.which("stockfish") or shutil.which("stockfish.exe")
        if which_path:
            return which_path

        raise Exception("Stockfish not found. Please install Stockfish or set STOCKFISH_PATH.")
    
    def start_engine(self):
        if not self.engine:
            self.engine = chess.engine.SimpleEngine.popen_uci(self.stockfish_path)
    
    def stop_engine(self):
        if self.engine:
            self.engine.quit()
            self.engine = None
    
    def evaluate_position(self, fen: str, depth: int = 15) -> Dict[str, Any]:
        """Evaluate a chess position and return analysis"""
        self.start_engine()
        board = chess.Board(fen)
        
        try:
            info = self.engine.analyse(board, chess.engine.Limit(depth=depth))
            score = info["score"]
            
            return {
                "score_cp": score.white().score(mate_score=10000),
                "score_mate": score.white().mate(),
                "best_move": str(info.get("pv", [])[0]) if info.get("pv") else None,
                "depth": depth
            }
        except Exception as e:
            print(f"Error evaluating position: {e}")
            return {"error": str(e)}
    
    def validate_move(self, fen: str, move: str) -> Dict[str, Any]:
        """Validate if a move is legal and sound"""
        board = chess.Board(fen)
        
        try:
            chess_move = chess.Move.from_uci(move)
            if chess_move not in board.legal_moves:
                return {
                    "valid": False,
                    "error": "Illegal move"
                }
            
            # Make the move and evaluate
            board.push(chess_move)
            evaluation = self.evaluate_position(board.fen())
            
            return {
                "valid": True,
                "new_fen": board.fen(),
                "evaluation": evaluation
            }
        except ValueError:
            return {
                "valid": False,
                "error": "Invalid move notation"
            }
    
    def get_best_move(self, fen: str, depth: int = 15) -> str:
        """Get the best move for a position"""
        self.start_engine()
        board = chess.Board(fen)
        
        result = self.engine.play(board, chess.engine.Limit(depth=depth))
        return result.move.uci()

# Global engine instance
stockfish_engine = StockfishEngine()
