import * as redis from "redis"

export function newRedisClient() {
  const REDIS_SERVER = process.env.REDIS_URL
  const redisClient = redis.createClient({
    url: REDIS_SERVER
  })

  return redisClient
}

export type RedisClientType = ReturnType<typeof newRedisClient>

export async function initializeRedisClient(
  client: RedisClientType
): Promise<void> {
  return client.connect().catch((err) => {
    console.error(`failed to connected to redis: ${err}`)
  })
}
