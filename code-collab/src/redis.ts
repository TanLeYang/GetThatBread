import * as redis from "redis"

export function initalizeRedisClient() {
  const REDIS_SERVER = process.env.REDIS_URL
  const redisClient = redis.createClient({
    url: REDIS_SERVER
  })

  return redisClient
}

export type RedisClientType = ReturnType<typeof initalizeRedisClient>
