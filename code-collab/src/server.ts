import { WebSocketServer } from "ws"
import * as redis from "redis"
import { WS_CONNECTION, WS_JOIN_ROOM_REQ } from "./constants";

const REDIS_SERVER = "redis://localhost:6379"
const WS_PORT = 3000;

const redisClient = redis.createClient({
  url: REDIS_SERVER
})

const subscriber = redisClient.duplicate()
subscriber.connect()
subscriber.subscribe("test", (message) => {
  console.log(message);
})

const server = new WebSocketServer({ port: WS_PORT })

server.on(WS_CONNECTION, async (ws) => {
  ws.on(WS_JOIN_ROOM_REQ, (msg) => {
    
  })
})

console.log("WebSocket server started at ws://locahost:"+ WS_PORT);
