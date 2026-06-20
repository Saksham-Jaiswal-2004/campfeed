import redisClient from "./redisClient.js";

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get<T>(key);

    return data || null;
  } catch (error) {
    console.error("Redis GET error:", error);

    return null;
  }
}

export async function setCache(key: string, value: unknown, ttl = 300) {
  try {
    await redisClient.set(key, value, {
      ex: ttl,
    });
  } catch (error) {
    console.error("Redis SET error:", error);
  }
}

export async function deleteCache(key: string) {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis DELETE error:", error);
  }
}