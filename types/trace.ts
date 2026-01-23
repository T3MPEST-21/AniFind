// API Response format from trace.moe
export interface TraceMoeApiResponse {
  frameCount: number;
  error?: string;
  result: {
    anilist: number;
    filename: string;
    episode: number | null;
    from: number;
    to: number;
    similarity: number;
    video: string;
    image: string;
  }[];
}

// App data model (what we store and use)
export interface TraceMoeResult {
  anilist: {
    id: number;
    title: {
      native: string;
      romaji: string;
      english: string;
    };
  };
  filename: string;
  episode: number | null;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

export interface TraceMoeMatch {
  id: string; // generated unique key
  anilistId: number;
  filename: string;
  episode: number | null;
  similarity: number;
  videoUrl: string;
  imageUrl: string;
  timestamp: string;
}
