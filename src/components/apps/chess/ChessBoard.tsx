import { memo, useCallback, useMemo, useState } from "react";
import { Chess } from "chess.js";
import type { PieceSymbol, Square } from "chess.js";
import { Chessboard as ReactChessboard, type ChessboardOptions } from "react-chessboard";
import { AnimatePresence, motion } from "framer-motion";
import type { PendingPromotion, PlayerColor } from "./types/chess.types";

interface ChessBoardProps {
  fen: string;
  playerColor: PlayerColor;
  canMove: boolean;
  lastMove: { from: Square; to: Square } | null;
  pendingPromotion: PendingPromotion | null;
  isGameOver: boolean;
  onMove: (from: Square, to: Square) => boolean;
  onPromote: (piece: PieceSymbol) => void;
  onCancelPromotion: () => void;
}

export const ChessBoard = memo(({
  fen,
  playerColor,
  canMove,
  lastMove,
  pendingPromotion,
  isGameOver,
  onMove,
  onPromote,
  onCancelPromotion,
}: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const legalTargets = useMemo(() => {
    if (!selectedSquare || !canMove) return [];
    const game = new Chess(fen);
    return game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to);
  }, [canMove, fen, selectedSquare]);

  const squareStyles = useMemo<React.CSSProperties>(() => ({}), []);
  const customSquareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = { background: "oklch(0.82 0.12 88 / 0.64)" };
      styles[lastMove.to] = { background: "oklch(0.78 0.15 88 / 0.72)" };
    }
    if (selectedSquare) {
      styles[selectedSquare] = { background: "oklch(0.7 0.12 150 / 0.72)" };
    }
    for (const square of legalTargets) {
      styles[square] = {
        ...styles[square],
        backgroundImage: "radial-gradient(circle, oklch(0.24 0.02 70 / 0.34) 0 14%, transparent 15%)",
      };
    }
    return styles;
  }, [lastMove, legalTargets, selectedSquare]);

  const handleDrop = useCallback(({ sourceSquare, targetSquare }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (!targetSquare) return false;
    setSelectedSquare(null);
    return onMove(sourceSquare as Square, targetSquare as Square);
  }, [onMove]);

  const handleSquareClick = useCallback(({ square }: { square: string }) => {
    const clickedSquare = square as Square;
    if (!canMove) return;

    if (selectedSquare && legalTargets.includes(clickedSquare)) {
      onMove(selectedSquare, clickedSquare);
      setSelectedSquare(null);
      return;
    }

    const game = new Chess(fen);
    const piece = game.get(clickedSquare);
    const playerCode = playerColor === "white" ? "w" : "b";
    setSelectedSquare(piece?.color === playerCode ? clickedSquare : null);
  }, [canMove, fen, legalTargets, onMove, playerColor, selectedSquare]);

  const options = useMemo<ChessboardOptions>(() => ({
    id: "portfolio-chessboard",
    position: fen,
    boardOrientation: playerColor,
    allowDragging: canMove,
    allowDragOffBoard: false,
    animationDurationInMs: 230,
    showAnimations: true,
    showNotation: true,
    boardStyle: {
      borderRadius: "10px",
      boxShadow: "0 20px 45px oklch(0.16 0.025 60 / 0.28), 0 2px 8px oklch(0.16 0.025 60 / 0.24)",
      overflow: "hidden",
      ...squareStyles,
    },
    lightSquareStyle: { backgroundColor: "oklch(0.9 0.035 83)" },
    darkSquareStyle: { backgroundColor: "oklch(0.54 0.065 65)" },
    lightSquareNotationStyle: { color: "oklch(0.38 0.05 62 / 0.7)", fontWeight: 700 },
    darkSquareNotationStyle: { color: "oklch(0.92 0.03 80 / 0.72)", fontWeight: 700 },
    squareStyles: customSquareStyles,
    onPieceDrop: handleDrop,
    onSquareClick: handleSquareClick,
    canDragPiece: ({ piece }) => {
      const playerCode = playerColor === "white" ? "w" : "b";
      return canMove && piece.pieceType.toLowerCase().startsWith(playerCode);
    },
  }), [canMove, customSquareStyles, fen, handleDrop, handleSquareClick, playerColor, squareStyles]);

  return (
    <div className="chess-board-shell">
      <ReactChessboard options={options} />

      <AnimatePresence>
        {pendingPromotion ? (
          <motion.div
            className="chess-promotion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Choose promotion piece"
          >
            <motion.div initial={{ scale: 0.9, y: 8 }} animate={{ scale: 1, y: 0 }}>
              <strong>Promote pawn</strong>
              <div>
                {(["q", "r", "b", "n"] as PieceSymbol[]).map((piece) => (
                  <button
                    key={piece}
                    type="button"
                    autoFocus={piece === "q"}
                    onClick={() => onPromote(piece)}
                    aria-label={`Promote to ${promotionNames[piece]}`}
                  >
                    {promotionGlyphs[pendingPromotion.color][piece]}
                  </button>
                ))}
              </div>
              <button type="button" className="chess-promotion-cancel" onClick={onCancelPromotion}>
                Cancel
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isGameOver ? (
          <motion.div
            className="chess-gameover-glow"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.9, 0.35], scale: [0.7, 1.04, 1] }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
});

ChessBoard.displayName = "ChessBoard";

const promotionNames: Partial<Record<PieceSymbol, string>> = {
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
};

const promotionGlyphs: Record<"w" | "b", Partial<Record<PieceSymbol, string>>> = {
  w: { q: "♕", r: "♖", b: "♗", n: "♘" },
  b: { q: "♛", r: "♜", b: "♝", n: "♞" },
};
