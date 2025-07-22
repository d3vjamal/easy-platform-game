import { create } from 'zustand';

export type GameState = 'menu' | 'themeSelect' | 'generating' | 'playing' | 'levelComplete' | 'gameOver';

interface GameStore {
    gameState: GameState;
    level: number;
    score: number;
    lives: number;
    theme: string;
    customTheme: string;
    levelData: any; // Replace with a proper type later
    setGameState: (state: GameState) => void;
    nextLevel: () => void;
    retryLevel: () => void;
    resetGame: () => void;
    setTheme: (theme: string) => void;
    setCustomTheme: (theme: string) => void;
    setLevelData: (data: any) => void;
    decrementLives: () => void;
    incrementScore: (amount: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
    gameState: 'menu',
    level: 1,
    score: 0,
    lives: 3,
    theme: '',
    customTheme: '',
    levelData: null,
    setGameState: (gameState) => set({ gameState }),
    nextLevel: () => set((state) => ({ level: state.level + 1, gameState: 'themeSelect' })),
    retryLevel: () => set({ lives: 3, gameState: 'playing' }),
    resetGame: () => set({ gameState: 'menu', level: 1, score: 0, lives: 3 }),
    setTheme: (theme) => set({ theme }),
    setCustomTheme: (customTheme) => set({ customTheme }),
    setLevelData: (levelData) => set({ levelData }),
    decrementLives: () => set((state) => ({ lives: state.lives - 1 })),
    incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
}));