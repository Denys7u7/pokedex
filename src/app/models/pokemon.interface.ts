export interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: Type[];
  abilities: Ability[];
  stats: StatElement[];
  image: string;
  sprites?: any;
  height: number;
  weight: number;
  cries: Cries;
}

export interface Cries {
  latest: string;
  legacy: string;
}

export interface StatElement {
  base_stat: number;
  effort: number;
  stat: TypeClass;
}

export interface Ability {
  slot: number;
  ability: TypeClass;
}

export interface TypeClass {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: TypeClass;
}

export interface Result {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}
