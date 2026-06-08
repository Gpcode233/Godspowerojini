import { memo } from "react";
import { defaultPieces } from "react-chessboard";
import type { Move, PieceSymbol } from "chess.js";

interface ChessCapturedPiecesProps {
  history: Move[];
  currentPly: number;
  capturerColor: "w" | "b";
}

const PIECE_ORDER: Record<PieceSymbol, number> = {
  q: 0,
  r: 1,
  b: 2,
  n: 3,
  p: 4,
  k: 5,
};

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

export const ChessCapturedPieces = memo(({
  history,
  currentPly,
  capturerColor,
}: ChessCapturedPiecesProps) => {
  const pieces = history
    .slice(0, currentPly)
    .filter((move) => move.color === capturerColor && move.captured)
    .map((move, index) => ({
      id: `${move.lan}-${index}`,
      type: move.captured as PieceSymbol,
      color: capturerColor === "w" ? "b" : "w",
    }))
    .sort((a, b) => PIECE_ORDER[a.type] - PIECE_ORDER[b.type]);

  if (pieces.length === 0) return null;

  return (
    <span
      className="chess-captured-pieces"
      aria-label={`Captured ${pieces.map((piece) => PIECE_NAMES[piece.type]).join(", ")}`}
    >
      {pieces.map((piece) => {
        const pieceType = `${piece.color}${piece.type.toUpperCase()}`;
        const Piece = defaultPieces[pieceType];

        return Piece ? (
          <span key={piece.id} className="chess-captured-piece" aria-hidden="true">
            <Piece svgStyle={{ width: "100%", height: "100%" }} />
          </span>
        ) : null;
      })}
    </span>
  );
});

ChessCapturedPieces.displayName = "ChessCapturedPieces";
