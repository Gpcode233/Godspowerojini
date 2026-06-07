import { Bot } from "lucide-react";
import WindowControls from "#components/WindowControls";
import type { GameSettings } from "./types/chess.types";

interface ChessHeaderProps {
  settings: GameSettings | null;
  isThinking: boolean;
  showWindowControls?: boolean;
}

export const ChessHeader = ({
  settings,
  isThinking,
  showWindowControls = true,
}: ChessHeaderProps) => (
  <header id={showWindowControls ? "window-header" : undefined} className="chess-header">
    <div className="chess-header-leading">
      {showWindowControls ? <WindowControls target="chess" /> : null}
      <div className="chess-app-identity">
        <span className="chess-app-glyph" aria-hidden="true">♞</span>
        <span>
          <strong>Chess</strong>
          <small>{settings ? `${settings.difficulty} match` : "New match"}</small>
        </span>
      </div>
    </div>

    {settings ? (
      <div className={`chess-engine-state ${isThinking ? "is-thinking" : ""}`} aria-live="polite">
        <Bot size={14} />
        <span>{isThinking ? "Computer is thinking" : "Computer ready"}</span>
        <i aria-hidden="true" />
      </div>
    ) : (
      <span className="chess-header-title">Play</span>
    )}
  </header>
);
