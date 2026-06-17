import { redis } from "./reddis";

export async function acquireLock(
  key: string,
  ttlSeconds = 30
) {
  return redis.set(
    key,
    "locked",
    "EX",
    ttlSeconds,
    "NX"
  );
}

export async function releaseLock(
  key: string
) {
  await redis.del(key);
}