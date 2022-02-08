import { WebSocketServer } from "ws"
import * as redis from "redis"

const REDIS_SERVER = "redis://localhost:6379"
const WS_PORT = 3000;

const redisClient = redis.createClient({
  url: REDIS_SERVER
})

const subscriber = redisClient.duplicate()
subscriber.subscribe("test", (message) => {
  console.log(message);
})

const publisher = redisClient.duplicate()

const server = new WebSocketServer({ port: WS_PORT })

server.on("connection", (ws) => {
  publisher.publish("test", "hello world")
})

console.log("WebSocket server started at ws://locahost:"+ WS_PORT);
