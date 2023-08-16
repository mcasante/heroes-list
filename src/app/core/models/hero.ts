interface Thumbnail {
  path: string;
  extension: string;
}
export interface Hero {
  id: number;
  name: string;
  thumbnail: Thumbnail | string;
  description?: string;
  modified?: string;
  local?: boolean;
}
