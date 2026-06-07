import { memo } from "react";
import { History, Plus, RotateCcw } from "lucide-react";

interface ChessControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onNewGame: () => void;
}

export const ChessControls = memo(({
  canUndo,
  onUndo,
  onRestart,
  onNewGame,
}: ChessControlsProps) => {
  const confirmRestart = () => {
    if (window.confirm("Restart this match from the beginning?")) onRestart();
  };

  const confirmNewGame = () => {
    if (window.confirm("Leave this match and choose new settings?")) onNewGame();
  };

  return (
    <div className="chess-controls" aria-label="Game controls">
      <button type="button" onClick={onUndo} disabled={!canUndo}>
        <History size={15} />
        Undo
      </button>
      <button type="button" onClick={confirmRestart}>
        <RotateCcw size={15} />
        Restart
      </button>
      <button type="button" className="is-emphasized" onClick={confirmNewGame}>
        <Plus size={15} />
        New Game
      </button>
    </div>
  );
});

ChessControls.displayName = "ChessControls";
