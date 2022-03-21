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

io.on("connection", (socket) => {
  socket.emit("myId", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended")
  })

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", {
      signal: signalData,
      from,
      name
    })
  })

  socket.on("answercall", (data) => {
    io.to(data.to).emit(callaccepted, data.signal)
  })
})

const PORT = process.env.PORT || 5002

server.listen(PORT, () => console.log(`Video server listening on port ${PORT}`))