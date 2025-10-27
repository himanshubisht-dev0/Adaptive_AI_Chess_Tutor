import React, { useState, useRef, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { chessTutorAPI, MoveAnalysis } from '../services/api';

interface ChessboardProps {
  userId: string;
  onMoveAnalysis: (analysis: MoveAnalysis) => void;
  initialFen?: string;
  mode?: 'practice' | 'puzzle';
}

export const AdaptiveChessboard: React.FC<ChessboardProps> = ({
  userId,
  onMoveAnalysis,
  initialFen = 'start',
  mode: _mode = 'practice'
}) => {
  const startingFen = new Chess().fen();
  const initialFenForChess = initialFen === 'start' ? undefined : initialFen;
  const [_game, setGame] = useState(() => new Chess(initialFenForChess));
  const [fen, setFen] = useState(initialFen === 'start' ? startingFen : initialFen);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState<number>(400);
  const [moveFrom, setMoveFrom] = useState<string>('');
  const [_moveTo, setMoveTo] = useState<string>('');
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: string; to: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const gameRef = useRef(_game);
  gameRef.current = _game;

  useEffect(() => {
    setGame(new Chess(initialFen === 'start' ? undefined : initialFen));
    setFen(initialFen === 'start' ? new Chess().fen() : initialFen);
  }, [initialFen]);

  // Responsive board sizing based on container width and viewport height
  useEffect(() => {
    function computeWidth() {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = window.innerHeight - 180; // account for header/margins
      const size = Math.floor(Math.min(w, h));
      setBoardWidth(size < 240 ? 240 : size); // ensure a reasonable minimum
    }

    computeWidth();
    const handleResize = () => computeWidth();
    window.addEventListener('resize', handleResize);

    // Observe container changes as well
    let observer: ResizeObserver | null = null;
    if (containerRef.current && 'ResizeObserver' in window) {
      observer = new ResizeObserver(() => computeWidth());
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer && containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  function safeGameMutate(modify: (game: Chess) => void) {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }

  function onSquareClick(square: string) {
    if (isAnalyzing) return;

    setMoveFrom(square);
    
    // If we haven't selected a piece yet, or if clicking a different piece
    if (!moveFrom || moveFrom === square) {
      setMoveFrom(square);
      return;
    }

    // If we have a from square and now click a to square
    const move = { from: moveFrom, to: square };
    tryMakeMove(move);
  }

  function tryMakeMove(move: { from: string; to: string }) {
    const gameCopy = new Chess(gameRef.current.fen());
    
    try {
      const result = gameCopy.move(move);
      if (result) {
        // Check if promotion is needed
        if (result.promotion) {
          setPendingMove(move);
          setShowPromotionDialog(true);
          return;
        }
        
        makeMove(move.from + move.to);
      } else {
        // Invalid move
        setMoveFrom('');
        setMoveTo('');
      }
    } catch (_e) {
      // Invalid move
      setMoveFrom('');
      setMoveTo('');
    }
  }

  async function makeMove(move: string, promotion?: string) {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    
    try {
      const moveNotation = promotion ? move + promotion : move;
      
      // Analyze the move with the AI tutor
      const analysis = await chessTutorAPI.analyzeMove(fen, moveNotation, userId);
      
      if (analysis.valid) {
        // Update the board with the new position
        safeGameMutate((game) => {
          game.move({ from: move.substring(0, 2), to: move.substring(2, 4), promotion });
        });
        setFen(analysis.new_fen);
        
        // Pass analysis to parent component
        onMoveAnalysis(analysis);
      } else {
        console.error('Invalid move:', analysis.error);
      }
    } catch (error) {
      console.error('Error analyzing move:', error);
    } finally {
      setIsAnalyzing(false);
      setMoveFrom('');
      setMoveTo('');
      setShowPromotionDialog(false);
      setPendingMove(null);
    }
  }

  function getMoveOptions(square: string) {
    const moves = gameRef.current.moves({
      square,
      verbose: true
    });
    
    if (moves.length === 0) {
      return [];
    }

    return moves.map((move) => move.to);
  }

  const customSquareStyles: any = {};
  if (moveFrom) {
    customSquareStyles[moveFrom] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)'
    };
    
    getMoveOptions(moveFrom).forEach((square) => {
      customSquareStyles[square] = {
        backgroundColor: 'rgba(0, 255, 0, 0.4)'
      };
    });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Chessboard
        id="adaptive-chessboard"
        position={fen}
        onSquareClick={onSquareClick}
        customSquareStyles={customSquareStyles}
        boardOrientation="white"
        boardWidth={boardWidth}
      />
      
      {showPromotionDialog && pendingMove && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg z-10">
          <p className="mb-2">Choose promotion:</p>
          <div className="flex gap-2">
            {['q', 'r', 'b', 'n'].map((piece) => (
              <button
                key={piece}
                className="px-3 py-1 bg-chess-dark text-white rounded hover:bg-chess-light hover:text-chess-dark"
                onClick={() => makeMove(pendingMove.from + pendingMove.to, piece)}
              >
                {piece.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg">Analyzing move...</div>
        </div>
      )}
    </div>
  );
};
