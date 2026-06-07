import { memo, useEffect, useRef } from "react";
import { ListOrdered } from "lucide-react";
import type { HistoryRow } from "./types/chess.types";

interface ChessMoveHistoryProps {
  rows: HistoryRow[];
  currentPly: number;
  onSelectMove: (ply: number) => void;
}

export const ChessMoveHistory = memo(({
  rows,
  currentPly,
  onSelectMove,
}: ChessMoveHistoryProps) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentPly]);

  return (
    <section className="chess-history" aria-label="Move history">
      <div className="chess-panel-title">
        <span>
          <ListOrdered size={15} />
          Moves
        </span>
        <small>{rows.reduce((count, row) => count + Number(Boolean(row.white)) + Number(Boolean(row.black)), 0)}</small>
      </div>

      <div className="chess-history-heading" aria-hidden="true">
        <span>#</span>
        <span>White</span>
        <span>Black</span>
      </div>

      <ol className="chess-history-list">
        {rows.length === 0 ? (
          <li className="chess-history-empty">
            <span aria-hidden="true">♙</span>
            Your moves will appear here.
          </li>
        ) : rows.map((row) => {
          const whitePly = row.moveNumber * 2 - 1;
          const blackPly = row.moveNumber * 2;
          return (
            <li key={row.moveNumber}>
              <span>{row.moveNumber}</span>
              <MoveButton
                move={row.white?.san}
                ply={whitePly}
                currentPly={currentPly}
                onSelect={onSelectMove}
                activeRef={activeRef}
              />
              <MoveButton
                move={row.black?.san}
                ply={blackPly}
                currentPly={currentPly}
                onSelect={onSelectMove}
                activeRef={activeRef}
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
});

ChessMoveHistory.displayName = "ChessMoveHistory";

interface MoveButtonProps {
  move?: string;
  ply: number;
  currentPly: number;
  onSelect: (ply: number) => void;
  activeRef: React.RefObject<HTMLButtonElement | null>;
}

const MoveButton = ({ move, ply, currentPly, onSelect, activeRef }: MoveButtonProps) =>
  move ? (
    <button
      ref={currentPly === ply ? activeRef : undefined}
      type="button"
      className={currentPly === ply ? "is-active" : ""}
      aria-label={`Review move ${ply}: ${move}`}
      onClick={() => onSelect(ply)}
    >
      {move}
    </button>
  ) : <span />;
