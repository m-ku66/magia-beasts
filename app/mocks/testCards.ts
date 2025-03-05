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

// Example monster card
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
      // Will implement this later!
      console.log(`Using Basic Strike on ${target.name}`);
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
        description: "Burns the target",
        duration: 2,
        apply: (target) => {
          console.log(`Applying burn to ${target.name}`);
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
        description: "Boosts attack for 3 turns",
        duration: 3,
        apply: (target) => {
          console.log(`Boosting attack for ${target.name}`);
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
          console.log(`${target.name} will survive the next fatal blow`);
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
    },
    {
      id: uuid(),
      monsters: [testMonster], // Using same monster for testing
      hand: [...testAttackCards, ...testSupportCards],
      deck: [], // Empty for now
    },
  ],
};
