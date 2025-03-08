// store/gameStore.ts
import { create } from "zustand";
import { AttackCard, MonsterCard, SupportCard } from "../types/game";
import { v4 as uuid } from "uuid";

// Player interface remains the same
interface Player {
  id: string;
  monsters: MonsterCard[];
  hand: (AttackCard | SupportCard)[];
  deck: (AttackCard | SupportCard)[];
}

// Action interface to track selected actions
interface SelectedAction {
  playerId: string;
  monsterId: string;
  card: AttackCard | SupportCard | null; // null means using monster's active skill
  target: {
    playerId: string;
    monsterId: string;
  };
}

interface GameState {
  players: Player[];
  currentTurn: number;
  selectedActions: SelectedAction[];
  isActionPhase: boolean;
  winner: string | null;
  actionLog: string[];

  // Actions
  initializeGame: (players: Player[]) => void;
  selectAction: (
    playerId: string,
    monsterId: string,
    card: AttackCard | SupportCard | null,
    target: { playerId: string; monsterId: string }
  ) => void;
  startActionPhase: () => void;
  executeActions: () => void;
  drawCard: (playerId: string) => void;
  endTurn: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentTurn: 0,
  selectedActions: [],
  isActionPhase: false,
  winner: null,
  actionLog: [],

  initializeGame: (players) => {
    set({
      players,
      currentTurn: 1,
      selectedActions: [],
      isActionPhase: false,
      winner: null,
      actionLog: ["Game started!"],
    });
  },

  selectAction: (playerId, monsterId, card, target) => {
    const actions = [...get().selectedActions];

    // Remove any existing action for this player/monster
    const filteredActions = actions.filter(
      (action) =>
        !(action.playerId === playerId && action.monsterId === monsterId)
    );

    // Add the new action
    filteredActions.push({
      playerId,
      monsterId,
      card,
      target,
    });

    set({ selectedActions: filteredActions });

    // Log the selection
    const players = get().players;
    const player = players.find((p) => p.id === playerId);
    const monster = player?.monsters.find((m) => m.id === monsterId);
    const targetPlayer = players.find((p) => p.id === target.playerId);
    const targetMonster = targetPlayer?.monsters.find(
      (m) => m.id === target.monsterId
    );

    let actionLog = [...get().actionLog];
    if (card) {
      actionLog.push(
        `Player ${playerId} selected ${card.name} targeting ${
          targetMonster?.name || "unknown"
        }`
      );
    } else {
      actionLog.push(
        `Player ${playerId} selected ${
          monster?.activeSkill.name || "Active Skill"
        } targeting ${targetMonster?.name || "unknown"}`
      );
    }

    set({ actionLog });
  },

  startActionPhase: () => {
    set({ isActionPhase: true });
    get().executeActions();
  },

