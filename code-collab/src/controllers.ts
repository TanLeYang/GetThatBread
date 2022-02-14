import { CodeService, CodeState } from "./coding"
import { getOrCreateDocument } from "./dynamo"
import { CodeModifiedMessage, SocketType } from "./socket"

export function createJoinRoomController(codeService: CodeService) {
  return async (ws: SocketType, msg: string) => {
    const roomCode = msg
    ws.join(roomCode)

    const roomDocument = await getOrCreateDocument(roomCode)
    const initialCodeState: CodeState = {
      code: roomDocument.content,
      language: roomDocument.language 
    }
    ws.emit("initialState", initialCodeState)

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
  return async (ws: SocketType) => {
    return codeService.unsubscribe(ws.id)
  }
}
