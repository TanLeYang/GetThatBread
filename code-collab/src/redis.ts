import * as redis from "redis"

export function newRedisClient() {
  const redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      tls: process.env.NODE_ENV === "PRODUCTION"
    }
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
