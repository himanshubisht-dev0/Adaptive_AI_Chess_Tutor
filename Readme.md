# 🎯 Adaptive AI Chess Tutor

### *Complete AI-Powered Chess Learning Platform*

**Tech Stack:** FastAPI • React • TypeScript • MongoDB Atlas • Redis • Ollama (Mistral) • Stockfish

---

## ♟️ Overview

**Adaptive AI Chess Tutor** is a comprehensive chess learning platform that combines **professional-grade chess analysis** with **AI-driven tutoring**.
Play against Stockfish, practice puzzles, and receive real-time natural language explanations from a **locally running Mistral model** via **Ollama**.

The system adapts to your skill level using reinforcement learning, delivering a personalized, intelligent chess experience.

---

## 🌟 Features

### 🎮 Game Modes

* **Practice Mode:** Play both sides with instant AI feedback.
* **Vs Stockfish:** Challenge AI at 20 difficulty levels (800–2800 ELO).
* **Puzzle Mode:** Adaptive puzzles based on performance.
* **Instant Analysis:** Real-time explanation for every move.

### 🤖 AI Integration

* **Ollama + Mistral:** Local AI model for natural language tutoring.
* **Stockfish Engine:** Professional-level move validation and scoring.
* **Adaptive Learning:** Reinforcement learning adjusts difficulty.
* **Live Tutoring:** Real-time feedback through WebSockets.

### 💻 Technical Highlights

* **Full-Stack TypeScript:** React frontend with FastAPI backend.
* **MongoDB Atlas:** Track user progress and analytics.
* **Redis Caching:** Accelerate repeated position lookups.
* **Anime.js Animations:** Smooth chesspiece transitions.
* **JWT Authentication:** Secure user login and game history.

---

## 📋 Prerequisites

Make sure you have:

* 🐍 Python 3.8+
* 🟩 Node.js 16+
* 🍃 MongoDB Atlas account
* 🧠 Ollama installed locally
* ♞ Stockfish engine

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/himanshubisht-dev0/Adaptive_AI_Chess_Tutor.git
cd Adaptive_AI_Chess_Tutor
```

### 2. Backend Setup

```bash
python -m venv venv
# Activate venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r backend/requirements.txt
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL
```

### 4. AI & Engine Setup

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral
ollama serve

# Install Stockfish
# Windows: Download binary and place in backend/stockfish/bin/
# Mac: brew install stockfish
# Ubuntu: sudo apt install stockfish
```

### 5. Run the Application

```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to start playing!

---

## 🏗️ Project Structure

```
adaptive-ai-chess-tutor/
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── reasoning/
│   ├── database/
│   ├── stockfish/
│   └── cache/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
└── docker-compose.yml
```

---

## 🔧 Configuration

### Backend `.env`

```env
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/chess_tutor
JWT_SECRET=your-super-secret-jwt-key
STOCKFISH_PATH=/usr/bin/stockfish
OLLAMA_BASE_URL=http://localhost:11434
USE_REDIS=false
REDIS_URL=redis://localhost:6379
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🎯 API Endpoints

### Authentication

* `POST /api/auth/signup` – Register new user
* `POST /api/auth/signin` – User login
* `GET /api/auth/me` – Get current user info

### Game Management

* `POST /api/game/create` – Start a new game
* `POST /api/game/move` – Make a move
* `GET /api/game/{game_id}` – Retrieve game data

### AI Analysis

* `POST /api/analysis/move` – Analyze a move
* `GET /api/analysis/position/{fen}` – Analyze a position

### Puzzles

* `POST /api/puzzle/generate` – Generate adaptive puzzles
* `POST /api/puzzle/validate` – Validate puzzle solutions

---

## 🧠 AI Components

### Ollama + Mistral

Used for generating human-like chess commentary and move explanations:

```python
prompt = f"""
You are a chess tutor. Explain the move {move} in position {fen}.
Focus on tactical and strategic insights.
"""
```

### Stockfish Integration

```python
analysis = stockfish_engine.evaluate_position(fen, depth=15)
```

### Adaptive Learning (RL Agent)

```python
state = [accuracy, response_time, streak, difficulty]
action = agent.select_action(state)
```

---

## 📊 Performance Metrics

* **ELO Rating:** Tracks player skill.
* **Move Accuracy:** AI-based move evaluation.
* **Puzzle Success Rate:** Tactical performance.
* **Learning Progress:** Personalized improvement score.

---

## 🐛 Troubleshooting

### Ollama Connection Failed

```bash
ollama serve
curl http://localhost:11434/api/tags
```

### Stockfish Not Found

```bash
stockfish
# Ensure stockfish.exe exists in backend/stockfish/bin/
```

### MongoDB Connection Issues

```bash
python -c "from database.db_client import db_client; db_client.connect()"
```

### Frontend Errors

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🧩 Development Setup

```bash
# Backend
pip install -r backend/requirements-dev.txt
pytest backend/tests/

# Frontend
npm test
```

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* ♞ [Stockfish](https://stockfishchess.org) — chess engine
* 🧠 [Ollama](https://ollama.ai) — local AI inference
* 🍃 [MongoDB Atlas](https://www.mongodb.com/atlas) — free-tier cloud database
* ⚡ [FastAPI](https://fastapi.tiangolo.com) and [React](https://react.dev) communities

---

## 🚀 Future Enhancements

* Multiplayer online gameplay
* Opening repertoire trainer
* Endgame and tactics modules
* Video lesson integration
* Tournament organization
* Mobile app version

---

**Happy Learning! ♟️✨**
