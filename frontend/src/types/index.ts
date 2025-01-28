export interface Composition {
  name: string;
  tier: string;
  champions: string[];
  traits: string[];
}

export interface MetaCompsResponse {
  compositions: Composition[];
} 