import React, { useState, useEffect } from 'react';
import { MoveAnalysis } from '../services/api';

interface TutorPanelProps {
  analysis: MoveAnalysis | null;
  onRequestHint?: () => void;
  onShowBetterMove?: () => void;
}

export const TutorPanel: React.FC<TutorPanelProps> = ({
  analysis,
  onRequestHint,
  onShowBetterMove
}) => {
  const [tutorAction, setTutorAction] = useState<string>('');

  useEffect(() => {
    if (analysis) {
      // Map tutor action to meaningful text
      const actions = [
        'Increasing difficulty',
        'Decreasing difficulty', 
        'Maintaining current level',
        'Providing hint',
        'No hint needed'
      ];
      setTutorAction(actions[analysis.tutor_action] || 'Analyzing...');
    }
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">♟️</div>
          <p>Make a move to get AI tutoring feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-64 overflow-y-auto">
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
          analysis.correct 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {analysis.correct ? '✓ Correct Move' : '✗ Suboptimal Move'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Tutor Action: {tutorAction}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Explanation:</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {analysis.explanation}
          </p>
        </div>

        {!analysis.correct && analysis.improvement_suggestion && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Improvement Suggestion:</h3>
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
              {analysis.improvement_suggestion}
            </p>
          </div>
        )}

        {analysis.evaluation && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Position Evaluation:</h3>
            <div className="text-sm text-gray-600">
              {analysis.evaluation.score_cp && (
                <span>Score: {analysis.evaluation.score_cp > 0 ? '+' : ''}{analysis.evaluation.score_cp / 100}</span>
              )}
              {analysis.evaluation.score_mate && (
                <span> | Mate in {Math.abs(analysis.evaluation.score_mate)}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {onRequestHint && (
          <button
            onClick={onRequestHint}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
          >
            💡 Get Hint
          </button>
        )}
        {onShowBetterMove && !analysis.correct && (
          <button
            onClick={onShowBetterMove}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 text-sm"
          >
            🔍 Show Better Move
          </button>
        )}
      </div>
    </div>
  );
};
