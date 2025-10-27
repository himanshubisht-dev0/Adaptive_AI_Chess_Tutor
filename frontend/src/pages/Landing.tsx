import React from 'react';
import { Link } from 'react-router-dom';
import { useAnime } from '../hooks/useAnime';

export const Landing: React.FC = () => {
  const { animateBoardHighlight } = useAnime();

  React.useEffect(() => {
    // Initial animation
    animateBoardHighlight(['e2', 'e4', 'g1', 'f3']);
  }, []);

  const gameOptions = [
    {
      title: "🎯 Practice Mode",
      description: "Play both sides and analyze moves with AI tutor",
      path: "/practice",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "🤖 Vs Stockfish",
      description: "Play against AI at different difficulty levels",
      path: "/vs-stockfish",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "🧩 Puzzle Rush",
      description: "Solve puzzles based on your rating",
      path: "/puzzles",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "📊 My Progress",
      description: "View your games and improvement",
      path: "/profile",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ♟️ Chess Master Pro
          </h1>
          <p className="text-xl text-gray-300">
            Learn, Practice, and Master Chess with AI Assistance
          </p>
        </div>

        {/* Game Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {gameOptions.map((option, index) => (
            <Link
              key={index}
              to={option.path}
              className={`${option.color} text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300`}
              onMouseEnter={() => animateBoardHighlight(['d2', 'd4', 'c4'])}
            >
              <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
              <p className="text-sm opacity-90">{option.description}</p>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Chess Master Pro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p>Get instant feedback on every move with AI explanations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Learning</h3>
              <p>AI adjusts difficulty based on your skill level</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p>Monitor your improvement with detailed analytics</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 text-center text-white">
          <p className="text-lg">
            Join thousands of players improving their chess skills daily!
          </p>
        </div>
      </div>
    </div>
  );
};
