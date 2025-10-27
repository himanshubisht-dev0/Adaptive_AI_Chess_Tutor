import React, { useState, useRef, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import anime from 'animejs';

interface ChessboardProps {
  onMove: (move: string, fen: string) => void;
  disabled?: boolean;
  orientation?: 'white' | 'black';
  initialFen?: string;
  showAnalysis?: boolean;
  gameId?: string;
}

export const AdaptiveChessboard: React.FC<ChessboardProps> = ({
  onMove,
  disabled = false,
  orientation = 'white',
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  showAnalysis = true,
  gameId
}) => {
  const [game, setGame] = useState(new Chess(initialFen));
  const [moveFrom, setMoveFrom] = useState<string>('');
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: string; to: string } | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const gameRef = useRef(game);
  gameRef.current = game;

  useEffect(() => {
    setGame(new Chess(initialFen));
  }, [initialFen]);

  // Animation functions
  const animatePieceMove = (fromSquare: string, toSquare: string) => {
    const fromElement = document.querySelector(`[data-square="${fromSquare}"]`);
    const toElement = document.querySelector(`[data-square="${toSquare}"]`);
    
    if (fromElement && toElement) {
      const pieceElement = fromElement.querySelector('.piece') as HTMLElement;
      if (pieceElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        anime({
          targets: pieceElement,
          translateX: [0, toRect.left - fromRect.left],
          translateY: [0, toRect.top - fromRect.top],
          duration: 300,
          easing: 'easeOutCubic',
          complete: () => {
            pieceElement.style.transform = 'none';
          }
        });
      }
    }
  };

  const animateBoardHighlight = (squares: string[]) => {
    squares.forEach(square => {
      const squareElement = document.querySelector(`[data-square="${square}"]`) as HTMLElement;
      if (squareElement) {
        anime({
          targets: squareElement,
          backgroundColor: ['#f6f669', '#eeeed2'],
          duration: 600,
          easing: 'easeOutQuad',
          loop: true,
          direction: 'alternate'
        });
      }
    });
  };

  const animateCheck = (kingSquare: string) => {
    const kingSquareElement = document.querySelector(`[data-square="${kingSquare}"]`) as HTMLElement;
    if (kingSquareElement) {
      anime({
        targets: kingSquareElement,
        backgroundColor: ['#ff6b6b', '#f6f669'],
        duration: 500,
        loop: true,
        direction: 'alternate'
      });
    }
  };

  function onSquareClick(square: string) {
    if (disabled) return;

    setMoveFrom(square);
    
    // Highlight clicked square and valid moves
    const moves = gameRef.current.moves({ square, verbose: true });
    const moveSquares = moves.map(move => move.to);
    setValidMoves(moveSquares);
    
    animateBoardHighlight([square, ...moveSquares]);
  }

  function onSquareRightClick(square: string) {
    // Right click to clear selection
    setMoveFrom('');
    setValidMoves([]);
  }

  function onDrop(sourceSquare: string, targetSquare: string, piece: string) {
    if (disabled) return;

    const move = { from: sourceSquare, to: targetSquare };
    tryMakeMove(move);
    return true;
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
          return false;
        }
        
        makeMove(move.from + move.to);
        return true;
      }
    } catch (e) {
      console.error('Invalid move:', e);
    }
    
    setMoveFrom('');
    setValidMoves([]);
    return false;
  }

  async function makeMove(move: string, promotion?: string) {
    if (disabled) return;

    const moveNotation = promotion ? move + promotion : move;
    
    try {
      // Animate the move
      animatePieceMove(move.substring(0, 2), move.substring(2, 4));
      setLastMove({ from: move.substring(0, 2), to: move.substring(2, 4) });

      // Update board state immediately (optimistic update)
      setGame((g) => {
        const update = new Chess(g.fen());
        update.move({ from: move.substring(0, 2), to: move.substring(2, 4), promotion });
        return update;
      });

      // Check for check
      const newGame = new Chess(gameRef.current.fen());
      newGame.move({ from: move.substring(0, 2), to: move.substring(2, 4), promotion });
      if (newGame.in_check()) {
        const kingSquare = newGame.board().flat().find(sq => sq && sq.color === newGame.turn() && sq.type === 'k');
        if (kingSquare) {
          const kingPos = newGame.board().flat().indexOf(kingSquare);
          const file = 'abcdefgh'[kingPos % 8];
          const rank = Math.floor(kingPos / 8) + 1;
          animateCheck(file + rank);
        }
      }

      // Call the move handler with both move and new FEN
      onMove(moveNotation, gameRef.current.fen());
      
    } catch (error) {
      console.error('Move error:', error);
      // Revert the board state if move fails
      setGame(new Chess(initialFen));
    } finally {
      setMoveFrom('');
      setValidMoves([]);
      setShowPromotionDialog(false);
      setPendingMove(null);
    }
  }

  const customSquareStyles: any = {};
  
  // Highlight last move
  if (lastMove) {
    customSquareStyles[lastMove.from] = { backgroundColor: 'rgba(155, 199, 0, 0.4)' };
    customSquareStyles[lastMove.to] = { backgroundColor: 'rgba(155, 199, 0, 0.4)' };
  }
  
  // Highlight selected square and valid moves
  if (moveFrom) {
    customSquareStyles[moveFrom] = { backgroundColor: 'rgba(255, 255, 0, 0.6)' };
    validMoves.forEach(square => {
      customSquareStyles[square] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' };
    });
  }

  // Highlight check
  if (gameRef.current.in_check()) {
    const king = gameRef.current.board().flat().find(p => p && p.type === 'k' && p.color === gameRef.current.turn());
    if (king) {
      const kingIndex = gameRef.current.board().flat().indexOf(king);
      const kingSquare = 'abcdefgh'[kingIndex % 8] + (Math.floor(kingIndex / 8) + 1);
      customSquareStyles[kingSquare] = { backgroundColor: 'rgba(255, 0, 0, 0.4)' };
    }
  }

  return (
    <div className="relative">
      <Chessboard
        id="adaptive-chessboard"
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPieceDrop={onDrop}
        customSquareStyles={customSquareStyles}
        boardOrientation={orientation}
        arePremovesAllowed={true}
      />
      
      {showPromotionDialog && pendingMove && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg z-10 border-2 border-chess-dark">
          <p className="mb-2 font-semibold text-gray-700">Choose promotion:</p>
          <div className="flex gap-2">
            {['q', 'r', 'b', 'n'].map((piece) => (
              <button
                key={piece}
                className="px-4 py-2 bg-chess-dark text-white rounded hover:bg-chess-light hover:text-chess-dark transition-colors"
                onClick={() => makeMove(pendingMove.from + pendingMove.to, piece)}
              >
                {piece.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {disabled && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded">
          <div className="text-white font-semibold">Thinking...</div>
        </div>
      )}
    </div>
  );
};
