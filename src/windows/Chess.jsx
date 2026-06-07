import WindowWrapper from "#hoc/WindowWrapper";
import { lazy, Suspense } from "react";

const LazyChessApp = lazy(() => import("#components/apps/chess/ChessApp"));

const Chess = () => (
  <Suspense fallback={<div className="chess-loading" aria-label="Loading Chess"><span>♞</span></div>}>
    <LazyChessApp />
  </Suspense>
);

const ChessWindow = WindowWrapper(Chess, "chess");
ChessWindow.displayName = "Chess";

export default ChessWindow;
