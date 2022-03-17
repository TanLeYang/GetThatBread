import "dotenv/config"
import express from "express";
import * as redis from "redis"
import http from "http"
import createCodeService, { CodeState } from "./coding";
import { CodeModifiedMessage, initializeSocketServer, SaveCodeMessage, SocketType } from "./socket";
import { createCodeExecutionController, createCodeModifiedController, createDisconnectController, createJoinRoomController, createSaveCodeController } from "./controllers";
import { initializeDynamoDB } from "./dynamo";

// Set up redis
const REDIS_SERVER = process.env.REDIS_URL
const redisClient = redis.createClient({
  url: REDIS_SERVER
})
export type RedisClientType = typeof redisClient

// Set up socketio
const app = express()
const server = http.createServer(app)
const io = initializeSocketServer(server)
const IO_PORT = 5001

// Intialize controllers and their dependencies
const codeService = createCodeService(redisClient)
const joinRoomController = createJoinRoomController(codeService)
const codeChangeController = createCodeModifiedController(codeService)
const saveCodeController = createSaveCodeController()
const codeExecutionController = createCodeExecutionController()
const disconnectController = createDisconnectController(codeService)

io.on("connection", (socket: SocketType) => {
  console.log("Client Connected!")
  socket.on("joinRoom", async (msg: string) => {
    await joinRoomController(socket, msg)
  })

  socket.on("informCodeModified", async (msg: CodeModifiedMessage) => {
    await codeChangeController(msg)
  })

  socket.on("saveCode", async (msg: SaveCodeMessage) => {
    await saveCodeController(msg)
  })

  socket.on("executeCode", async (codeState: CodeState) => {
    await codeExecutionController(socket, codeState)
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
