import { redisClient } from "./redis";
import { filteredTask } from "src/domain/task.entity";

export async function getCache(key: string): Promise<filteredTask | null> {
  try {
    const cachedData = await redisClient.get(key);
    if (!cachedData) return null;
    return JSON.parse(cachedData) as filteredTask;
  } catch (error) {
    console.error(`Error parsing cache for key ${key}:`, error);
    return null;
  }
}
export async function setCache(key: string, value: any, ttl: number = 60) {
  return redisClient.set(key, JSON.stringify(value), "EX", ttl);
}

export async function deleteCache(key: string) {
  return redisClient.del(key);
}
