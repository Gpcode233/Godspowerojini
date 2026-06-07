import { AnimatePresence, motion } from "framer-motion";
import { ChessBoard } from "./ChessBoard";
import { ChessControls } from "./ChessControls";
import { ChessGameSelector } from "./ChessGameSelector";
import { ChessHeader } from "./ChessHeader";
import { ChessMoveHistory } from "./ChessMoveHistory";
import { ChessStatus } from "./ChessStatus";
import { useChessGame } from "./hooks/useChessGame";

interface ChessAppProps {
  variant?: "window" | "mobile";
  onCancel?: () => void;
}

export const ChessApp = ({ variant = "window", onCancel }: ChessAppProps) => {
  const game = useChessGame();
  const isMobile = variant === "mobile";

  return (
    <div className={`chess-app chess-app--${variant}`}>
      <ChessHeader
        settings={game.settings}
        isThinking={game.isThinking}
        showWindowControls={!isMobile}
      />

      <AnimatePresence mode="wait">
        {!game.settings ? (
          <ChessGameSelector key="selector" onStart={game.startGame} onCancel={onCancel} />
        ) : (
          <motion.div
            key="game"
            className="chess-game"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="chess-main">
              <ChessStatus
                status={game.status}
                isReviewing={game.isReviewing}
                currentPly={game.currentPly}
                onReturnToGame={() => game.reviewMove(game.history.length)}
              />

              <div className="chess-board-stage">
                <div className="chess-player chess-player--opponent">
                  <span className="chess-avatar is-computer" aria-hidden="true">♟</span>
                  <span>
                    <strong>Mac</strong>
                    <small>{game.settings.difficulty} computer</small>
                  </span>
                  {game.isThinking ? <i className="chess-thinking-dots" aria-label="Thinking"><b /><b /><b /></i> : null}
                </div>

                <ChessBoard
                  fen={game.fen}
                  playerColor={game.settings.playerColor}
                  canMove={game.canMove}
                  lastMove={game.isReviewing ? null : game.lastMove}
                  pendingPromotion={game.pendingPromotion}
                  isGameOver={game.status.tone === "terminal"}
                  onMove={game.makeMove}
                  onPromote={game.promotePawn}
                  onCancelPromotion={game.cancelPromotion}
                />

                <div className="chess-player chess-player--human">
                  <span className="chess-avatar" aria-hidden="true">♙</span>
                  <span>
                    <strong>You</strong>
                    <small>playing {game.settings.playerColor}</small>
                  </span>
                  <span className="chess-turn-indicator" aria-hidden="true" />
                </div>
              </div>
            </div>

            <aside className="chess-sidebar">
              <ChessMoveHistory
                rows={game.historyRows}
                currentPly={game.currentPly}
                onSelectMove={game.reviewMove}
              />
              <ChessControls
                canUndo={game.canUndo}
                onUndo={game.undo}
                onRestart={game.restart}
                onNewGame={game.newGame}
              />
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChessApp;
