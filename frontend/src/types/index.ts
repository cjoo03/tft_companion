export interface Champion {
  id: string
  name: string
  cost: number
  traits: string[]
  ability: {
    name: string
    description: string
  }
  stats: {
    health: number[]
    mana: number
    armor: number
    magicResist: number
    dps: number[]
  }
}

export interface Item {
  id: number
  name: string
  description: string
  imageUrl: string
  stats: {
    [key: string]: number
  }
}

export interface Composition {
  name: string;
  tier: string;
  champions: string[];
  traits: string[];
}

export interface MetaCompsResponse {
  compositions: Composition[];
}

export interface TraitBreakpoint {
  count: number;
  effect: string;
}

export interface TraitData {
  name: string;
  breakpoints: TraitBreakpoint[];
  isUnique?: boolean;
}

// Example usage:
const TRAIT_DATA: { [key: string]: TraitData } = {
  "Scrap": {
    name: "Scrap",
    breakpoints: [
      { count: 2, effect: "Minor bonus" },
      { count: 4, effect: "Medium bonus" },
      { count: 6, effect: "Major bonus" },
      { count: 9, effect: "Ultimate bonus" }
    ]
  },
  "Junker King": {
    name: "Junker King",
    breakpoints: [{ count: 1, effect: "Active" }],
    isUnique: true
  },
  // ... other traits
} 