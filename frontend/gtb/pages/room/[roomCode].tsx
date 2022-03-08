import { NextPage } from "next";
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client";
import { CodeModifiedMessage, CodeState, SaveCodeMessage } from "../../constants/types/coding";
import { codeModifiedEvent, informCodeModifiedEvent, initialStateEvent, joinRoomEvent, saveCodeEvent } from "../../constants/types/socket_events";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {ssr: false})

const Room: NextPage = () => {

  const saveCodeInterval = 5000
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [code, setCode] = useState("")
  const [socket, setSocket] = useState<Socket|null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const { roomCode } = router.query
    const roomCodeStr = getRoomCodeStr(roomCode)
    setRoomCode(roomCodeStr)

    const codingSocket = io("ws://localhost:5000")

    codingSocket.emit(joinRoomEvent, roomCodeStr)

    codingSocket.on(codeModifiedEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    codingSocket.on(initialStateEvent, (codeState: CodeState) => {
      setCode(codeState.code)
    })

    setSocket(codingSocket)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, setSocket])

  // periodically save code
  useEffect(() => {
    if (socket == null || roomCode == "") return

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
  }, [socket, code, roomCode])

  const onCodeChange = (newCode: string) => {
    const codeModifiedMessage: CodeModifiedMessage = {
      roomCode: getRoomCodeStr(roomCode),
      codeState: {
        code: newCode,
        language: "PYTHON"
      }
    }

    socket?.emit(informCodeModifiedEvent, codeModifiedMessage)
  }

  return (
    <div className="bg-gray-700 h-screen w-screen flex flex-col">
      <h3 className="text-white lg:text-left m-5"> Room Code: {roomCode} </h3>
      <div className="flex h-4/5">
        <CodeEditor
          value={code}
          onChange={onCodeChange}
        />

        <h1> VIDEO SECTION HERE! </h1>
      </div>
    </div>
  )
}

const getRoomCodeStr = (roomCode: string | string[] | undefined): string => {
  if (roomCode == undefined || Array.isArray(roomCode)) {
    return ""
  }

  return roomCode
}

export default Room