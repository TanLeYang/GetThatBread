import "dotenv/config"
import express from "express"
import http from "http"
import createCodeService from "./coding"
import {
  CodeExecutionMessage,
  CodeModifiedMessage,
  initializeSocketServer,
  SaveCodeMessage,
  SocketType
} from "./socket"
import {
  createCodeExecutionController,
  createCodeModifiedController,
  createDisconnectController,
  createJoinRoomController,
  createSaveCodeController
} from "./controllers"
import { initializeDynamoDB } from "./dynamo"
import { newRedisClient, initializeRedisClient } from "./redis"

// Set up redis
const redisClient = newRedisClient()

// Set up socketio
const app = express()

app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK")
})

const server = http.createServer(app)
const io = initializeSocketServer(server)
const IO_PORT = process.env.PORT || 5001

// Intialize controllers and their dependencies
const codeService = createCodeService(redisClient)
const joinRoomController = createJoinRoomController(codeService)
const codeChangeController = createCodeModifiedController(codeService)
const saveCodeController = createSaveCodeController()
const codeExecutionController = createCodeExecutionController(codeService)
const disconnectController = createDisconnectController(codeService)

io.on("connection", (socket: SocketType) => {
  console.log("Client Connected!")
  socket.on("joinRoom", async (msg: string) => {
    await joinRoomController(socket, msg)
  })

  socket.on("informCodeModified", async (msg: CodeModifiedMessage) => {
    await codeChangeController(socket, msg)
  })

  socket.on("saveCode", async (msg: SaveCodeMessage) => {
    await saveCodeController(msg)
  })

  socket.on("executeCode", async (msg: CodeExecutionMessage) => {
    await codeExecutionController(msg)
  })

  socket.on("disconnect", async () => {
    await disconnectController(socket)
  })
})

Promise.all([initializeRedisClient(redisClient), initializeDynamoDB()]).then(
  () => {
    server.listen(IO_PORT, () => {
      console.log(`server listening on port ${IO_PORT}`)
    })
  }
)
