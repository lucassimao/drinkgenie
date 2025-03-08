"use server";

import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.DRINKGENIE_REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

const RECENT_SEARCHES_TO_TRACK = 3;
const TOP_POPULAR_SEARCHES_TO_TRACK = 4;

export async function trackSearch(query: string) {
  await connectRedis();

  const now = Date.now(); // Use timestamp as score for sorting

  // Use MULTI to batch commands and EXEC to execute them atomically
  await redisClient
    .multi()
    .zIncrBy("popular_searches", 1, query) // Increment search frequency
    .zAdd("recent_searches", { score: now, value: query }) // Add search with timestamp
    .zRemRangeByRank("recent_searches", 0, -(RECENT_SEARCHES_TO_TRACK + 1))
    .exec();
}

export async function getTopPopularSearches(): Promise<string[]> {
  await connectRedis();
  const results = await redisClient.zRangeWithScores(
    "popular_searches",
    0,
    TOP_POPULAR_SEARCHES_TO_TRACK - 1,
    {
      REV: true,
    },
  );
  return results.map(({ value }) => value);
}

export async function getRecentSearches(): Promise<string[]> {
  await connectRedis();
  return await redisClient.zRange(
    "recent_searches",
    -RECENT_SEARCHES_TO_TRACK,
    -1,
    { REV: true },
  );
}

export async function getSearchStats() {
  await connectRedis();

  const results = await redisClient
    .multi()
    // Get top 5 searches
    .zRangeWithScores(
      "popular_searches",
      0,
      TOP_POPULAR_SEARCHES_TO_TRACK - 1,
      { REV: true },
    )
    .zRange("recent_searches", -RECENT_SEARCHES_TO_TRACK, -1, { REV: true }) // Get last 3 unique searches
    .exec();

  if (!results || !Array.isArray(results)) {
    return { popularSearches: [], recentSearches: [] };
  }

  // ✅ Handle Popular Searches
  const popularRaw = results[0];
  let popularSearches: string[] = [];

  if (Array.isArray(popularRaw)) {
    popularSearches = popularRaw.map((entry) => {
      if (
        typeof entry === "object" &&
        entry !== null &&
        "value" in entry &&
        "score" in entry
      ) {
        return Buffer.isBuffer(entry.value)
          ? entry.value.toString()
          : String(entry.value);
      }
      return ""; // Fallback for unexpected types
    });
  }

  // ✅ Handle Recent Searches (Already sorted by timestamp due to ZSET)
  const recentRaw = results[1];
  let recentSearches: string[] = [];

  if (Array.isArray(recentRaw)) {
    recentSearches = recentRaw.map((entry) =>
      Buffer.isBuffer(entry) ? entry.toString() : String(entry),
    );
  }

  return {
    popularSearches,
    recentSearches,
  };
}
