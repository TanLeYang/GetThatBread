import { CodeService, CodeState } from "./coding"
import { addOrUpdateDocument, getOrCreateDocument, RoomDocument } from "./dynamo"
import AWSLambda from "./lambda"
import { CodeModifiedMessage, SaveCodeMessage, SocketType } from "./socket"

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

export function createSaveCodeController() {
  return async (msg: SaveCodeMessage) => {
    const roomDocument: RoomDocument = {
      roomCode: msg.roomCode,
      content: msg.codeState.code,
      language: msg.codeState.language
    }

    addOrUpdateDocument(roomDocument)
  }
}

export function createCodeExecutionController() {
  return async (ws: SocketType, msg: CodeState) => {
    const lambdaParams = {
      FunctionName: "code-exec-dev-main",
      Payload: JSON.stringify({
        "body": {
          "code": msg.code
        }
      })
    }

    const result = await AWSLambda.invoke(lambdaParams).promise()
    console.log(result)
    if (result.$response.error) {
      ws.emit("codeExecutionResult", "something went wrong, please try again")
    }

    const data = JSON.parse(result.Payload.toString())

    ws.emit("codeExecutionResult", data.body)
  }
}

export function createDisconnectController(codeService: CodeService) {
  return async (ws: SocketType) => {
    return codeService.unsubscribe(ws.id)
  }
}
