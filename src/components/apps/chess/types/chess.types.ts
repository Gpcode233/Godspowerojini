import type { Color, Move, PieceSymbol, Square } from "chess.js";

export type PlayerColor = "white" | "black";
export type Difficulty = "easy" | "medium" | "hard";
export type SoundEvent = "move" | "capture" | "check" | "checkmate" | "victory";

export interface GameSettings {
  playerColor: PlayerColor;
  difficulty: Difficulty;
}

export interface ChessStatusData {
  label: string;
  detail: string;
  tone: "neutral" | "check" | "terminal";
  winner: PlayerColor | null;
}

export interface HistoryRow {
  moveNumber: number;
  white?: Move;
  black?: Move;
}

export interface PendingPromotion {
  from: Square;
  to: Square;
  color: Color;
}

export interface ComputerMove {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
}

export interface ChessGameApi {
  settings: GameSettings | null;
  fen: string;
  liveFen: string;
  history: Move[];
  historyRows: HistoryRow[];
  currentPly: number;
  status: ChessStatusData;
  isReviewing: boolean;
  isThinking: boolean;
  canMove: boolean;
  canUndo: boolean;
  lastMove: Move | null;
  pendingPromotion: PendingPromotion | null;
  startGame: (settings: GameSettings) => void;
  makeMove: (from: Square, to: Square) => boolean;
  promotePawn: (piece: PieceSymbol) => void;
  cancelPromotion: () => void;
  undo: () => void;
  restart: () => void;
  newGame: () => void;
  reviewMove: (ply: number) => void;
}
