import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, ChevronRight, Shield, Sparkles } from "lucide-react";
import type { Difficulty, GameSettings, PlayerColor } from "./types/chess.types";

interface ChessGameSelectorProps {
  onStart: (settings: GameSettings) => void;
  onCancel?: () => void;
}

const difficulties: Array<{ value: Difficulty; label: string; description: string }> = [
  { value: "easy", label: "Easy", description: "Relaxed, unpredictable play" },
  { value: "medium", label: "Medium", description: "Plans one or two moves ahead" },
  { value: "hard", label: "Hard", description: "Sharp tactical calculation" },
];

export const ChessGameSelector = ({ onStart, onCancel }: ChessGameSelectorProps) => {
  const [playerColor, setPlayerColor] = useState<PlayerColor>("white");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    startButtonRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="chess-onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chess-onboarding-title"
    >
      <motion.div
        className="chess-onboarding-card"
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <div className="chess-onboarding-mark" aria-hidden="true">
          <span>♞</span>
        </div>

        <div className="chess-onboarding-copy">
          <div className="chess-eyebrow">
            <Sparkles size={13} />
            New match
          </div>
          <h1 id="chess-onboarding-title">Play Chess</h1>
          <p>Challenge yourself against Godspower's Computer!otep</p>
        </div>

        <fieldset className="chess-choice-group">
          <legend>Choose your side</legend>
          <div className="chess-segmented">
            {(["white", "black"] as PlayerColor[]).map((color) => (
              <label key={color} className={playerColor === color ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="player-color"
                  value={color}
                  checked={playerColor === color}
                  onChange={() => setPlayerColor(color)}
                />
                <span className={`chess-side-piece is-${color}`} aria-hidden="true">
                  {color === "white" ? "♔" : "♚"}
                </span>
                Play as {color === "white" ? "White" : "Black"}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="chess-choice-group">
          <legend>Difficulty</legend>
          <div className="chess-difficulty-list">
            {difficulties.map((option) => (
              <label key={option.value} className={difficulty === option.value ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={difficulty === option.value}
                  onChange={() => setDifficulty(option.value)}
                />
                <span className="chess-radio-dot" />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                {option.value === "hard" ? <Shield size={15} aria-hidden="true" /> : <Bot size={15} aria-hidden="true" />}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="chess-onboarding-actions">
          {onCancel ? (
            <button type="button" className="chess-button is-secondary" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
          <button
            ref={startButtonRef}
            type="button"
            className="chess-button is-primary"
            onClick={() => onStart({ playerColor, difficulty })}
          >
            Start Game
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
