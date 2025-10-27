from database.models import Game, GameType
from database.db_client import db_client
from services.stockfish_service import stockfish_service
from services.tutor_service import tutor_service

class GameService:
    def __init__(self):
        self.games_collection = db_client.get_collection("games")
    
    def create_game(self, user_id: str, game_type: GameType, 
                   white_player: str, black_player: str, stockfish_level: int = None) -> Game:
        game = Game(
            game_id=f"game_{datetime.now().timestamp()}",
            user_id=user_id,
            game_type=game_type,
            white_player=white_player,
            black_player=black_player,
            stockfish_level=stockfish_level,
            positions=["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
        )
        
        self.games_collection.insert_one(game.dict())
        return game
    
    def make_move(self, game_id: str, move: str, user_id: str) -> Dict:
        game_data = self.games_collection.find_one({"game_id": game_id})
        if not game_data:
            raise ValueError("Game not found")
        
        game = Game(**game_data)
        current_fen = game.positions[-1]
        
        # Validate and apply move
        analysis = tutor_service.analyze_move(current_fen, move, user_id)
        if not analysis["valid"]:
            return {"error": "Invalid move"}
        
        # Update game state
        game.moves.append(move)
        game.positions.append(analysis["new_fen"])
        game.analysis.append(analysis)
        
        # If playing vs Stockfish, get AI response
        if game.game_type == GameType.VS_STOCKFISH:
            board = chess.Board(analysis["new_fen"])
            if not board.is_game_over():
                # Determine whose turn it is
                if (len(game.moves) % 2 == 0 and game.black_player == "stockfish") or \
                   (len(game.moves) % 2 == 1 and game.white_player == "stockfish"):
                    
                    stockfish_move = stockfish_service.get_move(
                        analysis["new_fen"], 
                        game.stockfish_level
                    )
                    stockfish_analysis = tutor_service.analyze_move(
                        analysis["new_fen"], stockfish_move, "stockfish"
                    )
                    
                    game.moves.append(stockfish_move)
                    game.positions.append(stockfish_analysis["new_fen"])
                    game.analysis.append(stockfish_analysis)
        
        self.games_collection.update_one(
            {"game_id": game_id},
            {"$set": game.dict()}
        )
        
        return {
            "game": game.dict(),
            "last_analysis": analysis,
            "stockfish_move": stockfish_move if 'stockfish_move' in locals() else None
        }

game_service = GameService()
