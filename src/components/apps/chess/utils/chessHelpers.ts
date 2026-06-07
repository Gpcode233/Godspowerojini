import { Chess, type Color, type Move, type PieceSymbol } from "chess.js";
import type {
  ChessStatusData,
  ComputerMove,
  Difficulty,
  HistoryRow,
  PlayerColor,
} from "../types/chess.types";

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20_000,
};

const CENTER_SQUARES = new Set(["c3", "d3", "e3", "f3", "c4", "d4", "e4", "f4", "c5", "d5", "e5", "f5", "c6", "d6", "e6", "f6"]);

export const toChessColor = (color: PlayerColor): Color =>
  color === "white" ? "w" : "b";

export const toPlayerColor = (color: Color): PlayerColor =>
  color === "w" ? "white" : "black";

export const getHistoryRows = (history: Move[]): HistoryRow[] => {
  const rows: HistoryRow[] = [];
  for (let index = 0; index < history.length; index += 2) {
    rows.push({
      moveNumber: index / 2 + 1,
      white: history[index],
      black: history[index + 1],
    });
  }
  return rows;
};

export const getGameStatus = (game: Chess): ChessStatusData => {
  const turn = toPlayerColor(game.turn());
  const opponent = turn === "white" ? "black" : "white";

  if (game.isCheckmate()) {
    return {
      label: `Checkmate! ${capitalize(opponent)} wins`,
      detail: "The king has no legal escape.",
      tone: "terminal",
      winner: opponent,
    };
  }

  if (game.isStalemate()) {
    return {
      label: "Draw by stalemate",
      detail: "No legal moves remain.",
      tone: "terminal",
      winner: null,
    };
  }

  if (game.isThreefoldRepetition()) {
    return {
      label: "Draw by repetition",
      detail: "The same position occurred three times.",
      tone: "terminal",
      winner: null,
    };
  }

  if (game.isInsufficientMaterial()) {
    return {
      label: "Draw by insufficient material",
      detail: "Neither side can force checkmate.",
      tone: "terminal",
      winner: null,
    };
  }

  if (game.isDrawByFiftyMoves()) {
    return {
      label: "Draw by fifty-move rule",
      detail: "Fifty moves passed without a pawn move or capture.",
      tone: "terminal",
      winner: null,
    };
  }

  if (game.isCheck()) {
    return {
      label: `${capitalize(turn)} is in check`,
      detail: `${capitalize(turn)} must answer the threat.`,
      tone: "check",
      winner: null,
    };
  }

  return {
    label: `${capitalize(turn)} to move`,
    detail: "Game in progress",
    tone: "neutral",
    winner: null,
  };
};

export const getComputerMove = (
  game: Chess,
  difficulty: Difficulty,
  computerColor: Color,
): ComputerMove | null => {
  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  if (difficulty === "easy") {
    return serializeMove(legalMoves[Math.floor(Math.random() * legalMoves.length)]);
  }

  const depth = difficulty === "medium" ? 2 : 3;
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestMoves: Move[] = [];

  for (const move of orderMoves(legalMoves)) {
    const next = new Chess(game.fen());
    next.move({ from: move.from, to: move.to, promotion: move.promotion });
    const score = minimax(
      next,
      depth - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      false,
      computerColor,
    );

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return serializeMove(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
};

const minimax = (
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  computerColor: Color,
): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game, computerColor, depth);
  }

  const moves = orderMoves(game.moves({ verbose: true }));

  if (maximizing) {
    let value = Number.NEGATIVE_INFINITY;
    for (const move of moves) {
      const next = new Chess(game.fen());
      next.move({ from: move.from, to: move.to, promotion: move.promotion });
      value = Math.max(value, minimax(next, depth - 1, alpha, beta, false, computerColor));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  }

  let value = Number.POSITIVE_INFINITY;
  for (const move of moves) {
    const next = new Chess(game.fen());
    next.move({ from: move.from, to: move.to, promotion: move.promotion });
    value = Math.min(value, minimax(next, depth - 1, alpha, beta, true, computerColor));
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return value;
};

const evaluatePosition = (game: Chess, computerColor: Color, depth: number): number => {
  if (game.isCheckmate()) {
    return game.turn() === computerColor ? -100_000 - depth : 100_000 + depth;
  }
  if (game.isDraw()) return 0;

  let score = 0;
  for (const row of game.board()) {
    for (const piece of row) {
      if (!piece) continue;
      const sign = piece.color === computerColor ? 1 : -1;
      score += sign * PIECE_VALUES[piece.type];
      if (CENTER_SQUARES.has(piece.square)) score += sign * 8;
    }
  }

  const mobility = game.moves().length * (game.turn() === computerColor ? 1 : -1);
  return score + mobility * 2;
};

const orderMoves = (moves: Move[]): Move[] =>
  [...moves].sort((a, b) => movePriority(b) - movePriority(a));

const movePriority = (move: Move): number =>
  (move.captured ? PIECE_VALUES[move.captured] * 10 - PIECE_VALUES[move.piece] : 0) +
  (move.promotion ? PIECE_VALUES[move.promotion] : 0) +
  (move.san.includes("+") ? 50 : 0);

const serializeMove = (move: Move): ComputerMove => ({
  from: move.from,
  to: move.to,
  promotion: move.promotion,
});

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);
