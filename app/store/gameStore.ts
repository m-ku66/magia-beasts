import { create } from "zustand";
import { AttackCard, MonsterCard, SupportCard } from "../types/game";

interface Player {
  id: string;
  monsters: MonsterCard[];
  hand: (AttackCard | SupportCard)[];
  deck: (AttackCard | SupportCard)[];
}

interface GameState {
  players: Player[];
  currentTurn: number;
  selectedActions: Map<
    string,
    { card: AttackCard | SupportCard; target: MonsterCard }
  >;
  isActionPhase: boolean;

  // Actions
  initializeGame: (players: Player[]) => void;
  selectAction: (
    playerId: string,
    card: AttackCard | SupportCard,
    target: MonsterCard
  ) => void;
  startActionPhase: () => void;
  executeActions: () => void;
  drawCard: (playerId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentTurn: 0,
  selectedActions: new Map(),
  isActionPhase: false,

  initializeGame: (players) => set({ players }),

  selectAction: (playerId, card, target) => {
    const actions = get().selectedActions;
    actions.set(playerId, { card, target });
    set({ selectedActions: actions });
  },

  startActionPhase: () => set({ isActionPhase: true }),

  executeActions: () => {
    // Sort by AGI and execute actions
    // Will implement this logic later!
  },

  drawCard: (playerId) => {
    // Implement card drawing logic
    // Will add this later!
  },
}));
