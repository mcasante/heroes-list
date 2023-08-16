interface Thumbnail {
  path: string;
  extension: string;
}
export interface Hero {
  id: string;
  name: string;
  thumbnail: Thumbnail | string;
  description?: string;
  modified?: string;
  local?: boolean;
}

export interface HeroListOptions {
  offset: number
  limit: number
}

export interface HeroListResponse {
  limit: number
  offset: number
  count: number
  total: number
  results: Hero[]
}
