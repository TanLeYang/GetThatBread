import { Socket } from "socket.io"
import { CodeService, CodeState } from "./coding"
import { CodeModifiedMessage } from "./socket"

export function createJoinRoomController(codeService: CodeService) {
  return async (ws: Socket, msg: string) => {
    const roomCode = msg
    ws.join(roomCode)
    return codeService.subscribe(ws.id, roomCode, (codeState: CodeState) => {
      ws.emit("codeModified", codeState)
    })
  }
}

export function createCodeModifiedController(codeService: CodeService) {
  return async (msg: CodeModifiedMessage) => {
    return codeService.publish(msg.roomCode, msg.codeState)
  }
}

export function createDisconnectController(codeService: CodeService) {
  return async (ws: Socket) => {
    return codeService.unsubscribe(ws.id)
  }
}