  executeActions: () => {
    const { players, selectedActions } = get();
    let actionLog = [...get().actionLog];

    // If not all players have selected actions, do nothing
    if (selectedActions.length < players.length) {
      actionLog.push("Waiting for all players to select actions...");
      set({ actionLog });
      return;
    }

    actionLog.push("Executing actions...");

    // Create a mapping of monsters by player ID and monster ID for easy access
    const monstersMap = new Map();
    players.forEach((player) => {
      player.monsters.forEach((monster) => {
        monstersMap.set(`${player.id}-${monster.id}`, {
          monster,
          player,
        });
      });
    });

    // Sort actions by monster AGI
    const sortedActions = [...selectedActions].sort((a, b) => {
      const monsterA = monstersMap.get(`${a.playerId}-${a.monsterId}`)?.monster;
      const monsterB = monstersMap.get(`${b.playerId}-${b.monsterId}`)?.monster;

      // Higher AGI goes first
      return (monsterB?.stats.AGI || 0) - (monsterA?.stats.AGI || 0);
    });

    // Execute each action in order
    sortedActions.forEach((action) => {
      const { playerId, monsterId, card, target } = action;

      const attacker = monstersMap.get(`${playerId}-${monsterId}`);
      const defender = monstersMap.get(
        `${target.playerId}-${target.monsterId}`
      );

      if (!attacker || !defender) {
        actionLog.push("Error: Couldn't find attacker or defender");
        return;
      }

      const attackerMonster = attacker.monster;
      const defenderMonster = defender.monster;

      // Process action - either use the card or use active skill
      if (card) {
        if (card.type === "ATTACK") {
          // Handle attack card
          const attackCard = card as AttackCard;
          let damage = 0;

          // Calculate damage based on attack type
          if (
            Object.values(attacker.monster.affinity).includes(
              attackCard.attackType
            )
          ) {
            // Magical attack
            damage = Math.max(
              0,
              attacker.monster.stats.MATK * (attackCard.basePower / 100) -
                defenderMonster.stats.RES * 1.5
            );
          } else {
            // Physical attack
            damage = Math.max(
              0,
              attacker.monster.stats.PATK * (attackCard.basePower / 100) -
                defenderMonster.stats.DEF * 1.5
            );
          }

          // Apply critical hit chance
          const critRoll = Math.random() * 100;
          if (critRoll <= attacker.monster.stats.SKILL) {
            damage *= 1.5;
            actionLog.push(
              `CRITICAL HIT! ${attackerMonster.name} deals ${Math.round(
                damage
              )} damage to ${defenderMonster.name}!`
            );
          } else {
            actionLog.push(
              `${attackerMonster.name} deals ${Math.round(damage)} damage to ${
                defenderMonster.name
              }!`
            );
          }

          // Update defender's HP
          defenderMonster.stats.HP -= Math.round(damage);

          // Apply effects if any
          if (attackCard.effects) {
            attackCard.effects.forEach((effect) => {
              effect.apply(defenderMonster);
              actionLog.push(
                `${effect.name} applied to ${defenderMonster.name}!`
              );
            });
          }

          // Decrement card uses
          attackCard.uses--;
        } else if (card.type === "SUPPORT") {
          // Handle support card
          const supportCard = card as SupportCard;

          // Apply effects
          supportCard.effects.forEach((effect) => {
            effect.apply(defenderMonster);
            actionLog.push(
              `${effect.name} applied to ${defenderMonster.name}!`
            );
          });

          // Decrement card uses
          supportCard.uses--;
        }
      } else {
        // Use monster's active skill
        attackerMonster.activeSkill.execute(defenderMonster);
        actionLog.push(
          `${attackerMonster.name} used ${attackerMonster.activeSkill.name} on ${defenderMonster.name}!`
        );
      }

      // Check if defender is defeated
      if (defenderMonster.stats.HP <= 0) {
        actionLog.push(`${defenderMonster.name} has been defeated!`);

        // Remove the monster from the player's monsters
        const defenderPlayer = defender.player;
        defenderPlayer.monsters = defenderPlayer.monsters.filter(
          (m: MonsterCard) => m.id !== defenderMonster.id
        );

        // Check if the player has any monsters left
        if (defenderPlayer.monsters.length === 0) {
          set({ winner: attacker.player.id });
          actionLog.push(`Player ${attacker.player.id} wins!`);
        }
      }
    });

    // End the action phase
    set({
      isActionPhase: false,
      actionLog,
      players: [...players], // Update players with the new monster stats
    });

    // Draw cards for used cards
    players.forEach((player) => {
      get().drawCard(player.id);
    });

    // Increment turn counter if no winner
    if (!get().winner) {
      set({ currentTurn: get().currentTurn + 1 });
    }
  },

  drawCard: (playerId) => {
    const players = [...get().players];
    const player = players.find((p) => p.id === playerId);

    if (!player) return;

    // Get cards that have been used up (uses = 0)
    const usedCardIndices = player.hand
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => card.uses === 0)
      .map(({ index }) => index);

    // If there are used cards and cards in the deck, draw new ones
    if (usedCardIndices.length > 0 && player.deck.length > 0) {
      // Remove used cards from hand
      usedCardIndices.sort((a, b) => b - a); // Sort in descending order to avoid index issues

      usedCardIndices.forEach((index) => {
        player.hand.splice(index, 1);
      });

      // Draw cards from deck to replace used ones
      for (
        let i = 0;
        i < usedCardIndices.length && player.deck.length > 0;
        i++
      ) {
        const randomIndex = Math.floor(Math.random() * player.deck.length);
        const newCard = player.deck.splice(randomIndex, 1)[0];
        player.hand.push(newCard);
      }

      let actionLog = [...get().actionLog];
      actionLog.push(
        `Player ${playerId} drew ${usedCardIndices.length} new card(s)`
      );

      set({
        players,
        actionLog,
      });
    }
  },

  endTurn: () => {
    set({
      selectedActions: [],
      currentTurn: get().currentTurn + 1,
    });
  },

  resetGame: () => {
    set({
      currentTurn: 1,
      selectedActions: [],
      isActionPhase: false,
      winner: null,
      actionLog: ["Game reset!"],
    });
  },
}));
