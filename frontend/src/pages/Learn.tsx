import React, { useState } from 'react';
import { AdaptiveChessboard } from '../components/Chessboard';
import { TutorPanel } from '../components/TutorPanel';
import { PuzzleMode } from '../components/PuzzleMode';
import { MoveAnalysis } from '../services/api';

export const Learn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'practice' | 'puzzles'>('practice');
  const [lastAnalysis, setLastAnalysis] = useState<MoveAnalysis | null>(null);
  const [userId] = useState('user_123'); // In real app, this would come from auth

  const handleMoveAnalysis = (analysis: MoveAnalysis) => {
    setLastAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chess Learning Center</h1>
          <p className="text-gray-600">Practice and improve your chess skills with AI guidance</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'practice'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('practice')}
          >
            Practice Mode
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'puzzles'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('puzzles')}
          >
            Adaptive Puzzles
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'practice' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Practice Board</h2>
                <AdaptiveChessboard
                  userId={userId}
                  onMoveAnalysis={handleMoveAnalysis}
                />
              </div>
            </div>
            <div>
              <TutorPanel analysis={lastAnalysis} />
            </div>
          </div>
        ) : (
          <PuzzleMode userId={userId} userRating={1200} />
        )}
      </div>
    </div>
  );
};
