import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, RotateCcw } from "lucide-react";
import type { ChessStatusData } from "./types/chess.types";

interface ChessStatusProps {
  status: ChessStatusData;
  isReviewing: boolean;
  currentPly: number;
  onReturnToGame: () => void;
}

export const ChessStatus = ({
  status,
  isReviewing,
  currentPly,
  onReturnToGame,
}: ChessStatusProps) => (
  <div className="chess-status-wrap" aria-live="polite">
    <AnimatePresence mode="wait">
      <motion.div
        key={isReviewing ? `review-${currentPly}` : status.label}
        className={`chess-status is-${isReviewing ? "review" : status.tone}`}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
      >
        <span className="chess-status-icon" aria-hidden="true">
          {isReviewing ? <RotateCcw size={15} /> : status.tone === "check" ? <CircleAlert size={15} /> : "●"}
        </span>
        <span>
          <strong>{isReviewing ? `Reviewing move ${Math.ceil(currentPly / 2)}` : status.label}</strong>
          <small>{isReviewing ? "The live game is paused for review." : status.detail}</small>
        </span>
        {isReviewing ? (
          <button type="button" onClick={onReturnToGame}>
            Return to game
          </button>
        ) : null}
      </motion.div>
    </AnimatePresence>
  </div>
);
