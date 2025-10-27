adaptive-ai-chess-tutor/
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── move.py
│   │   ├── puzzle.py
│   │   └── feedback.py
│   ├── services/
│   │   ├── tutor_service.py
│   │   ├── rl_agent.py
│   │   └── puzzle_gen.py
│   ├── reasoning/
│   │   └── ollama_client.py
│   ├── database/
│   │   ├── models.py
│   │   └── db_client.py
│   ├── cache/
│   │   └── cache_manager.py
│   ├── stockfish/
│   │   └── engine.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chessboard.tsx
│   │   │   ├── TutorPanel.tsx
│   │   │   ├── PuzzleMode.tsx
│   │   │   └── StatsDashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Learn.tsx
│   │   │   └── Profile.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
