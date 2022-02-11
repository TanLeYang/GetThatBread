import { RedisClientType } from "./server"

export type CodeState = {
  code: string
  language: CodeLanguage
} 

export enum CodeLanguage {
  PYTHON
}

export type SubscriptionState = Map<string, RedisClientType>

export interface CodeService {
  subscribe(
    subscriptions: SubscriptionState,
    subscriberID: string,
    roomCode: string,
    callback: (codeState: CodeState) => void
  ): Promise<SubscriptionState> 
  unsubscribe(subscriptions: SubscriptionState, subscriberID: string): Promise<SubscriptionState>
  publish(roomCode: string, codeState: CodeState): Promise<void>
}

export default function createCodeService(redisClient: RedisClientType): CodeService {

  async function subscribe(
    subscriptions: SubscriptionState,
    subscriberID: string,
    roomCode: string,
    callback: (codeState: CodeState) => void
  ): Promise<SubscriptionState> {
      const subscriber = redisClient.duplicate()
      await subscriber.connect()
      await subscriber.subscribe(roomCode, (msg) => {
        const codeState = JSON.parse(msg)
        callback(codeState)
      }) 

      const newSubscriptions = new Map(subscriptions) 
      newSubscriptions[subscriberID] = subscriber
      return newSubscriptions 
  }

  async function unsubscribe(
    subscriptions: SubscriptionState, 
    subscriberID: string
  ): Promise<SubscriptionState> {
    const subscriber = subscriptions.get(subscriberID)
    if (!subscriber) {
      return subscriptions
    }

    const newSubscriptions = new Map(subscriptions)
    newSubscriptions.delete(subscriberID)
    return newSubscriptions
  } 

  async function publish(roomCode: string, codeState: CodeState): Promise<void> {
    const rawMessage = JSON.stringify(codeState)
    await redisClient.connect()
    await redisClient.publish(roomCode, rawMessage)
  }

  return {
    subscribe,
    unsubscribe,
    publish
  }
}