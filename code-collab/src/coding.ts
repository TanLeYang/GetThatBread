import { RedisClientType } from "./server"

export type CodeState = {
  code: string
  language: CodeLanguage
}

export type CodeLanguage = "PYTHON" | ""

export type SubscriptionState = Map<string, RedisClientType>

export interface CodeService {
  subscribe(
    subscriberID: string,
    roomCode: string,
    callback: (codeState: CodeState) => void
  ): Promise<void>
  unsubscribe(subscriberID: string): Promise<void>
  publish(roomCode: string, codeState: CodeState): Promise<void>
}

export default function createCodeService(redisClient: RedisClientType): CodeService {

  let subscriptions: SubscriptionState = new Map()

  const subscribe = async (
    subscriberID: string,
    roomCode: string,
    callback: (codeState: CodeState) => void
  ): Promise<void> => {
      const subscriber = redisClient.duplicate()
      await subscriber.connect()
      await subscriber.subscribe(roomCode, (msg) => {
        const codeState = JSON.parse(msg)
        callback(codeState)
      })

      subscriptions[subscriberID] = subscriber
  }

  const unsubscribe = async (subscriberID: string): Promise<void> => {
    const subscriber = subscriptions.get(subscriberID)
    if (!subscriber) {
      return
    }

    subscriptions.delete(subscriberID)
    await subscriber.disconnect()
  }

  const publish = async (roomCode: string, codeState: CodeState): Promise<void> => {
    const rawMessage = JSON.stringify(codeState)
    await redisClient.publish(roomCode, rawMessage)
  }

  return {
    subscribe,
    unsubscribe,
    publish
  }
}