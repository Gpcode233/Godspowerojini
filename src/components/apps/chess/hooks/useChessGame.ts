import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";
import type {
  ChessGameApi,
  GameSettings,
  PendingPromotion,
} from "../types/chess.types";
import {
  getComputerMove,
  getGameStatus,
  getHistoryRows,
  toChessColor,
} from "../utils/chessHelpers";
import { useSound } from "./useSound";

export const useChessGame = (): ChessGameApi => {
  const gameRef = useRef(new Chess());
  const aiTimerRef = useRef<number | null>(null);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [liveFen, setLiveFen] = useState(gameRef.current.fen());
  const [history, setHistory] = useState<Move[]>([]);
  const [reviewPly, setReviewPly] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const { play } = useSound();

  const syncGame = useCallback((move?: Move) => {
    setLiveFen(gameRef.current.fen());
    setHistory(gameRef.current.history({ verbose: true }));
    setReviewPly(null);

    if (move) {
      if (move.isCapture()) play("capture");
      else play("move");
      if (gameRef.current.isCheckmate()) play("checkmate");
      else if (gameRef.current.isCheck()) play("check");
    }
  }, [play]);

  const applyMove = useCallback((from: Square, to: Square, promotion?: PieceSymbol) => {
    try {
      const move = gameRef.current.move({ from, to, promotion });
      syncGame(move);
      return true;
    } catch {
      return false;
    }
  }, [syncGame]);

  const makeMove = useCallback((from: Square, to: Square) => {
    if (!settings || isThinking || reviewPly !== null || gameRef.current.isGameOver()) {
      return false;
    }

    const humanColor = toChessColor(settings.playerColor);
    if (gameRef.current.turn() !== humanColor) return false;

    const promotionMove = gameRef.current
      .moves({ square: from, verbose: true })
      .find((move) => move.to === to && move.isPromotion());

    if (promotionMove) {
      setPendingPromotion({ from, to, color: humanColor });
      return false;
    }

    return applyMove(from, to);
  }, [applyMove, isThinking, reviewPly, settings]);

  const promotePawn = useCallback((piece: PieceSymbol) => {
    if (!pendingPromotion) return;
    applyMove(pendingPromotion.from, pendingPromotion.to, piece);
    setPendingPromotion(null);
  }, [applyMove, pendingPromotion]);

  const cancelPromotion = useCallback(() => setPendingPromotion(null), []);

  const startGame = useCallback((nextSettings: GameSettings) => {
    if (aiTimerRef.current) window.clearTimeout(aiTimerRef.current);
    gameRef.current = new Chess();
    setSettings(nextSettings);
    setPendingPromotion(null);
    setIsThinking(false);
    syncGame();
  }, [syncGame]);

  const restart = useCallback(() => {
    if (!settings) return;
    startGame(settings);
  }, [settings, startGame]);

  const newGame = useCallback(() => {
    if (aiTimerRef.current) window.clearTimeout(aiTimerRef.current);
    gameRef.current = new Chess();
    setSettings(null);
    setIsThinking(false);
    setPendingPromotion(null);
    syncGame();
  }, [syncGame]);

  const undo = useCallback(() => {
    if (!settings || history.length === 0) return;
    if (aiTimerRef.current) window.clearTimeout(aiTimerRef.current);
    setIsThinking(false);

    const humanColor = toChessColor(settings.playerColor);
    gameRef.current.undo();
    if (gameRef.current.history().length > 0 && gameRef.current.turn() !== humanColor) {
      gameRef.current.undo();
    }
    syncGame();
  }, [history.length, settings, syncGame]);

  const reviewMove = useCallback((ply: number) => {
    setReviewPly(ply >= history.length ? null : Math.max(0, ply));
  }, [history.length]);

  useEffect(() => {
    if (!settings || gameRef.current.isGameOver() || reviewPly !== null) return;

    const computerColor = toChessColor(settings.playerColor === "white" ? "black" : "white");
    if (gameRef.current.turn() !== computerColor) return;

    setIsThinking(true);
    aiTimerRef.current = window.setTimeout(() => {
      const move = getComputerMove(gameRef.current, settings.difficulty, computerColor);
      if (move) applyMove(move.from, move.to, move.promotion);
      setIsThinking(false);
    }, 420);

    return () => {
      if (aiTimerRef.current) window.clearTimeout(aiTimerRef.current);
    };
  }, [applyMove, liveFen, reviewPly, settings]);

  const reviewFen = useMemo(() => {
    if (reviewPly === null || reviewPly >= history.length) return liveFen;
    if (reviewPly === 0) return new Chess().fen();
    return history[reviewPly - 1]?.after ?? liveFen;
  }, [history, liveFen, reviewPly]);

  const status = useMemo(() => getGameStatus(gameRef.current), [liveFen]);
  const humanColor = settings ? toChessColor(settings.playerColor) : null;

  return {
    settings,
    fen: reviewFen,
    liveFen,
    history,
    historyRows: useMemo(() => getHistoryRows(history), [history]),
    currentPly: reviewPly ?? history.length,
    status,
    isReviewing: reviewPly !== null,
    isThinking,
    canMove: Boolean(
      settings &&
      !isThinking &&
      reviewPly === null &&
      !gameRef.current.isGameOver() &&
      gameRef.current.turn() === humanColor,
    ),
    canUndo: history.length > 0 && !isThinking,
    lastMove: history.at(-1) ?? null,
    pendingPromotion,
    startGame,
    makeMove,
    promotePawn,
    cancelPromotion,
    undo,
    restart,
    newGame,
    reviewMove,
  };
};
