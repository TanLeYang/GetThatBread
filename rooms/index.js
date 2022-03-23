import "dotenv/config"
import express from "express"
import { createRoom, getRoom, initalizeDynamoDB } from "./dynamo.js"

const PORT = process.env.PORT || 5002
const app = express()

app.get("/", (req, res) => {
  res.send("HI")
})

app.get("/room/:roomCode", (req, res) => {
  const roomCode = req.params.roomCode
  const room = getRoom

  if (room) {
    res.status(200).json({
      success: true,
      roomExists: true,
      roomCode
    })
  } else {
    res.status(200).json({
      success: true,
      roomExists: false,
      roomCode: ""
    })
  }
})

app.post("/room", async (req, res) => {
  const newRoomCode = await createRoom()
  if (!newRoomCode) {
    res.status(500).json({
      success: false,
      errorMsg: "Could not create a new room, try again later"
    })
  } else {
    res.status(200).json({
      success: true,
      roomCode: newRoomCode
    })
  }
})

initalizeDynamoDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
})
