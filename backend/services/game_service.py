from datetime import datetime
from database.models import Game, GameType
from database.db_client import db_client
from services.stockfish_service import stockfish_service
from services.tutor_service import tutor_service
import chess

class GameService:
    def __init__(self):
        self.games_collection = db_client.get_collection("games")
    
    def create_game(self, user_id: str, game_type: str, 
                   white_player: str, black_player: str, stockfish_level: int = None) -> Game:
        game = Game(
            game_id=f"game_{datetime.now().timestamp()}",
            user_id=user_id,
            game_type=GameType(game_type),
            white_player=white_player,
            black_player=black_player,
            stockfish_level=stockfish_level,
            positions=["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
            moves=[],
            analysis=[],
            started_at=datetime.now()
        )
        
        self.games_collection.insert_one(game.dict())
        return game
    
    def make_move(self, game_id: str, move: str, user_id: str) -> dict:
        game_data = self.games_collection.find_one({"game_id": game_id})
        if not game_data:
            raise ValueError("Game not found")
        
        game = Game(**game_data)
        current_fen = game.positions[-1]
        
        print(f"🎯 Processing move {move} in game {game_id}")
        
        # Analyze the move with tutor service
        analysis = tutor_service.analyze_move(current_fen, move, user_id)
        if not analysis["valid"]:
            return {"valid": False, "error": analysis["error"]}
        
        # Update game state
        game.moves.append(move)
        game.positions.append(analysis["new_fen"])
        game.analysis.append(analysis)
        
        # If playing vs Stockfish, get AI response
        stockfish_move = None
        if game.game_type == GameType.VS_STOCKFISH and game.stockfish_level:
            board = chess.Board(analysis["new_fen"])
            if not board.is_game_over():
                # Determine whose turn it is
                is_white_turn = len(game.moves) % 2 == 0
                should_stockfish_move = (
                    (is_white_turn and game.white_player == "stockfish") or
                    (not is_white_turn and game.black_player == "stockfish")
                )
                
                if should_stockfish_move:
                    print(f"🤖 Stockfish thinking (level {game.stockfish_level})...")
                    stockfish_move = stockfish_service.get_move(analysis["new_fen"], game.stockfish_level)
                    print(f"🤖 Stockfish plays: {stockfish_move}")
                    
                    stockfish_analysis = tutor_service.analyze_move(
                        analysis["new_fen"], stockfish_move, "stockfish"
                    )
                    
                    game.moves.append(stockfish_move)
                    game.positions.append(stockfish_analysis["new_fen"])
                    game.analysis.append(stockfish_analysis)
        
        # Check if game is over
        final_board = chess.Board(game.positions[-1])
        if final_board.is_game_over():
            game.result = final_board.result()
            game.ended_at = datetime.now()
        
        self.games_collection.update_one(
            {"game_id": game_id},
            {"$set": game.dict()}
        )
        
        return {
            "valid": True,
            "game": game.dict(),
            "last_analysis": analysis,
            "stockfish_move": stockfish_move,
            "game_over": final_board.is_game_over(),
            "result": game.result
        }
    
    def get_user_games(self, user_id: str):
        games_data = self.games_collection.find({"user_id": user_id}).sort("started_at", -1)
        return [Game(**game) for game in games_data]
    
    def get_game(self, game_id: str) -> Game:
        game_data = self.games_collection.find_one({"game_id": game_id})
        if not game_data:
            raise ValueError("Game not found")
        return Game(**game_data)

game_service = GameService()
