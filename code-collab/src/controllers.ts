import { WebSocket } from "ws"
import { CodeService, CodeState, Room } from "./coding"

export function createJoinRoomController(codeService: CodeService) {
  return async (ws: WebSocket, msg: string) => {
    const roomCode = msg
    const room = codeService.getRoom(roomCode)
    await subscribeToRoom(ws, room)
  }
}

async function subscribeToRoom(ws: WebSocket, room: Room) {
  await room.subscribe((codeState: CodeState) => {
    sendJSON(ws, codeState)
  })
}

export type CodeChangeMessage = {
  roomCode: string,
  codeState: CodeState
}

export function createCodeChangeController(codeService: CodeService) {
  return async (msg: string) => {
    const codeChangeMsg: CodeChangeMessage = JSON.parse(msg)
    const room = codeService.getRoom(codeChangeMsg.roomCode)

    room.publish(codeChangeMsg.codeState)
  }
}

function sendJSON(ws: WebSocket, msg: any) {
  const stringified = JSON.stringify(msg)
  ws.send(stringified, (err) => {
    console.log(`error sending JSON ${msg} over websocket msg ${err}`)
  })
}
