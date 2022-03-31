import axios from "axios"

function getRoomServerURL(): string {
  const apiDomain = process.env.NEXT_PUBLIC_GTB_API_DOMAIN
  if (!apiDomain) {
    return process.env.NEXT_PUBLIC_ROOM_SERVER || "http://localhost:5003"
  }

  return `https://${apiDomain}/rooms`
}
export async function checkRoomExists(roomCode: string) {
  const roomServerURL = getRoomServerURL()
  const result = await axios.get(`${roomServerURL}/room/${roomCode}`)

  const { success, roomExists } = result.data
  return success && roomExists
}

export async function createRoom() {
  const roomServerURL = getRoomServerURL()
  console.log(roomServerURL)
  const result = await axios.post(`${roomServerURL}/room`)

  const { success, roomCode } = result.data

  return success ? roomCode : ""
}
