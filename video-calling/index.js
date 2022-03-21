import "dotenv/config"
import express from "express";
import { createServer } from "http"
import { Server } from "socket.io";

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const users = {}
const socketToRoom = {}

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    if (users[roomId]) {
      users[roomId].push(socket.id)
    } else {
      users[roomId] = [socket.id]
    }

    socketToRoom[socket.id] = roomId
    const usersInRoom = users[roomId].filter(id => id !== socket.id)
    socket.emit("allUsers", usersInRoom)
  })

  socket.on("sendingSignal", ({ signal, callerId, recipientId }) => {
    io.to(recipientId).emit("userJoined", {
      signal,
      callerId
    })
  })

  socket.on("returningSignal", ({ signal, callerId }) => {
    io.to(callerId).emit("receivedReturnSignal", {
      from: socket.id,
      signal
    })
  })

  socket.on("disconnect", () => {
    const roomId = socketToRoom[socket.id]
    if (!roomId) {
      return
    }

    const usersInRoom = users[roomId]
    if (!usersInRoom) {
      return
    }
    users[roomId] = usersInRoom.filter(id => id !== socket.id)
  })
})

const PORT = process.env.PORT || 5002

server.listen(PORT, () => console.log(`Video server listening on port ${PORT}`))