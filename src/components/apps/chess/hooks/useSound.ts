import { useCallback } from "react";
import type { SoundEvent } from "../types/chess.types";

export const useSound = () => {
  const play = useCallback((_event: SoundEvent) => {
    // Audio is intentionally disabled until licensed sound assets are supplied.
  }, []);

  return { play };
};
