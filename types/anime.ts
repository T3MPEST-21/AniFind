export interface AnimeTitle {
  romaji: string;
  english: string;
  native: string;
}

export interface AnimeCoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
}

export interface AnimeStartDate {
  year: number;
  month: number;
  day: number;
}

export interface CharacterName {
  full: string;
  native: string;
}

export interface CharacterImage {
  large: string;
  medium: string;
}

export interface Character {
  id: number;
  name: CharacterName;
  image: CharacterImage;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  bannerImage?: string;
  description: string;
  averageScore: number;
  seasonYear?: number;
  format: string; // "TV", "MOVIE", etc. (was type)
  episodes?: number;
  status: string;
  duration?: number;
  genres: string[];
  startDate?: AnimeStartDate;
  characters?: {
    nodes: Character[];
  };
}

export interface SearchResult {
  Page: {
    pageInfo: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
    };
    media: Anime[];
  };
}
