import express from "express";
import * as redis from "redis"
import http from "http"
import createCodeService, { CodeState } from "./coding";
import { CodeModifiedMessage, initializeSocketServer, SocketType } from "./socket";
import { createCodeModifiedController, createJoinRoomController } from "./controllers";

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

io.on("connection", (socket: SocketType) => {
  socket.on("joinRoom", (msg: string) => {
    console.log("joinRoom")
    joinRoomController(socket, msg)
  })

  socket.on("informCodeModified", (msg: CodeModifiedMessage) => {
    console.log(msg)
    codeChangeController(msg) 
  })
})

server.listen(IO_PORT, () => {
  console.log(`server listening on port ${IO_PORT}`)
})
