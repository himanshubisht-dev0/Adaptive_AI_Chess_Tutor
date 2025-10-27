import React, { useState, useEffect } from 'react';
import { AdaptiveChessboard } from '../components/Chessboard';
import { TutorPanel } from '../components/TutorPanel';
import { chessTutorAPI } from '../services/api';

export const VsStockfish: React.FC = () => {
  const [stockfishLevel, setStockfishLevel] = useState(5);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [gameId, setGameId] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [currentFen, setCurrentFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [thinking, setThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const levelDescriptions = {
    1: { elo: 800, desc: "Beginner - Makes basic mistakes" },
    5: { elo: 1200, desc: "Intermediate - Solid play" },
    10: { elo: 1800, desc: "Advanced - Strong tactics" },
    15: { elo: 2200, desc: "Expert - Master level" },
    20: { elo: 2800, desc: "Super GM - World class" }
  };

  const startGame = async () => {
    try {
      const whitePlayer = playerColor === 'white' ? 'user' : 'stockfish';
      const blackPlayer = playerColor === 'black' ? 'user' : 'stockfish';
      
      const response = await chessTutorAPI.createGame('vs_stockfish', whitePlayer, blackPlayer, stockfishLevel);
      setGameId(response.game.game_id);
      setCurrentFen(response.game.positions[0]);
      setLastAnalysis(null);
      setGameResult(null);
      setThinking(playerColor === 'black'); // If playing black, Stockfish moves first
      
      console.log('✅ VS Stockfish game started');
      
      // If player is black, make Stockfish move first
      if (playerColor === 'black') {
        await makeStockfishMove(response.game.game_id, response.game.positions[0]);
      }
    } catch (error) {
      console.error('❌ Failed to start game:', error);
    }
  };

  const makeStockfishMove = async (gameId: string, fen: string) => {
    setThinking(true);
    try {
      // This will trigger Stockfish move in the backend
      const result = await chessTutorAPI.makeMove(gameId, 'e2e4', fen); // Dummy move to trigger Stockfish
      if (result.stockfish_move) {
        setCurrentFen(result.last_analysis.new_fen);
        setLastAnalysis(result.last_analysis);
      }
    } catch (error) {
      console.error('❌ Stockfish move failed:', error);
    } finally {
      setThinking(false);
    }
  };

  const handleMove = async (move: string, fen: string) => {
    if (!gameId || thinking) return;

    setThinking(true);
    try {
      console.log(`🎯 Player move: ${move}`);
      const result = await chessTutorAPI.makeMove(gameId, move, fen);
      
      if (result.valid) {
        setLastAnalysis(result.last_analysis);
        setCurrentFen(result.last_analysis.new_fen);
        
        if (result.game_over) {
          setGameResult(result.result);
          setThinking(false);
        } else if (result.stockfish_move) {
          // Stockfish will automatically move in the backend response
          console.log('🤖 Stockfish responded:', result.stockfish_move);
        }
      }
    } catch (error) {
      console.error('❌ Move failed:', error);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Play vs Stockfish</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Stockfish Level</label>
              <select 
                value={stockfishLevel}
                onChange={(e) => setStockfishLevel(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!!gameId}
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
                    disabled={!!gameId}
                  />
                  White
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={playerColor === 'black'}
                    onChange={() => setPlayerColor('black')}
                    className="mr-2"
                    disabled={!!gameId}
                  />
                  Black
                </label>
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={startGame}
                disabled={thinking}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {gameId ? 'New Game' : 'Start Game'}
              </button>
            </div>
          </div>
        </div>

        {gameResult && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <strong>Game Over!</strong> Result: {gameResult}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdaptiveChessboard
              onMove={handleMove}
              disabled={thinking || !gameId}
              orientation={playerColor}
              initialFen={currentFen}
              gameId={gameId}
            />
            {thinking && (
              <div className="text-center mt-4 p-4 bg-blue-100 rounded-lg">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-blue-700">
                  {playerColor === 'white' ? 'Your turn...' : 'Stockfish thinking...'}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <TutorPanel analysis={lastAnalysis} />
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Game Info</h3>
              <div className="space-y-2 text-sm">
                <p>Level: {stockfishLevel} ({levelDescriptions[stockfishLevel].elo} ELO)</p>
                <p>You are: {playerColor}</p>
                <p>Status: {gameId ? (thinking ? 'Thinking...' : 'Your turn') : 'Not started'}</p>
                {lastAnalysis && (
                  <p>Last move: {lastAnalysis.user_move}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
