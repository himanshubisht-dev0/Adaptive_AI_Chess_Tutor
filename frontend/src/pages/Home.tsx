import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  useEffect(() => {
    // Lazy-load anime.js to keep bundle light
    import('animejs').then(({ default: anime }) => {
      anime.timeline({ easing: 'easeOutQuad' })
        .add({ targets: '.hero-title', opacity: [0, 1], translateY: [-12, 0], duration: 600 })
        .add({ targets: '.hero-subtitle', opacity: [0, 1], translateY: [-10, 0], duration: 500 }, '-=200')
        .add({ targets: '.feature-card', opacity: [0, 1], translateY: [20, 0], duration: 500, delay: anime.stagger(120) }, '-=200');
      anime({ targets: '.cta-button', scale: [0.95, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack', delay: 800 });
      anime({ targets: '.how-step', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(120, { start: 1000 }), duration: 500 });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="hero-title text-5xl font-bold text-gray-800 mb-4">
            Adaptive AI Chess Tutor
          </h1>
          <p className="hero-subtitle text-xl text-gray-600 max-w-2xl mx-auto">
            Learn chess with personalized AI coaching. Our system adapts to your skill level 
            and provides real-time feedback using state-of-the-art AI models.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="feature-card bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Tutoring</h3>
            <p className="text-gray-600">
              Get instant explanations and suggestions from Mistral AI running locally via Ollama
            </p>
          </div>

          <div className="feature-card bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">
              Reinforcement learning adjusts difficulty based on your performance and improvement
            </p>
          </div>

          <div className="feature-card bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">♟️</div>
            <h3 className="text-xl font-semibold mb-2">Professional Analysis</h3>
            <p className="text-gray-600">
              Stockfish engine provides professional-level move validation and analysis
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/learn"
            className="cta-button inline-block bg-chess-dark text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-chess-light hover:text-chess-dark transition-colors"
          >
            Start Learning Now
          </Link>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="how-step text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold">Make a Move</h4>
              <p className="text-sm text-gray-600">Play on the interactive chessboard</p>
            </div>
            <div className="how-step text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold">AI Analysis</h4>
              <p className="text-sm text-gray-600">Get instant feedback from our AI tutor</p>
            </div>
            <div className="how-step text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold">Adaptive Puzzles</h4>
              <p className="text-sm text-gray-600">Solve puzzles tailored to your skill level</p>
            </div>
            <div className="how-step text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold">Track Progress</h4>
              <p className="text-sm text-gray-600">Monitor your improvement with detailed analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
