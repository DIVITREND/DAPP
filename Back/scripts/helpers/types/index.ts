export type Trait = {
    trait_type: string;
    value: string;
  }
  
  export type Metadata = {
    name: string;
    edition: number;
    attributes: Trait[];
  }
  
  
  export type Rarity = {
    type: string;
    values: Value[];
  }
  
  export type Value = {
    trait: string;
    weight: number;
    occurrence: number;
  }
  
  export interface ILegendLevel {
    id: number;
    level:string;
  }
  
  export interface ILegendWeight {
    level:string;
    weight: number;
  }
  
  export interface ILegendsNFT {
    name: string; 
    id: number;
    rank: number;
    score: number;
    rarity: string;
    name: string;
  }
  