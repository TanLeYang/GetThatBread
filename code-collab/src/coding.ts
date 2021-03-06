import { RedisClientType } from "./redis"

export type CodeState = {
  code: string
  language: CodeLanguage
}

export type CodeChangeEventArgs = {
  publisherID: string
  codeState: CodeState
}

export type CodeLanguage = "PYTHON" | ""

export type SubscriptionState = Map<string, RedisClientType[]>

export interface CodeService {
  subscribeCodeChangeEvent(
    subscriberID: string,
    roomCode: string,
    callback: (args: CodeChangeEventArgs) => void
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

  publishCodeChangeEvent(
    roomCode: string,
    args: CodeChangeEventArgs
  ): Promise<void>

  publishCodeExecutionEvent(roomCode: string): Promise<void>

  publishCodeExecutionResultEvent(
    roomCode: string,
    output: string
  ): Promise<void>
}

export default function createCodeService(
  redisClient: RedisClientType
): CodeService {
  let subscriptions: SubscriptionState = new Map()

  const codeChangeEventName = (roomCode: string) => `cc-${roomCode}`
  const codeExecutionEventName = (roomCode: string) => `ce-${roomCode}`
  const codeExecutionResultEventName = (roomCode: string) => `cer-${roomCode}`

  const subscribeCodeChangeEvent = async (
    subscriberID: string,
    roomCode: string,
    callback: (args: CodeChangeEventArgs) => void
  ): Promise<void> => {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
    await subscriber.subscribe(codeChangeEventName(roomCode), (msg) => {
      const codeChangeEventArgs: CodeChangeEventArgs = JSON.parse(msg)
      callback(codeChangeEventArgs)
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
    await subscriber.subscribe(
      codeExecutionResultEventName(roomCode),
      (output) => {
        callback(output)
      }
    )

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

  const publishCodeChangeEvent = async (
    roomCode: string,
    args: CodeChangeEventArgs
  ): Promise<void> => {
    const rawMessage = JSON.stringify(args)
    await redisClient.publish(codeChangeEventName(roomCode), rawMessage)
  }

  const publishCodeExecutionEvent = async (roomCode: string): Promise<void> => {
    await redisClient.publish(codeExecutionEventName(roomCode), "")
  }

  const publishCodeExecutionResultEvent = async (
    roomCode: string,
    output: string
  ): Promise<void> => {
    await redisClient.publish(codeExecutionResultEventName(roomCode), output)
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
