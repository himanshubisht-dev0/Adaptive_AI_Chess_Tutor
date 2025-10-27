import React, { useState, useEffect } from 'react';
import { AdaptiveChessboard } from '../components/Chessboard';
import { TutorPanel } from '../components/TutorPanel';
import { chessTutorAPI } from '../services/api';

export const Practice: React.FC = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [currentFen, setCurrentFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const startGame = async () => {
    try {
      const response = await chessTutorAPI.createGame('practice', 'user', 'user');
      setGameId(response.game.game_id);
      setCurrentFen(response.game.positions[0]);
      setLastAnalysis(null);
      setGameHistory([]);
      console.log('✅ Practice game started:', response.game.game_id);
    } catch (error) {
      console.error('❌ Failed to start game:', error);
    }
  };

  const handleMove = async (move: string, fen: string) => {
    if (!gameId) return;

    try {
      console.log(`🎯 Making move: ${move}`);
      const result = await chessTutorAPI.makeMove(gameId, move, fen);
      
      if (result.valid) {
        setLastAnalysis(result.last_analysis);
        setCurrentFen(result.last_analysis.new_fen);
        setGameHistory(prev => [...prev, result.last_analysis]);
        
        console.log('✅ Move successful:', result.last_analysis.correct ? 'Correct' : 'Incorrect');
      } else {
        console.error('❌ Invalid move:', result.error);
      }
    } catch (error) {
      console.error('❌ Move failed:', error);
    }
  };

  useEffect(() => {
    // Auto-start a practice game when component mounts
    startGame();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Practice Mode</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
            >
              {gameId ? 'Restart Practice' : 'Start Practice Game'}
            </button>
            <p className="text-gray-600 mt-2">
              Play both sides and get instant AI feedback on every move
            </p>
            {gameId && (
              <p className="text-sm text-gray-500 mt-1">Game ID: {gameId}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdaptiveChessboard
              onMove={handleMove}
              initialFen={currentFen}
              orientation="white"
              showAnalysis={true}
              gameId={gameId}
            />
          </div>
          
          <div className="space-y-6">
            <TutorPanel analysis={lastAnalysis} />
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">Game Information</h3>
              <div className="space-y-2 text-sm">
                <p>Moves: {gameHistory.length}</p>
                <p>Current FEN: {currentFen.split(' ')[0]}...</p>
                {lastAnalysis && (
                  <>
                    <p>Last move: {lastAnalysis.user_move}</p>
                    <p>Best move: {lastAnalysis.best_move}</p>
                    <p className={lastAnalysis.correct ? 'text-green-600' : 'text-red-600'}>
                      Status: {lastAnalysis.correct ? 'Correct ✅' : 'Incorrect ❌'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
