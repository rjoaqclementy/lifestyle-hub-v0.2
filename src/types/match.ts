export type GenderRestriction = 'mixed' | 'men-only' | 'women-only' | 'gender-ratio';
export type AgeRestriction = 'none' | 'under-18' | 'under-21' | 'over-18' | 'over-21' | 'custom';

export interface GenderRatio {
  men: number;
  women: number;
}

export interface AgeRange {
  min?: number;
  max?: number;
}

export interface MatchRestrictions {
  gender: GenderRestriction;
  genderRatio?: GenderRatio;
  age: AgeRestriction;
  customAgeRange?: AgeRange;
  skillLevel: string[];
  maxPlayers: number;
  teamBalancing: boolean;
}