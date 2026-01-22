import { TraceMoeMatch, TraceMoeResult } from "../types/trace";

const TRACE_MOE_API = "https://api.trace.moe/search";

export const TraceMoeService = {
  searchByImage: async (imageUri: string): Promise<TraceMoeMatch[]> => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(TRACE_MOE_API, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data: TraceMoeResult = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.result.map((item) => ({
        id: `${item.anilist}-${item.from}`,
        anilistId: item.anilist,
        filename: item.filename,
        episode: item.episode,
        similarity: item.similarity,
        videoUrl: item.video,
        imageUrl: item.image,
        timestamp: formatTimestamp(item.from),
      }));
    } catch (error) {
      console.error("Trace.moe error:", error);
      throw error;
    }
  },
};

function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (h > 0) parts.push(h);
  parts.push(h > 0 ? m.toString().padStart(2, "0") : m);
  parts.push(s.toString().padStart(2, "0"));

  return parts.join(":");
}
