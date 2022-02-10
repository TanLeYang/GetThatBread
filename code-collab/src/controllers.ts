import { WebSocket } from "ws"
import { CodeService, CodeState, Room } from "./coding"

export function createJoinRoomController(codeService: CodeService) {
  return async (ws: WebSocket, msg: string) => {
    const roomCode = msg
    const room = await codeService.joinRoom(roomCode)
    await subscribeToRoom(ws, room)
  }
}

async function subscribeToRoom(ws: WebSocket, room: Room) {
  await room.subscribe((codeState: CodeState) => {
    sendJSON(ws, codeState)
  })
}

function sendJSON(ws: WebSocket, msg: any) {
  const stringified = JSON.stringify(msg)
  ws.send(stringified, (err) => {
    console.log(`error sending JSON ${msg} over websocket msg ${err}`)
  })
}
