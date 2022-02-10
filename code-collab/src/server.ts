import { WebSocketServer } from "ws"
import * as redis from "redis"
import { WS_CONNECTION, WS_JOIN_ROOM_REQ } from "./constants";
import { createJoinRoomController } from "./controllers";
import createCodeService from "./coding";

const REDIS_SERVER = "redis://localhost:6379"
const WS_PORT = 3000;

const redisClient = redis.createClient({
  url: REDIS_SERVER
})

export type RedisClientType = typeof redisClient

const subscriber = redisClient.duplicate()
subscriber.connect()
subscriber.subscribe("test", (message) => {
  console.log(message);
})

// Intialize dependencies
const codeService = createCodeService(redisClient)

const joinRoomController = createJoinRoomController(codeService)

const server = new WebSocketServer({ port: WS_PORT })
server.on(WS_CONNECTION, async (ws) => {
  ws.on(WS_JOIN_ROOM_REQ, (msg) => {
    joinRoomController(ws, msg) 
  })
})

console.log("WebSocket server started at ws://locahost:"+ WS_PORT);
