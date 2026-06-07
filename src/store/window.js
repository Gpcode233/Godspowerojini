import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants/index";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";

const useWindowStore = create(
    immer((set) => ({
        windows: WINDOW_CONFIG,
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey, data = null) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) {
                    console.error(`Window not found: ${windowKey}`);
                    return;
                }
                win.isOpen = true;
                win.isMinimized = false;
                win.zIndex = state.nextZIndex;
                win.data = data ?? win.data;
                state.nextZIndex++;
            }),

        closeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) {
                    console.error(`Window not found: ${windowKey}`);
                    return;
                }
                win.isOpen = false;
                win.isMinimized = false;
                win.isMaximized = false;
                win.data = null;
            }),

        minimizeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMinimized = true;
            }),

        restoreWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isOpen = true;
                win.isMinimized = false;
                win.zIndex = state.nextZIndex;
                state.nextZIndex++;
            }),

        toggleMaximizeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMaximized = !win.isMaximized;
                win.isMinimized = false;
                win.zIndex = state.nextZIndex;
                state.nextZIndex++;
            }),

        focusWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) {
                    console.error(`Window not found: ${windowKey}`);
                    return;
                }
                win.zIndex = state.nextZIndex;
                state.nextZIndex++;
            }),
    }))
);

export default useWindowStore;
