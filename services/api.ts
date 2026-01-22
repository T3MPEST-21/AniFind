import { Anime } from "../types/anime";

const ANILIST_API = "https://graphql.anilist.co";

async function fetchAniList<T>(
  query: string,
  variables: Record<string, any> = {},
): Promise<T> {
  try {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Reusable fragment to keep queries clean
const MEDIA_FRAGMENT = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    color
  }
  averageScore
  description
  seasonYear
  format
  status
  episodes
  duration
  genres
  bannerImage
`;

export const AniListService = {
  getTrending: async (page = 1, perPage = 10) => {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: TRENDING_DESC, type: ANIME) {
            ${MEDIA_FRAGMENT}
          }
        }
      }
    `;
    const data = await fetchAniList<{ Page: { media: Anime[] } }>(query, {
      page,
      perPage,
    });
    return data.Page.media;
  },

  getSeasonal: async (
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
    year: number,
    page = 1,
    perPage = 10,
  ) => {
    const query = `
        query ($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
            Page(page: $page, perPage: $perPage) {
                media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
                    ${MEDIA_FRAGMENT}
                }
            }
        }
    `;
    const data = await fetchAniList<{ Page: { media: Anime[] } }>(query, {
      page,
      perPage,
      season,
      year,
    });
    return data.Page.media;
  },

  // Helper to get current season params automatically if needed,
  // but for now we'll just expose a generic list
  getSeasonNow: async () => {
    // Simplified logic: Just get 'POPULAR' currently airing for "Season Now" equivalent
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(status: RELEASING, sort: POPULARITY_DESC, type: ANIME) {
            ${MEDIA_FRAGMENT}
          }
        }
      }
    `;
    const data = await fetchAniList<{ Page: { media: Anime[] } }>(query);
    return data.Page.media;
  },

  searchAnime: async (search: string, page = 1) => {
    const query = `
      query ($search: String, $page: Int) {
        Page(page: $page, perPage: 20) {
          media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
            ${MEDIA_FRAGMENT}
          }
        }
      }
    `;
    const data = await fetchAniList<{ Page: { media: Anime[] } }>(query, {
      search,
      page,
    });
    return data.Page.media;
  },

  getAnimeDetails: async (id: number) => {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          ${MEDIA_FRAGMENT}
          startDate {
              year
              month
              day
          }
          characters(sort: ROLE, perPage: 6) {
             nodes {
                id
                name {
                   full
                }
                image {
                   large
                }
             }
          }
        }
      }
    `;
    const data = await fetchAniList<{ Media: Anime }>(query, { id });
    return data.Media;
  },
};
