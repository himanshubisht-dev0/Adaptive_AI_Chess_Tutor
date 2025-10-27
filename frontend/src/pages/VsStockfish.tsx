import React, { useState } from 'react';
import { EnhancedChessboard } from '../components/ChessBoard/EnhancedChessboard';
import { TutorPanel } from '../components/TutorPanel/TutorPanel';
import { useAnime } from '../hooks/useAnime';
import { chessTutorAPI } from '../services/api';

export const VsStockfish: React.FC = () => {
  const [stockfishLevel, setStockfishLevel] = useState(5);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [gameId, setGameId] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [thinking, setThinking] = useState(false);
  const { animatePieceMove, animateCheck } = useAnime();

  const levelDescriptions = {
    1: { elo: 800, desc: "Beginner - Makes basic mistakes" },
    5: { elo: 1200, desc: "Intermediate - Solid play" },
    10: { elo: 1800, desc: "Advanced - Strong tactics" },
    15: { elo: 2200, desc: "Expert - Master level" },
    20: { elo: 2800, desc: "Super GM - World class" }
  };

  const startGame = async () => {
    const game = await chessTutorAPI.createGame(
      'vs_stockfish',
      playerColor === 'white' ? 'user' : 'stockfish',
      playerColor === 'black' ? 'user' : 'stockfish',
      stockfishLevel
    );
    setGameId(game.game_id);
    setLastAnalysis(null);
  };

  const handleMove = async (move: string) => {
    if (!gameId) return;

    setThinking(true);
    try {
      const result = await chessTutorAPI.makeMove(gameId, move, 'user');
      setLastAnalysis(result.last_analysis);
      
      // Animate the move
      animatePieceMove(move.substring(0, 2), move.substring(2, 4));
      
      // If check, animate king square
      if (result.last_analysis.evaluation?.score_mate) {
        // This would require detecting king position
      }
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Play vs Stockfish</h1>
        
        {/* Game Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Stockfish Level</label>
              <select 
                value={stockfishLevel}
                onChange={(e) => setStockfishLevel(Number(e.target.value))}
                className="w-full rounded-md border-gray-300"
              >
                {[1, 5, 10, 15, 20].map(level => (
                  <option key={level} value={level}>
                    Level {level} ({levelDescriptions[level].elo} ELO)
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {levelDescriptions[stockfishLevel].desc}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Your Color</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={playerColor === 'white'}
                    onChange={() => setPlayerColor('white')}
                    className="mr-2"
                  />
                  White
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={playerColor === 'black'}
                    onChange={() => setPlayerColor('black')}
                    className="mr-2"
                  />
                  Black
                </label>
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={startGame}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                {gameId ? 'Restart Game' : 'Start Game'}
              </button>
            </div>
          </div>
        </div>

        {/* Game Board and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedChessboard
              onMove={handleMove}
              disabled={!gameId || thinking}
              orientation={playerColor}
            />
            {thinking && (
              <div className="text-center mt-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Stockfish is thinking...</span>
              </div>
            )}
          </div>
          
          <div>
            <TutorPanel analysis={lastAnalysis} />
            
            {/* Game Info */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h3 className="font-semibold mb-2">Game Information</h3>
              <p>Level: {stockfishLevel} ({levelDescriptions[stockfishLevel].elo} ELO)</p>
              <p>You are playing as: {playerColor}</p>
              {lastAnalysis && (
                <p>Moves: {lastAnalysis.game?.moves?.length || 0}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
