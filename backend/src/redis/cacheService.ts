import redisClient from "./redisClient.js";

export async function getCache(key) {
    const data = await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

export async function setCache(key, value, ttl) {
    await redisClient.set(key, JSON.stringify(value), {EX: ttl,});
}

export async function deleteCache(key) {
    await redisClient.del(key);
}