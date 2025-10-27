🎯 Adaptive AI Chess Tutor - Complete Chess Learning Platform
Chess Master ProFastAPIReactOllamaStockfish

A comprehensive chess learning platform that combines professional chess analysis with AI-powered tutoring. Play against Stockfish at various difficulty levels, practice with instant move analysis, and solve adaptive puzzles - all with real-time AI explanations using Mistral model via Ollama.

🌟 Features
🎮 Game Modes
Practice Mode: Play both sides with real-time AI analysis
Vs Stockfish: Challenge AI at 20 different difficulty levels (800-2800 ELO)
Puzzle Mode: Adaptive puzzles based on your skill level
Instant Analysis: Get AI explanations for every move
🤖 AI Integration
Ollama + Mistral: Local AI model for natural language explanations
Stockfish Integration: Professional-grade move validation and analysis
Adaptive Learning: Reinforcement learning agent personalizes difficulty
Real-time Tutoring: WebSocket-based live feedback
💻 Technical Features
Full-Stack TypeScript: React frontend with FastAPI backend
MongoDB Atlas: Cloud database for user progress tracking
Redis Caching: Optimized performance for repeated positions
Anime.js Animations: Smooth chess piece movements and highlights
JWT Authentication: Secure user accounts and game history
📋 Prerequisites
Before installation, ensure you have:

Python 3.8+ (Download)
Node.js 16+ (Download)
MongoDB Atlas Account (Sign up)
Ollama (Installation)
Stockfish (Download)
🚀 Quick Start
1. Clone the Repository
git clone https://github.com/yourusername/adaptive-ai-chess-tutor.git
cd adaptive-ai-chess-tutor
2. Backend Setup
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
3. Frontend Setup
cd frontend
npm install

# Set up frontend environment
cp .env.example .env
# Edit .env with your backend API URL
4. AI Services Setup
# Install Ollama and pull Mistral model
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral
ollama serve

# Install Stockfish
# On Windows: Download from stockfishchess.org and place in backend/stockfish/bin/
# On Mac: brew install stockfish
# On Ubuntu: sudo apt install stockfish
5. Run the Application
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
Visit http://localhost:3000 to start using the application!

🏗️ Project Structure
```
adaptive-ai-chess-tutor/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application entry point
│   ├── routes/             # API endpoints
│   │   ├── auth.py         # Authentication routes
│   │   ├── game.py         # Game management
│   │   ├── analysis.py     # Move analysis
│   │   └── puzzle.py       # Puzzle endpoints
│   ├── services/           # Business logic
│   │   ├── auth_service.py # User authentication
│   │   ├── game_service.py # Game logic
│   │   ├── tutor_service.py # AI tutoring
│   │   ├── stockfish_service.py # Stockfish integration
│   │   └── rl_agent.py     # Reinforcement learning
│   ├── reasoning/          # AI components
│   │   └── ollama_client.py # Ollama integration
│   ├── database/           # MongoDB models
│   │   ├── models.py       # Pydantic models
│   │   └── db_client.py    # Database connection
│   ├── stockfish/          # Chess engine
│   │   ├── engine.py       # Stockfish wrapper
│   │   └── bin/            # Stockfish binary
│   └── cache/              # Caching layer
│       └── cache_manager.py # Redis/LRU cache
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Chessboard.tsx # Interactive chessboard
│   │   │   ├── TutorPanel.tsx # AI analysis display
│   │   │   ├── PuzzleMode.tsx # Puzzle interface
│   │   │   └── Auth/       # Authentication components
│   │   ├── pages/          # Application pages
│   │   │   ├── Landing.tsx # Main landing page
│   │   │   ├── Practice.tsx # Practice mode
│   │   │   ├── VsStockfish.tsx # Vs AI mode
│   │   │   └── Profile.tsx # User profile
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useAnime.ts # Anime.js animations
│   │   └── services/       # API services
│   │       └── api.ts      # HTTP client
│   └── public/             # Static assets
└── docker-compose.yml      # Docker configuration
```
🔧 Configuration
Environment Variables
Backend (.env)

MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/chess_tutor
JWT_SECRET=your-super-secret-jwt-key
STOCKFISH_PATH=/usr/bin/stockfish  # or backend/stockfish/bin/stockfish.exe on Windows
OLLAMA_BASE_URL=http://localhost:11434
USE_REDIS=false
REDIS_URL=redis://localhost:6379
Frontend (.env)

VITE_API_URL=http://localhost:8000/api
🎯 API Endpoints
Authentication
POST /api/auth/signup - Create new user account
POST /api/auth/signin - User login
GET /api/auth/me - Get current user
Game Management
POST /api/game/create - Create new game
POST /api/game/move - Make a move
GET /api/game/user/{user_id} - Get user games
GET /api/game/{game_id} - Get specific game
AI Analysis
POST /api/analysis/move - Analyze chess move
GET /api/analysis/position/{fen} - Analyze position
Puzzles
POST /api/puzzle/generate - Generate adaptive puzzle
POST /api/puzzle/validate - Validate puzzle solution
🚀 Deployment
Docker Deployment (Recommended)
# Build and run with Docker
docker-compose up --build

# Access at http://localhost:8000
Manual Deployment
# Backend (Port 8000)
cd backend
python main.py

# Frontend (Port 3000)  
cd frontend
npm run dev
Production Deployment
The application is configured for easy deployment on:

Railway.app (Backend + Database)
Vercel (Frontend)
MongoDB Atlas (Database)
Redis Cloud (Caching)
🧠 AI Components
Ollama Integration
The project uses Ollama with Mistral model for natural language explanations:

# Example Ollama prompt for chess explanations
prompt = """
You are an expert chess tutor. Explain the move {move} in position {fen}.
Focus on tactical and strategic implications.
"""
Stockfish Integration
Professional chess engine for move validation and analysis:

# Stockfish analysis example
analysis = stockfish_engine.evaluate_position(fen, depth=15)
# Returns: score, best moves, positional evaluation
Adaptive Learning
Reinforcement learning agent that personalizes difficulty:

# RL state representation
state = [accuracy, response_time, streak, difficulty, improvement_rate]
action = agent.select_action(state)  # Adjust difficulty or provide hints
🎮 How to Use
1. Practice Mode
Play both white and black pieces
Get instant AI feedback after each move
Learn strategic concepts through explanations
No pressure - focus on learning
2. Vs Stockfish Mode
Choose from 20 difficulty levels (800-2800 ELO)
Select your color (white or black)
Receive real-time analysis during game
Review game with AI commentary
3. Puzzle Mode
Solve tactical puzzles adapted to your skill level
Get hints when stuck
Track your puzzle rating progress
Focus on specific tactical themes
📊 Performance Metrics
The system tracks:

ELO Rating: Your overall chess strength
Accuracy Percentage: Move quality assessment
Puzzle Success Rate: Tactical pattern recognition
Learning Progress: Improvement over time
🐛 Troubleshooting
Common Issues
Ollama Connection Failed

# Check if Ollama is running
ollama serve

# Test connection
curl http://localhost:11434/api/tags
Stockfish Not Found

# Verify Stockfish installation
stockfish

# On Windows, ensure stockfish.exe is in backend/stockfish/bin/
MongoDB Connection Issues

# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database

# Test connection
python -c "from database.db_client import db_client; db_client.connect()"
Frontend Build Errors

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
🤝 Contributing
We welcome contributions! Please see our contributing guidelines:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Development Setup
# Set up development environment
pip install -r backend/requirements-dev.txt
npm install  # in frontend directory

# Run tests
pytest backend/tests/
npm test  # in frontend directory
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Stockfish team for the powerful chess engine
Ollama for easy local AI model deployment
MongoDB Atlas for free-tier database hosting
FastAPI and React communities for excellent documentation
📞 Support
If you encounter any problems or have questions:

Check the Troubleshooting section
Search existing GitHub Issues
Create a new issue with detailed information
Email support: your-email@domain.com
🚀 Future Enhancements
 Multiplayer online games
 Opening repertoire trainer
 Endgame practice mode
 Mobile app version
 Video lesson integration
 Tournament organization
Happy Learning! ♟️✨

This project demonstrates full-stack development skills with AI integration, suitable for portfolios and technical interviews.
