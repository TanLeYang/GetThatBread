import { RedisClientType } from "./server"

export type CodeState = {
  code: string
  language: CodeLanguage
}

export type CodeLanguage = "PYTHON" | ""

export type SubscriptionState = Map<string, RedisClientType[]>

export interface CodeService {
  subscribeCodeChangeEvent(
    subscriberID: string,
    roomCode: string,
    callback: (codeState: CodeState) => void
  ): Promise<void>

  subscribeCodeExecutionEvent(
    subscriberID: string,
    roomCode: string,
    callback: () => void
  ): Promise<void>

  subscribeCodeExecuionResultEvent(
    subscriberID: string,
    roomCode: string,
    callback: (output: string) => void
  ): Promise<void>

  unsubscribe(subscriberID: string): Promise<void>

  publishCodeChangeEvent(roomCode: string, codeState: CodeState): Promise<void>
  publishCodeExecutionEvent(roomCode: string): Promise<void>
  publishCodeExecutionResultEvent(roomCode: string, output: string): Promise<void>
}

export default function createCodeService(redisClient: RedisClientType): CodeService {

  let subscriptions: SubscriptionState = new Map()

  const codeChangeEventName = (roomCode: string) => `cc-${roomCode}`
  const codeExecutionEventName = (roomCode: string) => `ce-${roomCode}`
  const codeExecutionResultEventName = (roomCode: string) => `cc-${roomCode}`

  const subscribeCodeChangeEvent = async (
    subscriberID: string,
    roomCode: string,
    callback: (codeState: CodeState) => void
  ): Promise<void> => {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
    await subscriber.subscribe(codeChangeEventName(roomCode), (msg) => {
      const codeState = JSON.parse(msg)
      callback(codeState)
    })

    addSubscription(subscriberID, subscriber)
  }

  const subscribeCodeExecutionEvent = async (
    subscriberID: string,
    roomCode: string,
    callback: () => void
  ): Promise<void> => {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
    await subscriber.subscribe(codeExecutionEventName(roomCode), () => {
      callback()
    })

    addSubscription(subscriberID, subscriber)
  }

  const subscribeCodeExecuionResultEvent = async (
    subscriberID: string,
    roomCode: string,
    callback: (output: string) => void
  ): Promise<void> => {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
    await subscriber.subscribe(codeExecutionResultEventName(roomCode), (output) => {
      callback(output)
    })

    addSubscription(subscriberID, subscriber)
  }

  const unsubscribe = async (subscriberID: string): Promise<void> => {
    const subs = subscriptions.get(subscriberID)
    if (!subs) {
      return
    }

    subscriptions.delete(subscriberID)
    Promise.all(subs.map((subscriber) => subscriber.disconnect()))
  }

  const publishCodeChangeEvent = async (roomCode: string, codeState: CodeState): Promise<void> => {
    const rawMessage = JSON.stringify(codeState)
    await redisClient.publish(`cc-${roomCode}`, rawMessage)
  }

  const publishCodeExecutionEvent = async (roomCode: string): Promise<void> => {
    redisClient.publish(`ce-${roomCode}`, "")
  }

  const publishCodeExecutionResultEvent = async (roomCode: string, output: string): Promise<void> => {
    redisClient.publish(`cer-${roomCode}`, output)
  }

  const addSubscription = (subscriberID: string, client: RedisClientType) => {
    const subs = subscriptions.get(subscriberID)
    if (subs) {
      subs.push(client)
    } else {
      subscriptions[subscriberID] = [client]
    }
  }

  return {
    subscribeCodeChangeEvent,
    subscribeCodeExecutionEvent,
    subscribeCodeExecuionResultEvent,
    unsubscribe,
    publishCodeChangeEvent,
    publishCodeExecutionEvent,
    publishCodeExecutionResultEvent
  }
}