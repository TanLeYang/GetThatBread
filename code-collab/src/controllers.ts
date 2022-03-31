import { CodeChangeEventArgs, CodeService, CodeState } from "./coding"
import { addOrUpdateDocument, getOrCreateDocument, RoomDocument } from "./dynamo"
import AWSLambda from "./lambda"
import { CodeExecutionMessage, CodeModifiedMessage, SaveCodeMessage, SocketType } from "./socket"

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

    const codeChangeSubscription = codeService.subscribeCodeChangeEvent(
      ws.id,
      roomCode,
      (args: CodeChangeEventArgs) => {
        if (args.publisherID === ws.id) {
          return
        }
        ws.emit("codeModified", args.codeState)
      }
    )

    const codeExecutionSubscription = codeService.subscribeCodeExecutionEvent(
      ws.id,
      roomCode,
      () => {
        ws.emit("codeExecutionStarted")
      }
    )

    const codeExecutionResultSubscription = codeService.subscribeCodeExecuionResultEvent(
      ws.id,
      roomCode,
      (output: string) => {
        ws.emit("codeExecutionResult", output)
      }
    )

    return await Promise.all([
      codeChangeSubscription,
      codeExecutionSubscription,
      codeExecutionResultSubscription
    ])
  }
}

export function createCodeModifiedController(codeService: CodeService) {
  return async (ws: SocketType, msg: CodeModifiedMessage) => {
    const codeChangeEventArgs: CodeChangeEventArgs = {
      publisherID: ws.id,
      codeState: msg.codeState
    }
    return codeService.publishCodeChangeEvent(msg.roomCode, codeChangeEventArgs)
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

export function createCodeExecutionController(codeService: CodeService) {
  return async (msg: CodeExecutionMessage) => {
    codeService.publishCodeExecutionEvent(msg.roomCode)

    const lambdaParams = {
      FunctionName: "code-exec-dev-main",
      Payload: JSON.stringify({
        body: {
          code: msg.codeState.code
        }
      })
    }

    const result = await AWSLambda.invoke(lambdaParams).promise()
    if (result.$response.error) {
      codeService.publishCodeExecutionResultEvent(
        msg.roomCode,
        "something went wrong, please try again"
      )
    }

    const data = JSON.parse(result.Payload.toString())
    const { output } = JSON.parse(data.body)
    codeService.publishCodeExecutionResultEvent(msg.roomCode, output)
  }
}

export function createDisconnectController(codeService: CodeService) {
  return async (ws: SocketType) => {
    return codeService.unsubscribe(ws.id)
  }
}
