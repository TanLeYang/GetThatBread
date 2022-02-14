import express from "express";
import * as redis from "redis"
import http from "http"
import createCodeService from "./coding";
import { CodeModifiedMessage, initializeSocketServer, SocketType } from "./socket";
import { createCodeModifiedController, createDisconnectController, createJoinRoomController } from "./controllers";
import { initializeDynamoDB } from "./dynamo";

// Set up redis
const REDIS_SERVER = "redis://localhost:6379"
const redisClient = redis.createClient({
  url: REDIS_SERVER
})
export type RedisClientType = typeof redisClient

// Set up socketio
const app = express()
const server = http.createServer(app)
const io = initializeSocketServer(server)
const IO_PORT = 3000;

// Intialize controllers and their dependencies
const codeService = createCodeService(redisClient)
const joinRoomController = createJoinRoomController(codeService)
const codeChangeController = createCodeModifiedController(codeService)
const disconnectController = createDisconnectController(codeService)

io.on("connection", (socket: SocketType) => {
  socket.on("joinRoom", async (msg: string) => {
    await joinRoomController(socket, msg)
  })

  socket.on("informCodeModified", async (msg: CodeModifiedMessage) => {
    await codeChangeController(msg) 
  })

  socket.on("disconnect", async () => {
    await disconnectController(socket)
  })
})

Promise.all([
  redisClient.connect(),
  initializeDynamoDB()
])
.then(() => {
  server.listen(IO_PORT, () => {
    console.log(`server listening on port ${IO_PORT}`)
  })
})
