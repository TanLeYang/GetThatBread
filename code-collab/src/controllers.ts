import { Socket } from "socket.io"
import { CodeService, CodeState, SubscriptionState } from "./coding"
import { CodeModifiedMessage } from "./socket"

export function createJoinRoomController(codeService: CodeService) {
  return async (ws: Socket, msg: string, subscriptions: SubscriptionState) => {
    const roomCode = msg
    ws.join(roomCode)
    return codeService.subscribe(subscriptions, ws.id, roomCode, (codeState: CodeState) => {
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
  return async (ws: Socket, subscriptions: SubscriptionState) => {
    return codeService.unsubscribe(subscriptions, ws.id)
  }
}
