import redisClient from "./redisClient.js";

export async function getCache<T = unknown>(key: string): Promise<T | null> {
  const data = await redisClient.get(key);

  if (data == null) {
    return null;
  }

  return JSON.parse(data) as T;
}

export async function setCache(
  key: string,
  value: unknown,
  ttl: number,
): Promise<void> {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl,
  });
}

export async function deleteCache(key: string): Promise<void> {
  await redisClient.del(key);
}