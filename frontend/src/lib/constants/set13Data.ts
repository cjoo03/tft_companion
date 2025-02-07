import { Champion } from '@/types';
import rawData from './tftchampions_set13';  // Remove .ts extension

// Champion cost mapping for Set 13
export const SET13_CHAMPION_COSTS: { [key: string]: number } = {
  // 1 Cost
  "TFT13_Amumu": 1,
  "TFT13_Darius": 1,
  "TFT13_Draven": 1,
  "TFT13_Irelia": 1,
  "TFT13_Lux": 1,
  "TFT13_Maddie": 1,
  "TFT13_Morgana": 1,
  "TFT13_Powder": 1,
  "TFT13_Singed": 1,
  "TFT13_Steb": 1,
  "TFT13_Trundle": 1,
  "TFT13_Vex": 1,
  "TFT13_Violet": 1,
  "TFT13_Zyra": 1,
  
  // 2 Cost
  "TFT13_Akali": 2,
  "TFT13_Camille": 2,
  "TFT13_Leona": 2,
  "TFT13_Nocturne": 2,
  "TFT13_Rell": 2,
  "TFT13_RenataGlasc": 2,
  "TFT13_Sett": 2,
  "TFT13_Tristana": 2,
  "TFT13_Urgot": 2,
  "TFT13_Vander": 2,
  "TFT13_Vladimir": 2,
  "TFT13_Zeri": 2,
  "TFT13_Ziggs": 2,
  
  // 3 Cost
  "TFT13_Blitzcrank": 3,
  "TFT13_Cassiopeia": 3,
  "TFT13_Ezreal": 3,
  "TFT13_Gangplank": 3,
  "TFT13_Kogmaw": 3,
  "TFT13_Loris": 3,
  "TFT13_Nami": 3,
  "TFT13_Nunu": 3,
  "TFT13_Renni": 3,
  "TFT13_Scar": 3,
  "TFT13_Smeech": 3,
  "TFT13_Swain": 3,
  "TFT13_TwistedFate": 3,
  
  // 4 Cost
  "TFT13_Ambessa": 4,
  "TFT13_Corki": 4,
  "TFT13_DrMundo": 4,
  "TFT13_Ekko": 4,
  "TFT13_Elise": 4,
  "TFT13_Garen": 4,
  "TFT13_Heimerdinger": 4,
  "TFT13_Illaoi": 4,
  "TFT13_Silco": 4,
  "TFT13_Twitch": 4,
  "TFT13_Vi": 4,
  "TFT13_Zoe": 4,
  
  // 5 Cost
  "TFT13_Caitlyn": 5,
  "TFT13_Jayce": 5,
  "TFT13_Jinx": 5,
  "TFT13_Leblanc": 5,
  "TFT13_Malzahar": 5,
  "TFT13_Mordekaiser": 5,
  "TFT13_Rumble": 5,
  "TFT13_Sevika": 5,
  
  // 6 Cost
  "TFT13_Viktor": 6,
  "TFT13_Mel": 6,
  "TFT13_Warwick": 6
};

export const SET13_CHAMPION_DATA: {
  [key: string]: {
    ability: { name: string; description: string };
    stats: {
      health: number[];
      damage: number[];
      dps: number[];
      mana: number;
      armor: number;
      magicResist: number;
    };
  };
} = {
  "TFT13_Amumu": {
    ability: {
      name: "Obsolete Technology",
        description: "Passive: Amumu reduces all incoming damage. Every second, emit sparks that deal magic damage to adjacent enemies."
    },
    stats: {
      health: [600, 1080, 1944],
      damage: [45, 68, 101],
      dps: [0, 0, 0],
      mana: 60,
      armor: 35,
      magicResist: 35
    }
  },
  "TFT13_Darius": {
    ability: {
      name: "Decimate", 
      description: "Darius spins, dealing 2.4 (AD) physical damage to adjacent enemies and healing him. Apply a 2 (AD) physical damage bleed to target over 4 seconds."
    },
    stats: {
      health: [600, 1100, 2100],
      damage: [55, 83, 124],
      dps: [39, 58, 87],
      mana: 70,
      armor: 40,
      magicResist: 40
    }
  },
  "TFT13_Draven": {
    ability: {
      name: "Spinning Axes",
      description: "Passive: If Draven has an empowered axe in hand, it replaces his next attack, dealing physical damage. Empowered axes return to Draven after hitting an enemy.Active: Spin an empowered axe."
    },
    stats: {
      health: [650, 1170, 2106],
      damage: [50, 75, 113],
      dps: [45, 68, 102],
      mana: 50,
      armor: 35,
      magicResist: 35
    }
  },
  // Template for other champions
  "TFT13_Champion": {
    ability: {
      name: "",
      description: ""
    },
    stats: {
      health: [0, 0, 0],
      damage: [0, 0, 0],
      dps: [0, 0, 0],
      mana: 0,
      armor: 0,
      magicResist: 0
    }
  }
};

function transformSet13Champions(rawData: any[]): Champion[] {
  return rawData
    .filter(champ => {
      // Filter only Set 13 champions and exclude props/transformed states
      return champ.name.startsWith('TFT13_') && 
             !champ.name.includes('Prop') && 
             !champ.name.includes('Spider') &&
             champ.character_record.traits.length > 0;
    })
    .map(champ => ({
      id: champ.name,
      name: champ.character_record.display_name,
      cost: SET13_CHAMPION_COSTS[champ.name] || 1, // Fallback to 1 if not found
      traits: champ.character_record.traits.map((trait: { name: string }) => trait.name),
      ability: {
        name: "", // These would need to be added from a separate data source
        description: ""
      },
      stats: {
        health: [0, 0, 0],    // These stats would need to be added
        mana: 0,      // from a separate data source
        armor: 0,
        magicResist: 0,
        dps: [0, 0, 0]
      }
    }));
}

// Usage:
const set13Champions = transformSet13Champions(rawData)
  .sort((a, b) => {
    // Sort by cost first, then alphabetically
    if (a.cost !== b.cost) return a.cost - b.cost;
    return a.name.localeCompare(b.name);
  });