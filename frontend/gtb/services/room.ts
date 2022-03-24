import axios from "axios"

export async function checkRoomExists(roomCode: string) {
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_ROOM_SERVER}/room/${roomCode}`
  )

  const { success, roomExists } = result.data
  return success && roomExists
}

export async function createRoom() {
  const result = await axios.post(`${process.env.NEXT_PUBLIC_ROOM_SERVER}/room`)

  const { success, roomCode } = result.data

  return success ? roomCode : ""
}
