import React, { useState, useEffect } from 'react';
import { AdaptiveChessboard } from './Chessboard';
import { TutorPanel } from './TutorPanel';
import { chessTutorAPI, Puzzle, MoveAnalysis } from '../services/api';

interface PuzzleModeProps {
  userId: string;
  userRating: number;
}

export const PuzzleMode: React.FC<PuzzleModeProps> = ({ userId, userRating }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<MoveAnalysis | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [stats, setStats] = useState({
    puzzlesAttempted: 0,
    puzzlesSolved: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadNewPuzzle();
  }, [userId, userRating]);

  const loadNewPuzzle = async () => {
    try {
      const puzzle = await chessTutorAPI.generatePuzzle(userId, userRating);
      setCurrentPuzzle(puzzle);
      setMoveHistory([]);
      setLastAnalysis(null);
      setIsSolved(false);
      setHintLevel(0);
    } catch (error) {
      console.error('Error loading puzzle:', error);
    }
  };

  const handleMoveAnalysis = async (analysis: MoveAnalysis) => {
    setLastAnalysis(analysis);
    
    // Add move to history
    const newMoveHistory = [...moveHistory, analysis.new_fen.split(' ')[0]];
    setMoveHistory(newMoveHistory);

    // Check if puzzle is solved
    if (analysis.correct && currentPuzzle) {
      setIsSolved(true);
      setStats(prev => ({
        ...prev,
        puzzlesSolved: prev.puzzlesSolved + 1,
        currentStreak: prev.currentStreak + 1,
        puzzlesAttempted: prev.puzzlesAttempted + 1
      }));

      // Submit feedback
      await chessTutorAPI.submitFeedback({
        user_id: userId,
        puzzle_id: currentPuzzle.puzzle_id,
        move_sequence: newMoveHistory,
        correct: true,
        time_taken: 30, // This would be calculated based on actual time
        difficulty_level: currentPuzzle.difficulty
      });
    } else if (!analysis.correct) {
      setStats(prev => ({
        ...prev,
        puzzlesAttempted: prev.puzzlesAttempted + 1,
        currentStreak: 0
      }));
    }
  };

  const handleRequestHint = async () => {
    if (!currentPuzzle) return;
    
    try {
      const hint = await chessTutorAPI.getHint(
        currentPuzzle.fen,
        currentPuzzle.solution,
        hintLevel + 1
      );
      setHintLevel(hint.hint_level);
      
      // Show hint in analysis panel
      setLastAnalysis({
        ...lastAnalysis!,
        explanation: `Hint: ${hint.hint}`
      } as MoveAnalysis);
    } catch (error) {
      console.error('Error getting hint:', error);
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Chess Puzzle</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Difficulty: {currentPuzzle.difficulty}</span>
            <span>Theme: {currentPuzzle.theme}</span>
            <span>Rating: {currentPuzzle.rating}</span>
          </div>
        </div>

        <AdaptiveChessboard
          userId={userId}
          onMoveAnalysis={handleMoveAnalysis}
          initialFen={currentPuzzle.fen}
          mode="puzzle"
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={loadNewPuzzle}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            New Puzzle
          </button>
          {!isSolved && (
            <button
              onClick={handleRequestHint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Hint ({hintLevel}/3)
            </button>
          )}
        </div>
      </div>

      <div>
        <TutorPanel
          analysis={lastAnalysis}
          onRequestHint={handleRequestHint}
        />

        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Puzzle Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.puzzlesAttempted}</div>
              <div className="text-xs text-gray-500">Attempted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.puzzlesSolved}</div>
              <div className="text-xs text-gray-500">Solved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>
        </div>

        {isSolved && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Congratulations!</strong> You solved the puzzle correctly!
          </div>
        )}
      </div>
    </div>
  );
};
