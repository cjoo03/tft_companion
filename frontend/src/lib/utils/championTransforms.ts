import { Champion } from '@/types'
import { SET13_CHAMPION_COSTS, SET13_CHAMPION_DATA } from '../constants/set13Data'

export function transformSet13Champions(rawData: any[]): Champion[] {
  try {
    if (!Array.isArray(rawData)) {
      console.error('Expected array of champions, received:', typeof rawData);
      return [];
    }

    return rawData
      .filter(champ => {
        // Validate champion data structure
        if (!champ?.name || !champ?.character_record) {
          console.warn('Invalid champion data structure:', champ);
          return false;
        }

        return champ.name.startsWith('TFT13_') && 
               !champ.name.includes('Prop') && 
               !champ.name.includes('Spider') &&
               champ.character_record.traits.length > 0;
      })
      .map(champ => {
        const championData = SET13_CHAMPION_DATA[champ.name];
        
        if (!championData) {
          console.warn(`Missing data for champion: ${champ.name}`);
        }

        return {
          id: champ.name,
          name: champ.character_record.display_name,
          cost: SET13_CHAMPION_COSTS[champ.name] || 1,
          traits: champ.character_record.traits.map((trait: { name: string }) => trait.name),
          ability: championData?.ability || {
            name: "Unknown",
            description: "Ability data not available"
          },
          stats: championData?.stats || {
            health: 0,
            mana: 0,
            armor: 0,
            magicResist: 0,
            dps: 0
          }
        };
      })
      .sort((a, b) => {
        if (a.cost !== b.cost) return a.cost - b.cost;
        return a.name.localeCompare(b.name);
      });
  } catch (error) {
    console.error('Error transforming champions:', error);
    return [];
  }
} 