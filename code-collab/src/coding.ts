import { RedisClientType } from "./server"

export type CodeState = {
  code: string
  language: CodeLanguage
} 

export enum CodeLanguage {
  PYTHON
}

export type Room = {
  roomCode: string
  subscribe(callback: (codeState: CodeState) => void): Promise<void>
  publish(codeState: CodeState): Promise<void>
}

export interface CodeService {
  joinRoom(roomCode: string): Promise<Room> 
}

export default function createCodeService(redisClient: RedisClientType): CodeService {

  async function joinRoom(roomCode: string): Promise<Room> {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
    const subscribeFunction = async (callback: (codeState: CodeState) => void) => {
      await subscriber.subscribe(roomCode, (msg) => {
        const codeState = JSON.parse(msg)
        callback(codeState)
      }) 
    }

    const publishFunction = async (codeState: CodeState) => {
      const rawMessage = JSON.stringify(codeState)
      await redisClient.publish(roomCode, rawMessage)
    }

    return {
      roomCode: roomCode,
      subscribe: subscribeFunction,
      publish: publishFunction
    }
  }

  return {
    joinRoom
  }
}