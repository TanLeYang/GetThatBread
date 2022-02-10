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

function createRoom(redisClient: RedisClientType, roomCode: string): Room {
  const subscribeFunction = async (callback: (codeState: CodeState) => void) => {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
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

export interface CodeService {
  getRoom(roomCode: string): Room 
}

export default function createCodeService(redisClient: RedisClientType): CodeService {

  function getRoom(roomCode: string): Room {
    return createRoom(redisClient, roomCode)
  }

  return {
    getRoom
  }
}