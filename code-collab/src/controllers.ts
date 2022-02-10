import { Socket } from "socket.io"
import { CodeService, CodeState, Room } from "./coding"
import { CodeModifiedMessage } from "./socket"

export function createJoinRoomController(codeService: CodeService) {
  return async (ws: Socket, msg: string) => {
    const roomCode = msg
    ws.join(roomCode)
    const room = codeService.getRoom(roomCode)
    await subscribeToRoom(ws, room)
  }
}

async function subscribeToRoom(ws: Socket, room: Room) {
  await room.subscribe((codeState: CodeState) => {
    ws.emit("codeModified", codeState)
  })
}

export function createCodeModifiedController(codeService: CodeService) {
  return async (msg: CodeModifiedMessage) => {
    const room = codeService.getRoom(msg.roomCode)
    room.publish(msg.codeState)
  }
}
