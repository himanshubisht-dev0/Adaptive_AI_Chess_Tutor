import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { chessTutorAPI } from '../services/api';

interface StatsDashboardProps {
  userId: string;
}

interface UserStats {
  eloRating: number;
  accuracy: number;
  gamesPlayed: number;
  puzzlesSolved: number;
  improvementTrend: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats>({
    eloRating: 1200,
    accuracy: 0,
    gamesPlayed: 0,
    puzzlesSolved: 0,
    improvementTrend: 0
  });
  
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [recentGames, _setRecentGames] = useState<any[]>([]);

  useEffect(() => {
    loadUserStats();
    loadPerformanceData();
  }, [userId]);

  const loadUserStats = async () => {
    try {
      // This would typically come from your backend
      // For now, using mock data
      const feedback = await chessTutorAPI.getUserFeedback(userId);
      
      const calculatedStats: UserStats = {
        eloRating: 1200 + (feedback.length * 10),
        accuracy: feedback.filter((f: any) => f.correct).length / Math.max(feedback.length, 1),
        gamesPlayed: feedback.length,
        puzzlesSolved: feedback.filter((f: any) => f.correct).length,
        improvementTrend: 0.5 // This would be calculated from historical data
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPerformanceData = () => {
    // Mock performance data - in real app, this would come from backend
    const mockData = [
      { date: 'Jan', accuracy: 45, elo: 1200 },
      { date: 'Feb', accuracy: 52, elo: 1250 },
      { date: 'Mar', accuracy: 58, elo: 1280 },
      { date: 'Apr', accuracy: 63, elo: 1320 },
      { date: 'May', accuracy: 67, elo: 1350 },
    ];
    
    setPerformanceData(mockData);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.eloRating}</div>
          <div className="text-sm text-gray-500">ELO Rating</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">{(stats.accuracy * 100).toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Accuracy</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.gamesPlayed}</div>
          <div className="text-sm text-gray-500">Games Played</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.puzzlesSolved}</div>
          <div className="text-sm text-gray-500">Puzzles Solved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-red-600">+{stats.improvementTrend}%</div>
          <div className="text-sm text-gray-500">Improvement</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-700 mb-4">ELO Rating Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="elo" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-700 mb-4">Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {recentGames.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No recent activity. Start playing to see your progress!
            </div>
          ) : (
            recentGames.map((game, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Puzzle #{game.id}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  game.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {game.correct ? 'Solved' : 'Attempted'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
