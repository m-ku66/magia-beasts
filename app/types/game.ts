// Constants for our "enum-like" types
const CardType = {
  MONSTER: "MONSTER",
  ATTACK: "ATTACK",
  SUPPORT: "SUPPORT",
} as const;

const Attribute = {
  SLASH: "SLASH",
  BLUNT: "BLUNT",
  MISSILE: "MISSILE",
  PIERCE: "PIERCE",
} as const;

const Affinity = {
  FIRE: "FIRE",
  WATER: "WATER",
  WIND: "WIND",
  EARTH: "EARTH",
  LIGHTNING: "LIGHTNING",
} as const;

// Type definitions from constants
type CardType = (typeof CardType)[keyof typeof CardType];
type Attribute = (typeof Attribute)[keyof typeof Attribute];
type Affinity = (typeof Affinity)[keyof typeof Affinity];

// Base stats interface for monster cards
interface BaseStats {
  HP: number;
  MP: number;
  STM: number;
  PATK: number;
  MATK: number;
  DEF: number;
  RES: number;
  SKILL: number;
  LUCK: number;
  AGI: number;
}

// Base interface for all cards
interface BaseCard {
  id: string;
  name: string;
  type: CardType;
}

// Monster card interface
interface MonsterCard extends BaseCard {
  type: typeof CardType.MONSTER;
  description: string;
  stats: BaseStats;
  activeSkill: Skill;
  passiveSkill: Skill;
  reactionSkill: Skill;
  attribute: Attribute;
  affinity: Affinity;
}

// Attack card interface
interface AttackCard extends BaseCard {
  type: typeof CardType.ATTACK;
  description: string;
  attackType: Attribute | Affinity;
  basePower: number;
  effects?: Effect[];
  uses: number;
}

// Support card interface
interface SupportCard extends BaseCard {
  type: typeof CardType.SUPPORT;
  description: string;
  effects: Effect[];
  uses: number;
}

// Skill interface
interface Skill {
  name: string;
  description: string;
  execute: (target: MonsterCard) => void;
}

// Effect interface
interface Effect {
  name: string;
  description: string;
  duration: number;
  apply: (target: MonsterCard) => void;
}

// Export everything we need
export {
  CardType,
  Attribute,
  Affinity,
  type BaseStats,
  type BaseCard,
  type MonsterCard,
  type AttackCard,
  type SupportCard,
  type Skill,
  type Effect,
};
