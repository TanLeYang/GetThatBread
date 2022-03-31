import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import {
  codeExecutionResultEvent,
  codeModifiedEvent,
  initialStateEvent,
  joinRoomEvent,
  saveCodeEvent
} from "../constants/socketEvents"
import { CodeState, SaveCodeMessage } from "../constants/types/coding"
import { getSocketIOClient } from "../services/socket"

export function useCodingSocket(roomCode: string) {
  const saveCodeInterval = 5000

  const codingSocketRef = useRef<Socket>()
  const latestOutput = useRef("")

  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isLoadingOutput, setIsLoadingOutput] = useState(false)

  useEffect(() => {
    const codingSocket = getSocketIOClient("CODING")

    codingSocketRef.current = codingSocket

    codingSocket.emit(joinRoomEvent, roomCode)

    codingSocket.on(codeModifiedEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    codingSocket.on(initialStateEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    codingSocket.on(codeExecutionResultEvent, (newOutput: string) => {
      setIsLoadingOutput(false)
      setOutput((prev) => {
        latestOutput.current = prev + "\n" + newOutput
        return latestOutput.current
      })
    })
  }, [roomCode])

  useEffect(() => {
    const socket = codingSocketRef.current

    if (!socket) return

    const saveCodeMessage: SaveCodeMessage = {
      roomCode,
      codeState: {
        code: code,
        language: "PYTHON"
      }
    }

    const interval = setInterval(() => {
      socket.emit(saveCodeEvent, saveCodeMessage)
    }, saveCodeInterval)

    return () => {
      clearInterval(interval)
    }
  }, [code, roomCode])

  return {
    code,
    setCode,
    output,
    setOutput,
    isLoadingOutput,
    setIsLoadingOutput,
    codingSocketRef
  }
}
