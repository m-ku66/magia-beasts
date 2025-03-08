// mocks/testCards.ts
import { v4 as uuid } from "uuid";
import {
  CardType,
  Attribute,
  Affinity,
  type MonsterCard,
  type AttackCard,
  type SupportCard,
} from "../types/game";

// Example monster card 1
export const testMonster: MonsterCard = {
  id: uuid(),
  name: "Rookie Warrior",
  type: CardType.MONSTER,
  description: "A rookie warrior looking to prove themselves",
  stats: {
    HP: 100,
    MP: 50,
    STM: 80,
    PATK: 30,
    MATK: 20,
    DEF: 25,
    RES: 20,
    SKILL: 45,
    LUCK: 30,
    AGI: 40,
  },
  activeSkill: {
    name: "Basic Strike",
    description: "A simple attack that costs no resources",
    execute: (target) => {
      // Actually modify the target's HP
      const damage = 20; // Base damage value
      target.stats.HP = Math.max(0, target.stats.HP - damage);
      return `Basic Strike dealt ${damage} damage to ${target.name}`;
    },
  },
  passiveSkill: {
    name: "Endurance",
    description: "Recovers 1 STM per turn",
    execute: (target) => {
      // Will implement this later!
      console.log(`Recovering STM for ${target.name}`);
    },
  },
  reactionSkill: {
    name: "Counter Stance",
    description: "10% chance to counter physical attacks",
    execute: (target) => {
      // Will implement this later!
      console.log(`Checking counter for ${target.name}`);
    },
  },
  attribute: Attribute.SLASH,
  affinity: Affinity.FIRE,
};

// Example monster card 1
export const testMonster2: MonsterCard = {
  id: uuid(),
  name: "Hobgoblin",
  type: CardType.MONSTER,
  description: "A rookie warrior looking to prove themselves",
  stats: {
    HP: 130,
    MP: 20,
    STM: 90,
    PATK: 40,
    MATK: 10,
    DEF: 30,
    RES: 5,
    SKILL: 20,
    LUCK: 10,
    AGI: 20,
  },
  activeSkill: {
    name: "Club Strike",
    description: "A heavy but slow attack",
    execute: (target) => {
      // Actually modify the target's HP with higher damage
      const damage = 30; // Higher base damage
      target.stats.HP = Math.max(0, target.stats.HP - damage);
      return `Club Strike dealt ${damage} damage to ${target.name}`;
    },
  },
  passiveSkill: {
    name: "Endurance",
    description: "Recovers 1 STM per turn",
    execute: (target) => {
      // Will implement this later!
      console.log(`Recovering STM for ${target.name}`);
    },
  },
  reactionSkill: {
    name: "Counter Stance",
    description: "10% chance to counter physical attacks",
    execute: (target) => {
      // Will implement this later!
      console.log(`Checking counter for ${target.name}`);
    },
  },
  attribute: Attribute.SLASH,
  affinity: Affinity.FIRE,
};

// Example attack cards
export const testAttackCards: AttackCard[] = [
  {
    id: uuid(),
    name: "Flame Slash",
    description: "A powerful fire attack",
    type: CardType.ATTACK,
    attackType: Affinity.FIRE,
    basePower: 90,
    uses: 3,
    effects: [
      {
        name: "Burn",
        description: "Burns the target for 5 damage",
        duration: 2,
        apply: (target) => {
          // Actually apply burn damage
          const burnDamage = 5;
          target.stats.HP = Math.max(0, target.stats.HP - burnDamage);
          return `Burn effect dealt ${burnDamage} damage to ${target.name}`;
        },
      },
    ],
  },
  {
    id: uuid(),
    name: "Quick Strike",
    description: "A swift physical attack",
    type: CardType.ATTACK,
    attackType: Attribute.SLASH,
    basePower: 70,
    uses: 4,
  },
];

// Example support card
export const testSupportCards: SupportCard[] = [
  {
    id: uuid(),
    name: "Battle Focus",
    description: "Boosts attack for a set number of turns",
    type: CardType.SUPPORT,
    uses: 2,
    effects: [
      {
        name: "Attack Up I",
        description: "Boosts attack by 10 for 3 turns",
        duration: 3,
        apply: (target) => {
          // Actually boost attack
          target.stats.PATK += 10;
          return `${target.name}'s attack increased by 10`;
        },
      },
    ],
  },
  {
    id: uuid(),
    name: "Grit",
    description: "Survive the next fatal blow",
    type: CardType.SUPPORT,
    uses: 1,
    effects: [
      {
        name: "Resolve",
        description: "Survive the next fatal blow",
        duration: 1,
        apply: (target) => {
          // We'd need a way to flag this monster as having grit active
          // This would require modifying the MonsterCard type to track effects
          // For now, we could just boost defense as a simple implementation
          target.stats.DEF += 100;
          return `${target.name} is now more resilient`;
        },
      },
    ],
  },
];

// Test game state
export const testGameState = {
  players: [
    {
      id: uuid(),
      monsters: [testMonster],
      hand: [...testAttackCards, ...testSupportCards],
      deck: [], // Empty for now
      isAI: false,
    },
    {
      id: uuid(),
      monsters: [testMonster2], // Using same monster for testing
      hand: [...testAttackCards, ...testSupportCards],
      deck: [], // Empty for now
      isAI: true,
    },
  ],
};
